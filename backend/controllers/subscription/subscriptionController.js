const { Language, MembershipPackage } = require("../../models");
const {
  fileUploadPromises,
  fileUpdatePromises,
} = require("../../utils/fileUploader");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const { translateNestedContent } = require("../../utils/translatedContent");

exports.getSubscriptionPackages = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch subscription packages
    const subscriptionPackages = await MembershipPackage.find().lean();

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(
      language,
      subscriptionPackages
    );

    return res.status(200).json({
      success: true,
      packages: response,
    });
  } catch (error) {
    return next(new ErrorHandler(`Package not found: ${error.message}`, 500));
  }
});

exports.createSubscriptionPackage = catchAsyncErrors(async (req, res, next) => {
  try {
    // Upload files if any
    const fieldsToUpload = ["icon_image"];
    const uploadedFiles = await fileUploadPromises(
      req,
      res,
      next,
      fieldsToUpload,
      "subscription"
    );

    // Create new subscription package
    const packageData = { ...req.body, ...uploadedFiles };
    const newPackage = new MembershipPackage(packageData);

    await newPackage.save();

    res.status(201).json({
      success: true,
      package: newPackage,
    });
  } catch (error) {
    console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error creating package: ${error.message}`, 500)
    );
  }
});
exports.updateSubscriptionPackage = catchAsyncErrors(async (req, res, next) => {
  try {
    const SubscriptionPackage = MembershipPackage.findById(req.params.id);
    if (!SubscriptionPackage) {
      return next(
        new ErrorHandler("SubscriptionPackage model not loaded", 500)
      );
    }

    // Upload files if any
    const fieldsToUpload = ["icon_image"];
    const updatedFile = await fileUpdatePromises(
      req,
      res,
      next,
      fieldsToUpload,
      "subscription",
      SubscriptionPackage
    );

    const packageData = { ...req.body, ...updatedFile };

    const updatedPackage = await MembershipPackage.findByIdAndUpdate(
      req.params.id,
      packageData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(201).json({
      success: true,
      package: updatedPackage,
    });
  } catch (error) {
    console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error updating package: ${error.message}`, 500)
    );
  }
});

// Get single Product details    =>   /api/v1/package/:id
exports.getPackageById = catchAsyncErrors(async (req, res, next) => {
  try {
    const membershipPackage = await MembershipPackage.findById(
      req.params.id
    ).lean(); // Convert Mongoose documents to plain objects

    if (!membershipPackage) {
      return next(new ErrorHandler("MembershipPackage not found", 404));
    }

    const language = req.headers["x-localization"] || "vi";

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(language, product);

    // console.log(response._id);

    return res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("Error in getPackageById:", error);
    return next(new ErrorHandler(`Package not found: ${error.message}`, 500));
  }
});

// Delete Product   =>   /api/v1/seller/product/:id
exports.deletePackage = catchAsyncErrors(async (req, res, next) => {
  MembershipPackage.findByIdAndDelete(req.params.id).then((m) => {
    if (!m) {
      return next(new ErrorHandler("seller not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Package is deleted.",
      });
    }
  });
});
