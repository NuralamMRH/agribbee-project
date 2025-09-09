const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
const {
  uploadFile,
  deleteLocalFile,
  deleteCloudinaryFile,
  uploadMultipleFiles,
} = require("../utils/fileUploader");
const { default: mongoose } = require("mongoose");
const Language = require("../models/config/language");

const { PaymentMethod, SocialMedia, SocialLogin } = require("../models");
const configSchema = require("../models/config/config");

// controllers/configController.js
exports.newConfig = catchAsyncErrors(async (req, res, next) => {
  try {
    const Config = await configSchema();
    let config = await Config.findOne();
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

    // Push file upload promises if files exist
    if (req.files.logo) {
      fileUploadPromises.push(
        handleFileUpdate(
          req.files.logo[0],
          "config",
          "logo",
          config.logo,
          config.logo_full_url
        )
      );
    }

    if (req.files.fav_icon) {
      fileUploadPromises.push(
        handleFileUpdate(
          req.files.fav_icon[0],
          "config",
          "fav_icon",
          config.fav_icon,
          config.fav_icon_full_url
        )
      );
    }

    // Check if banners are present and upload multiple files
    if (req.files.banners) {
      fileUploadPromises.push(
        uploadMultipleFiles(req.files.banners, "config/banners", "banners")
      );
    }

    req.body.banners = config.banners || [];

    // Wait for all file uploads to complete
    const uploadResults = await Promise.all(fileUploadPromises);

    // Map the results to req.body

    console.log("req.files.banners: ", req.files.banners);

    console.log("fileUploadPromises: ", fileUploadPromises);

    // Map the results to req.body
    console.log("Before:", req.body.banners);
    uploadResults.forEach((result) => {
      if (Array.isArray(result)) {
        const newBanners = result.map((r) => ({
          file: r.file_name,
          file_full_url: r.file_full_url,
        }));

        // Merge old and new banners
        req.body.banners = req.body.banners.concat(newBanners);
      } else {
        // Handle single file upload results
        req.body[result.fieldName] = result.file_name;
        req.body[result.fieldName + "_full_url"] = result.file_full_url;
      }
    });
    console.log("After:", req.body.banners);

    // Create or update the config document
    if (!config) {
      config = new Config({ ...req.body });
    } else {
      config.set({ ...req.body });
    }

    // Save the configuration
    await config.save();
    res.status(201).json({
      success: true,
      config,
    });
  } catch (err) {
    console.error("ErrorHandler:", err.message); // Log the specific error message for debugging
    return next(new ErrorHandler("Some problems with this API", 500));
  }
});

// Get all Config   =>   /api/v1/config
exports.getConfig = catchAsyncErrors(async (req, res, next) => {
  const language = req.headers["x-localization"] || "vi";

  // Fetch the config document
  const Config = await configSchema();
  const config = await Config.findOne()
    .select("-_id")
    .populate("language")
    .populate("social_media")
    .populate("apple_login")
    .populate("social_login")
    .populate("active_payment_method_list");

  if (!config) {
    return next(new ErrorHandler("Configuration not found", 404));
  }

  // Convert config document to a plain object
  const configObject = config.toObject();

  // Build the translated content dynamically based on the selected language
  const translatedContent = configObject[language] || {};

  // Remove all language-specific fields from the main config object
  Object.keys(configObject).forEach((key) => {
    if (config.language.map((lang) => lang.key).includes(key)) {
      delete configObject[key];
    }
  });

  // Merge the translated content with the other fields
  const responseContent = { ...configObject, ...translatedContent };

  res.status(201).json(responseContent);
});

// Add language   =>   /api/v1/admin/language
exports.newLanguage = catchAsyncErrors(async (req, res, next) => {
  // Create a new language entry
  const language = await Language.create(req.body);

  const Config = await configSchema();

  // Update the Config to include the new language
  const config = await Config.findOne();
  if (config) {
    config.language.push(language._id);
    await config.save();
  } else {
    const newConfig = await Config.create({ language: [language._id] });
  }

  res.status(201).json({
    success: true,
    language,
  });
});

