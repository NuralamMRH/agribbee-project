const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { HomePageTabs, Language } = require("../models");
const {
  uploadFile,
  deleteCloudinaryFile,
  deleteLocalFile,
} = require("../utils/fileUploader");

exports.getHomePageTabs = async (req, res, next) => {
  try {
    // Simulate fetching data
    const language = req.headers["x-localization"] || "vi";
    const PageTabs = await HomePageTabs();

    const tabsContent = await PageTabs.find();

    const languages = await Language.find();

    // Convert each document in the array to a plain object
    const contentPageObjects = tabsContent.map((tab) => tab.toObject());

    // Build the translated content dynamically based on the selected language
    const translatedContents = contentPageObjects.map(
      (tab) => tab[language] || {}
    );

    // Remove all language-specific fields from each tab
    const responseContents = contentPageObjects.map((tabObject, index) => {
      Object.keys(tabObject).forEach((key) => {
        if (languages.map((lang) => lang.key).includes(key)) {
          delete tabObject[key];
        }
      });

      // Merge the translated content with the other fields
      return { ...translatedContents[index], ...tabObject };
    });

    // Send the actual response when the stream is unlocked
    return res.status(200).json({
      success: true,
      data: responseContents,
    });
  } catch (error) {
    return next(new ErrorHandler("Tabs not found " + error, 500));
  }
};

exports.homePageTab = catchAsyncErrors(async (req, res, next) => {
  try {
    const homePageTabs = await HomePageTabs();
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
            reject(
              new ErrorHandler("File removal failed: " + err.message, 404)
            );
          } else {
            // Proceed with the new file upload after deletion
            uploadFile(newFile, folder, fieldName, (err, uploadResult) => {
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
            });
          }
        };

        if (existingFileName) {
          if (process.env.CLOUDINARY_CLOUD_NAME) {
            deleteCloudinaryFile(existingFileName, deleteCallback);
          } else {
            deleteLocalFile(existingFileUrl, deleteCallback);
          }
        } else {
          // If no existing file, directly upload the new file
          await uploadFile(newFile, folder, fieldName, (err, uploadResult) => {
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
          });
        }
      });
    };

    function uploadingFile(fields, folder, home) {
      fields.forEach((field) => {
        if (req.files[field]) {
          fileUploadPromises.push(
            handleFileUpdate(
              req.files[field][0],
              folder,
              field,
              home[field],
              home[`${field}_full_url`]
            )
          );
        }
      });
    }

    // Push file upload promises if files exist

    const fieldsToUpload = ["icon_image"];
    uploadingFile(fieldsToUpload, "home-tabs", homePageTabs);

    const uploadResults = await Promise.all(fileUploadPromises);

    uploadResults.forEach((result) => {
      // Handle single file upload results
      req.body[result.fieldName] = result.file_name;
      req.body[result.fieldName + "_full_url"] = result.file_full_url;
    });

    // Create or update the config document

    tab = new homePageTabs({ ...req.body });

    // Save the configuration
    await tab.save();
    res.status(201).json({
      success: true,
      tab,
    });
  } catch (err) {
    return next(new ErrorHandler("Some problems with this API", 500));
  }
});

exports.updateTab = catchAsyncErrors(async (req, res, next) => {
  try {
    // console.log(req.body);
    const homePageTabs = await HomePageTabs();
    const updatedTab = await homePageTabs.findByIdAndUpdate(
      req.params.id,
      ...req.body,
      {
        new: true,
        runValidators: false,
        useFindAndModify: false,
      }
    );

    res.status(201).json({
      success: true,
      tab: updatedTab,
    });
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(new ErrorHandler(`Error: ${error.message}`, 500));
  }
});
