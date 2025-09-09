const fs = require("fs");
const path = require("path");
const url = require("url");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const ErrorHandler = require("./errorHandler");

// Ensure upload directory exists
const ensureUploadDirectory = (uploadDir) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Generate a unique file name
const generateUniqueFileName = (originalName) => {
  const extension = path.extname(originalName);
  const filename = `${
    new Date().toISOString().split("T")[0]
  }-${uuidv4()}${extension}`;
  return filename;
};

// Upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return {
      file_name: result.public_id,
      file_full_url: result.secure_url,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Save file locally
const saveLocally = (file, uploadDir, schemaFolder = "") => {
  return new Promise((resolve, reject) => {
    ensureUploadDirectory(uploadDir);

    const filename = generateUniqueFileName(file.originalname);
    const fileDir = path.join(uploadDir, schemaFolder);
    ensureUploadDirectory(fileDir);

    const fullFilePath = path.join(fileDir, filename);

    fs.rename(file.path, fullFilePath, (err) => {
      if (err) return reject(err);
      const fileFullUrl = `${
        process.env.BASE_URL || `http://localhost:${process.env.PORT}`
      }/public/uploads/${schemaFolder}/${filename}`.replace(/\\/g, "/");
      resolve({
        file_name: filename,
        file_full_url: fileFullUrl,
      });
    });
  });
};

// Main function to handle file upload
const handleFileUpload = async (file, folder = "", schemaFolder = "") => {
  if (!file) throw new Error("No file provided");

  const uploadDir = "public/uploads";
  const fileFolder = folder ? folder : schemaFolder;

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return await uploadToCloudinary(file.path, fileFolder);
  } else {
    return await saveLocally(file, uploadDir, fileFolder);
  }
};

// Exported async function for single file
exports.uploadFile = async (file, folder = "", schemaFolder = "", callback) => {
  try {
    const uploadResult = await handleFileUpload(file, folder, schemaFolder);
    if (callback) callback(null, uploadResult);
  } catch (error) {
    if (callback) callback(error);
  }
};

// Exported async function for multiple files
exports.uploadMultipleFiles = async (
  files,
  folder = "",
  schemaFolder = "",
  callback
) => {
  try {
    const uploadPromises = files.map((file) =>
      handleFileUpload(file, folder, schemaFolder)
    );
    const uploadResults = await Promise.all(uploadPromises);

    // console.log("uploadResults:", uploadResults);
    if (callback) callback(null, uploadResults);

    return uploadResults;
  } catch (error) {
    if (callback) callback(error);
  }
};

// Convert URL to file system path
const urlToFilePath = (fileUrl) => {
  const parsedUrl = url.parse(fileUrl);
  return path.join(__dirname, "..", parsedUrl.pathname);
};

// Delete a file from the local server
exports.deleteLocalFile = async (fileFullUrl, callback) => {
  try {
    const filePath = urlToFilePath(fileFullUrl); // Convert URL to file path
    fs.unlink(filePath, (err) => {
      if (err) {
        if (callback) callback(err, false);
      } else {
        if (callback) callback(null, true);
      }
    });
  } catch (error) {
    if (callback) callback(error, false);
  }
};

// Delete a file from Cloudinary
exports.deleteCloudinaryFile = async (fileName, callback) => {
  try {
    const result = await cloudinary.uploader.destroy(fileName);
    if (result.result !== "ok") {
      if (callback)
        callback(new Error("Cloudinary file deletion failed"), false);
    } else {
      if (callback) callback(null, true);
    }
  } catch (error) {
    if (callback) callback(error, false);
  }
};

exports.fileUploadPromises = async (
  req,
  res,
  next,
  fieldsToUpload,
  FolderName
) => {
  const fileUploadPromises = [];

  // Function to handle file update with deletion of old file
  const handleFileUpload = (newFile, folder, fieldName) => {
    return new Promise(async (resolve, reject) => {
      // Directly upload the new file
      await this.uploadFile(newFile, folder, fieldName, (err, uploadResult) => {
        if (err) {
          reject(new ErrorHandler("File upload failed: " + err.message, 500));
        } else {
          resolve({
            file_name: uploadResult.file_name,
            file_full_url: uploadResult.file_full_url,
            fieldName: fieldName,
          });
        }
      });
    });
  };

  // Function to loop through each field and create upload promises
  const uploadingFile = (fieldsToUpload, folder) => {
    fieldsToUpload.forEach((field) => {
      if (req.files && req.files[field]) {
        // Handle the case where multiple files are uploaded for a field
        const newFile = req.files[field][0];
        fileUploadPromises.push(handleFileUpload(newFile, folder, field));
      }
    });
  };

  // Execute the upload function for the provided fields
  uploadingFile(fieldsToUpload, FolderName);

  // Wait for all file uploads to finish
  const uploadResults = await Promise.all(fileUploadPromises);

  // Assign uploaded files to req.body
  uploadResults.forEach((result) => {
    req.body[result.fieldName] = result.file_name;
    req.body[`${result.fieldName}_full_url`] = result.file_full_url;
  });

  return req.body; // Return the modified request body
};

exports.fileUpdatePromises = async (
  req,
  res,
  next,
  fieldsToUpload,
  FolderName,
  model
) => {
  const fileUploadPromises = [];

  // Function to handle file update with deletion of old file
  const handleFileUpdate = (
    newFile,
    folder,
    fieldName,
    existingFileName,
    existingFileUrl
  ) => {
    return new Promise(async (resolve, reject) => {
      const deleteCallback = (err) => {
        if (err) {
          return next(
            new ErrorHandler("File removal failed: " + err.message, 404)
          );
        } else {
          // Proceed with the new file upload after deletion
          this.uploadFile(newFile, folder, fieldName, (err, uploadResult) => {
            if (err) {
              return next(
                reject(
                  new ErrorHandler("File upload failed: " + err.message, 500)
                )
              );
            } else {
              resolve({
                file_name: uploadResult.file_name,
                file_full_url: uploadResult.file_full_url,
                fieldName: fieldName,
              });
            }
          });
        }
      };

      // If there's an existing file, delete it first, then upload the new file
      if (existingFileName) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          this.deleteCloudinaryFile(existingFileName, deleteCallback);
        } else {
          this.deleteLocalFile(existingFileUrl, deleteCallback);
        }
      } else {
        // Directly upload the new file
        await this.uploadFile(
          newFile,
          folder,
          fieldName,
          (err, uploadResult) => {
            if (err) {
              reject(
                new ErrorHandler("File upload failed: " + err.message, 500)
              );
            } else {
              resolve({
                file_name: uploadResult.file_name,
                file_full_url: uploadResult.file_full_url,
                fieldName: fieldName,
              });
            }
          }
        );
      }
    });
  };

  // Function to loop through each field and create upload promises
  const uploadingFile = (fieldsToUpload, folder, model) => {
    fieldsToUpload.forEach((field) => {
      if (req.files && req.files[field]) {
        // Handle the case where multiple files are uploaded for a field
        const newFile = req.files[field][0];
        fileUploadPromises.push(
          handleFileUpdate(
            newFile,
            folder,
            field,
            model[field], // old file name (if any)
            model[`${field}_full_url`] // old file URL (if any)
          )
        );
      }
    });
  };

  // Execute the upload function for the provided fields
  uploadingFile(fieldsToUpload, FolderName, model);

  // Wait for all file uploads to finish
  const uploadResults = await Promise.all(fileUploadPromises);

  // Assign uploaded files to req.body
  uploadResults.forEach((result) => {
    req.body[result.fieldName] = result.file_name;
    req.body[`${result.fieldName}_full_url`] = result.file_full_url;
  });

  return req.body; // Return the modified request body
};

exports.filesUpdatePromises = async (
  req,
  res,
  next,
  fieldsToUpload,
  folderName
) => {
  const filesUploadPromises = [];

  // Iterate over each field to upload
  fieldsToUpload.forEach((field) => {
    if (req.files?.[field]) {
      const multipleFiles = this.uploadMultipleFiles(
        req.files[field],
        folderName
      );
      filesUploadPromises.push(multipleFiles);
    }
  });

  // Wait for all file uploads to complete
  const filesResults = await Promise.all(filesUploadPromises);

  // Attach uploaded files to the corresponding fields in req.body
  fieldsToUpload.forEach((field, index) => {
    if (Array.isArray(filesResults[index])) {
      const files = filesResults[index].map((r) => ({
        file: r.file_name,
        file_full_url: r.file_full_url,
      }));

      // Concatenate or assign uploaded files to the corresponding field in req.body
      req.body[field] = req.body[field] ? req.body[field].concat(files) : files;
    }
  });

  return req.body;
};