// Delete language   =>   /api/v1/admin/language/:id
exports.deleteLanguage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const language = await Language.findByIdAndDelete(id);

  if (!language) {
    return next(new ErrorHandler("Language not found", 404));
  }

  // Update the Config to remove the deleted language reference
  const Config = await configSchema();
  const config = await Config.findOne();
  if (config) {
    config.language.pull(language._id);
    await config.save();
  }

  res.status(200).json({
    success: true,
    message: "Language is deleted.",
  });
});

exports.updateLanguage = catchAsyncErrors(async (req, res, next) => {
  const languageId = req.params.id;
  const { key, value } = req.body;

  // Update the language in the Language collection
  const language = await Language.findByIdAndUpdate(
    languageId,
    { key, value },
    { new: true, runValidators: true }
  );

  if (!language) {
    return next(new ErrorHandler("Language not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Language updated successfully",
    language,
  });
});

// Payment  method   =>   /api/v1/admin/payment-method
exports.newPaymentMethod = catchAsyncErrors(async (req, res, next) => {
  // Create a new Payment  method  entry
  const method = await PaymentMethod.create(req.body);

  // Update the Config to include the new language
  const Config = await configSchema();

  const config = await Config.findOne();

  if (config) {
    config.active_payment_method_list.push(method._id);
    await config.save();
  } else {
    const newConfig = await Config.create({
      active_payment_method_list: [method._id],
    });
  }

  res.status(201).json({
    success: true,
    method,
  });
});

// Delete PaymentMethod   =>   /api/v1/admin/payment-method/:id
exports.deletePaymentMethod = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const method = await PaymentMethod.findByIdAndDelete(id);

  if (!method) {
    return next(new ErrorHandler("Language not found", 404));
  }

  // Update the Config to remove the deleted language reference
  const Config = await configSchema();
  const config = await Config.findOne();
  if (config) {
    config.active_payment_method_list.pull(method._id);
    await config.save();
  }

  res.status(200).json({
    success: true,
    message: "Method is deleted.",
  });
});

// Update PaymentMethod   =>   /api/v1/admin/payment-method/:id
exports.updatePaymentMethod = catchAsyncErrors(async (req, res, next) => {
  const methodId = req.params.id;
  const { key, value } = req.body;

  // Update the language in the Language collection
  const method = await PaymentMethod.findByIdAndUpdate(
    methodId,
    { key, value },
    { new: true, runValidators: true }
  );

  if (!method) {
    return next(new ErrorHandler("Method not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Method updated successfully",
    method,
  });
});

// Add Social   =>   /api/v1/admin/social
exports.newSocial = catchAsyncErrors(async (req, res, next) => {
  // Create a new Payment  method  entry
  const social = await SocialMedia.create(req.body);

  // Update the Config to include the new language
  const Config = await configSchema();

  const config = await Config.findOne();

  if (config) {
    config.social_media.push(social._id);
    await config.save();
  } else {
    const newConfig = await Config.create({ social_media: [social._id] });
  }

  res.status(201).json({
    success: true,
    social,
  });
});

// Delete Social   =>   /api/v1/admin/social/:id
exports.deleteSocial = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const social = await SocialMedia.findByIdAndDelete(id);

  if (!social) {
    return next(new ErrorHandler("Social link not found", 404));
  }

  // Update the Config to remove the deleted language reference
  const Config = await configSchema();
  const config = await Config.findOne();
  if (config) {
    config.social_media.pull(social._id);
    await config.save();
  }

  res.status(200).json({
    success: true,
    message: "Social link is deleted.",
  });
});

