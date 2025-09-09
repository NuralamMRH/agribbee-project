const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Vendor, Language, Address } = require("../../models");
const APIFeatures = require("../../utils/apiFeatures");
const ErrorHandler = require("../../utils/errorHandler");
const {
  fileUploadPromises,
  fileUpdatePromises,
} = require("../../utils/fileUploader");
const { translateNestedContent } = require("../../utils/translatedContent");

// Get all Vendors   =>   /api/v1/vendors
exports.getVendors = catchAsyncErrors(async (req, res, next) => {
  const vendorCount = await Vendor.countDocuments();

  // Fetch vendors and populate user and membership fields
  const vendors = await Vendor.find().populate("user").populate("membership");

  //   const translatedData = await getTranslatedData(vendors, language);
  res.status(200).json({
    success: true,
    vendorCount,
    vendors: vendors, // Return translated vendors data
  });
});
