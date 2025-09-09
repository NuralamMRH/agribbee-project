const VesselSetting = require("../../models/iTruckSeAiUU/VesselSetting");
const ErrorHandler = require("../../utils/errorHandler");
const APIFeatures = require("../../utils/apiFeatures");
const {
  fileUpdatePromises,
  fileUploadPromises,
} = require("../../utils/fileUploader");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

// Get all vessel settings with search, filter, pagination
exports.getAllVesselSettings = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 8;
  const vesselSettingsCount = await VesselSetting.countDocuments();

  const apiFeatures = new APIFeatures(VesselSetting.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const vesselSettings = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: vesselSettings.length,
    totalCount: vesselSettingsCount,
    resPerPage,
    data: vesselSettings,
  });
});

// Get user all vessel settings with search, filter, pagination
exports.getUserAllVesselSettings = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 8;
  const vesselSettingsCount = await VesselSetting.countDocuments();

  const apiFeatures = new APIFeatures(
    VesselSetting.find({ user_id: req.user._id }),
    req.query
  )
    .search()
    .filter()
    .pagination(resPerPage);

  const vesselSettings = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: vesselSettings.length,
    totalCount: vesselSettingsCount,
    resPerPage,
    data: vesselSettings,
  });
});

// Create a new vessel setting
exports.createVesselSetting = catchAsyncErrors(async (req, res, next) => {
  const fieldToUpload = ["document_image"];
  const uploadedFiles = await fileUpdatePromises(
    req,
    res,
    next,
    fieldToUpload,
    "vesselSetting",
    VesselSetting
  );

  const newVesselSetting = new VesselSetting({
    ...req.body,
    ...uploadedFiles,
    user_id: req.user._id,
  });

  const savedVesselSetting = await newVesselSetting.save();
  res.status(201).json({
    success: true,
    data: savedVesselSetting,
    message: "Vessel setting created successfully",
  });
});

// Get a single vessel setting by ID
exports.getVesselSetting = catchAsyncErrors(async (req, res, next) => {
  const vesselSetting = await VesselSetting.findById(req.params.id)
    .populate("user_id", "name email")
    .populate("logs");

  if (!vesselSetting) {
    return next(new ErrorHandler("Vessel setting not found", 404));
  }

  res.status(200).json({
    success: true,
    data: vesselSetting,
  });
});

// Update a vessel setting
exports.updateVesselSetting = catchAsyncErrors(async (req, res, next) => {
  const vesselSetting = await VesselSetting.findById(req.params.id);

  if (!vesselSetting) {
    return next(new ErrorHandler("Vessel setting not found", 404));
  }

  // Check if user owns this vessel setting
  if (vesselSetting.user_id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You can only update your own vessel settings", 403)
    );
  }

  let uploadedFile = {};

  if (typeof req.body.document_image === "string") {
    // Preserve the full URL
    req.body.document_image = getProduct.document_image;
    req.body.document_image_full_url = getProduct.document_image_full_url;

    // Extract the file name from the URL
    req.body.document_image = req.body.document_image.split("/").pop();
  } else {
    const singleFields = ["document_image"];
    uploadedFile = await fileUploadPromises(
      req,
      res,
      next,
      singleFields,
      "vesselSetting",
      vesselSetting
    );
  }

  // Update fields
  Object.keys(req.body).forEach((key) => {
    vesselSetting[key] = req.body[key];
  });

  if (uploadedFile.document_image && uploadedFile.document_image_full_url) {
    vesselSetting.document_image = uploadedFile.document_image;
    vesselSetting.document_image_full_url =
      uploadedFile.document_image_full_url;
  }

  const updatedVesselSetting = await vesselSetting.save();

  res.status(200).json({
    success: true,
    data: updatedVesselSetting,
    message: "Vessel setting updated successfully",
  });
});

// Delete a vessel setting
exports.deleteVesselSetting = catchAsyncErrors(async (req, res, next) => {
  const vesselSetting = await VesselSetting.findById(req.params.id);

  if (!vesselSetting) {
    return next(new ErrorHandler("Vessel setting not found", 404));
  }

  // Check if user owns this vessel setting
  if (vesselSetting.user_id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You can only delete your own vessel settings", 403)
    );
  }

  await vesselSetting.deleteOne();

  res.status(200).json({
    success: true,
    message: "Vessel setting deleted successfully",
  });
});
