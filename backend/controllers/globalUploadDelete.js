const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const models = require("../models");
const ErrorHandler = require("../utils/errorHandler");
const {
  fileUploadPromises,
  filesUpdatePromises,
  deleteCloudinaryFile,
  deleteLocalFile,
} = require("../utils/fileUploader");

exports.uploadFile = catchAsyncErrors(async (req, res, next) => {
  const userData = await models.User.findById(req.user.id);
  // Upload single image file if exists

  let uploadedFiles;

  // console.log("Uploading", req.files.file);

  const userFolderName = req.body.folderName ? "/" + req.body.folderName : "";
  const username = userData?.username ? userData?.username : req.user.id;

  const fieldToUpload = ["file"];
  const folderPath = username + userFolderName;

  if (req.files.file[0]) {
    uploadedFiles = await fileUploadPromises(
      req,
      res,
      next,
      fieldToUpload,
      folderPath
    );
  }

  const fieldsToUpload = ["files"];

  uploadedFiles = await filesUpdatePromises(
    req,
    res,
    next,
    fieldsToUpload,
    folderPath
  );

  res.status(200).json(uploadedFiles);
});

exports.deleteFile = catchAsyncErrors(async (req, res, next) => {
  const { fileName, type, schema, id } = req.body;

  // Validate input
  if (!fileName || !type || !schema) {
    return next(new ErrorHandler("Missing required parameters", 400));
  }

  // Dynamically get the model based on the schema name
  const Model = models[schema];
  if (!Model) {
    return next(new ErrorHandler("Invalid schema name", 400));
  }

  // Find the document based on schema and id or using findOne
  let document;
  if (id) {
    document = await Model.findById(id);
  } else {
    document = await Model.findOne();
  }

  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }

  // Function to delete files based on type
  const deleteFiles = async (fileType) => {
    let filesToUpdate;
    let fileFound = false;

    if (Array.isArray(document[fileType])) {
      filesToUpdate = document[fileType].filter(
        (file) => file.file !== fileName
      );
      const file = document[fileType].find((file) => file.file === fileName);

      console.log("Found file:", file);
      console.log("File URL to be deleted:", file.file_full_url);

      // Log the file_full_url before calling deleteLocalFile

      if (file) {
        fileFound = true;

        if (process.env.CLOUDINARY_CLOUD_NAME) {
          await deleteCloudinaryFile(fileName, handleDeletionCallback);
        } else {
          await deleteLocalFile(file.file_full_url, handleDeletionCallback);
        }

        // Update the document with the remaining files
        if (fileFound) {
          document[fileType] = filesToUpdate;
        }
      }

      // If file not found in array, throw an error
      if (!fileFound) {
        throw new ErrorHandler(
          `File with file name "${fileName}" not found in ${fileType}`,
          404
        );
      }
    } else if (fileType in document) {
      const file = document[fileType];

      if (file !== fileName) {
        fileFound = true;
      }

      console.log(`Deleting single file: ${document[`${fileType}_full_url`]}`);

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        await deleteCloudinaryFile(fileName, handleDeletionCallback);
      } else {
        await deleteLocalFile(
          document[`${fileType}_full_url`],
          handleDeletionCallback
        );
      }

      // Remove file reference from document
      if (fileFound) {
        document[fileType] = null;
        document[`${fileType}_full_url`] = null;
      }

      if (!fileFound) {
        throw new ErrorHandler(
          `File with file name "${fileName}" not found in ${fileType}`,
          404
        );
      }
    }
  };

  function handleDeletionCallback(err, success) {
    if (err || !success) {
      throw new ErrorHandler("File deletion failed", 500);
    }
  }

  if (Array.isArray(type)) {
    // If type is an array, process each type
    for (const fileType of type) {
      await deleteFiles(fileType);
    }
  } else {
    // If type is a single value, handle it
    await deleteFiles(type);
  }

  // Save the updated document
  await document.save();

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
    result: document,
  });
});
