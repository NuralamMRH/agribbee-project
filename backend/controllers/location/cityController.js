const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Language, City } = require("../../models");
const ErrorHandler = require("../../utils/errorHandler");
const {
  singleTranslation,
  translatedContent,
  translateNestedContent,
} = require("../../utils/translatedContent");

exports.createCity = catchAsyncErrors(async (req, res, next) => {
  try {
    // Create new subscription package
    const data = { ...req.body };
    const newData = new City(data);

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

// Get cities for region   =>   /api/v1/cities?region=2342342,234234
exports.getCities = catchAsyncErrors(async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.region) {
      filter = { region: req.query.region.split(",") };
    }

    if (req.query.country) {
      filter = { country: req.query.country };
    }

    if (req.query.zip) {
      filter = { zip: req.query.zip };
    }

    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch Cities
    const cities = await City.find(filter)
      .lean()
      .populate("region")
      .populate("location")
      .populate("country")
      .populate("markets")
      .lean();

    // Prepare the response contents
    const responseContents = await translatedContent(language, cities);

    return res.status(200).json({
      success: true,
      cities: responseContents,
    });
  } catch (error) {
    return next(new ErrorHandler(`Cities not found: ${error.message}`, 500));
  }
});

// Get single city details   =>   /api/v1/city/:id
exports.getCityById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch Cities
    const getCities = await City.findById(req.params.id)
      .populate("region")
      .populate("country");

    // Prepare the response contents
    const response = await singleTranslation(language, getCities);

    return res.status(200).json({
      success: true,
      city: response,
    });
  } catch (error) {
    return next(new ErrorHandler(`City not found: ${error.message}`, 500));
  }
});

// Get single city details update   =>   /api/v1/city/:id
exports.updateCityById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch Cities
    const getCity = await City.findById(req.params.id);

    // Prepare the response contents
    getCity.set({ ...req.body });
    getCity.save();

    return res.status(200).json({
      success: true,
      city: getCity,
    });
  } catch (error) {
    return next(new ErrorHandler(`City not found: ${error.message}`, 500));
  }
});
