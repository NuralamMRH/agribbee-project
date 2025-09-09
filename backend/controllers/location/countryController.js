const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Country } = require("../../models");
const ErrorHandler = require("../../utils/errorHandler");
const {
  fileUploadPromises,
  fileUpdatePromises,
} = require("../../utils/fileUploader");
const {
  singleTranslation,
  translatedContent,
} = require("../../utils/translatedContent");

exports.createCountry = catchAsyncErrors(async (req, res, next) => {
  try {
    // Upload files if any
    const fieldsToUpload = ["flag"];
    const uploadedFiles = await fileUploadPromises(
      req,
      res,
      next,
      fieldsToUpload,
      "country"
    );
    // Create new subscription package
    const data = { ...req.body, ...uploadedFiles };
    const newData = new Country(data);

    await newData.save();

    res.status(201).json({
      success: true,
      newData,
    });
  } catch (error) {
    console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error creating package: ${error.message}`, 500)
    );
  }
});

exports.getCountries = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch countries
    const countries = await Country.find().lean();

    // Prepare the response contents
    const responseContents = await translatedContent(language, countries);

    return res.status(200).json({
      success: true,
      countries: responseContents,
    });
  } catch (error) {
    return next(new ErrorHandler(`Countries not found: ${error.message}`, 500));
  }
});

// Get single country details   =>   /api/v1/country/:id
exports.getCountryById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch countries
    const getCountry = await Country.findById(req.params.id);

    // Prepare the response contents
    const response = await singleTranslation(language, getCountry);

    return res.status(200).json({
      success: true,
      country: response,
    });
  } catch (error) {
    return next(new ErrorHandler(`Country not found: ${error.message}`, 500));
  }
});

// Get single country details update   =>   /api/v1/country/:id
exports.updateCountryById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch countries
    const getCountry = await Country.findById(req.params.id);

    // Upload files if any
    const fieldsToUpload = ["flag"];
    const uploadedFiles = await fileUpdatePromises(
      req,
      res,
      next,
      fieldsToUpload,
      "country",
      getCountry
    );

    // Prepare the response contents
    getCountry.set({ ...req.body, ...uploadedFiles });
    getCountry.save();

    return res.status(200).json({
      success: true,
      country: getCountry,
    });
  } catch (error) {
    return next(new ErrorHandler(`Country not found: ${error.message}`, 500));
  }
});