// Update Social   =>   /api/v1/admin/social/:id
exports.updateSocial = catchAsyncErrors(async (req, res, next) => {
  const socialId = req.params.id;
  const { key, value } = req.body;

  // Update the language in the Language collection
  const social = await SocialMedia.findByIdAndUpdate(
    socialId,
    { key, value },
    { new: true, runValidators: true }
  );

  if (!social) {
    return next(new ErrorHandler("Social link not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Social link updated successfully",
    social,
  });
});

// Add Social Login   =>   /api/v1/admin/social-login
exports.newSocialLogin = catchAsyncErrors(async (req, res, next) => {
  // Create a new Payment  method  entry
  const social = await SocialLogin.create(req.body);

  // Update the Config to include the new language
  const Config = await configSchema();

  const config = await Config.findOne();

  if (config) {
    config.social_login.push(social._id);
    await config.save();
  } else {
    const newConfig = await Config.create({ social_login: [social._id] });
  }

  res.status(201).json({
    success: true,
    social,
  });
});

// Delete Social login  =>   /api/v1/admin/social-login/:id
exports.deleteSocialLogin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const social = await SocialLogin.findByIdAndDelete(id);

  if (!social) {
    return next(new ErrorHandler("Social login medium  not found", 404));
  }

  // Update the Config to remove the deleted language reference
  const Config = await configSchema();
  const config = await Config.findOne();
  if (config) {
    config.social_login.pull(social._id);
    await config.save();
  }

  res.status(200).json({
    success: true,
    message: "Social login medium is deleted.",
  });
});

// Update Social Login  =>   /api/v1/admin/social-login/:id
exports.updateSocialLogin = catchAsyncErrors(async (req, res, next) => {
  const socialId = req.params.id;
  const { key, value } = req.body;

  // Update the language in the Language collection
  const social = await SocialLogin.findByIdAndUpdate(
    socialId,
    { key, value },
    { new: true, runValidators: true }
  );

  if (!social) {
    return next(new ErrorHandler("Social login medium  not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Social link updated successfully",
    social,
  });
});

// Add Apple Login   =>   /api/v1/admin/apple-login
exports.newAppleLogin = catchAsyncErrors(async (req, res, next) => {
  // Create a new Payment  method  entry
  const social = await SocialLogin.create(req.body);

  // Update the Config to include the new language
  const Config = await configSchema();

  const config = await Config.findOne();

  if (config) {
    config.apple_login.push(social._id);
    await config.save();
  } else {
    const newConfig = await Config.create({ apple_login: [social._id] });
  }

  res.status(201).json({
    success: true,
    social,
  });
});

// Delete Apple login  =>   /api/v1/admin/apple-login/:id
exports.deleteAppleLogin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const social = await SocialLogin.findByIdAndDelete(id);

  if (!social) {
    return next(new ErrorHandler("Apple login medium  not found", 404));
  }

  // Update the Config to remove the deleted language reference
  const Config = await configSchema();
  const config = await Config.findOne();
  if (config) {
    config.apple_login.pull(social._id);
    await config.save();
  }

  res.status(200).json({
    success: true,
    message: "Apple login medium is deleted.",
  });
});

// Update Apple Login  =>   /api/v1/admin/apple-login/:id
exports.updateAppleLogin = catchAsyncErrors(async (req, res, next) => {
  const socialId = req.params.id;
  const { key, value } = req.body;

  // Update the language in the Language collection
  const social = await SocialLogin.findByIdAndUpdate(
    socialId,
    { key, value },
    { new: true, runValidators: true }
  );

  if (!social) {
    return next(new ErrorHandler("Apple login medium  not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Apple login medium updated successfully",
    social,
  });
});

exports.deleteFile = catchAsyncErrors(async (req, res, next) => {
  const { fileName, type } = req.body;

  let config = await Config.findOne();

  if (!config) {
    return next(new ErrorHandler("Config not found", 404));
  }

  let updatedFiles;

  if (type === "banners") {
    updatedFiles = config.banners.filter(
      (banner) => banner.file_name !== fileName
    );
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      await deleteCloudinaryFile(fileName);
    } else {
      const file = config.banners.find(
        (banner) => banner.file_name === fileName
      );
      await deleteLocalFile(file.file_full_url);
    }
    config.banners = updatedFiles;
  }

  // Save the updated config
  await config.save();

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
    result: config.banners,
  });
});
