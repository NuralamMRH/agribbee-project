const mongoose = require("mongoose");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Market, Address, Language } = require("../../models");
const APIFeatures = require("../../utils/apiFeatures");
const ErrorHandler = require("../../utils/errorHandler");

const {
  fileUploadPromises,
  fileUpdatePromises,
} = require("../../utils/fileUploader");
const { translateNestedContent } = require("../../utils/translatedContent");
const { addressQuery } = require("../../utils/addressQuery");

exports.createMarket = catchAsyncErrors(async (req, res, next) => {
  const { user_id, country, region, city, address } = req.body;

  const newAddress = await Address.create({
    user_id,
    country,
    region,
    city,
    address,
  });

  // Upload files if any
  const fieldsToUpload = ["image", "banner"];
  const uploadedFiles = await fileUploadPromises(
    req,
    res,
    next,
    fieldsToUpload,
    "market"
  );

  // Create new subscription package
  const data = { ...req.body, ...uploadedFiles, address: newAddress._id };
  const newData = new Market(data);

  await newData.save();

  res.status(201).json({
    success: true,
    newData,
  });
});

exports.getMarkets = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'

    const language = req.headers["x-localization"] || "vi";

    // Search by name based on the specified language
    const searchKey = req.query.name
      ? {
          [`${language}.name`]: { $regex: req.query.name, $options: "i" },
        }
      : {};

    // Fetch filtered markets and apply search, filter, and pagination
    const marketsQuery = new APIFeatures(
      Market.find({ ...searchKey })
        .populate({
          path: "address",
          populate: [{ path: "region" }, { path: "city" }],
        })
        .lean(),
      req.query
    )
      .search()
      .filter();

    const markets = await marketsQuery.query;

    // Prepare the response content with language translation
    const responseContents = await translateNestedContent(language, markets);

    return res.status(200).json({
      success: true,
      markets: responseContents,
    });
  } catch (error) {
    return next(new ErrorHandler(`Markets not found: ${error.message}`, 500));
  }
});

exports.getRegionBasedMarkets = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch all markets with populated address and region fields
    const findMarkets = await Market.find()
      .populate({
        path: "address",
        populate: { path: "city" },
      })
      .lean();

    // Filter or sort markets based on 'latest' query parameter
    let markets = findMarkets;

    // Apply additional filters for region, city, or zip if present in the query
    if (req.query.region) {
      markets = markets.filter((mar) => {
        return mar?.address?.city?.region
          ? String(mar?.address?.city?.region) === req.query.region
          : String(mar?.address?.region) === req.query.region;
      });
    }

    // Translate the paginated response content into the desired language
    const responseContents = await translateNestedContent(language, markets);

    // Send a success response with the translated and paginated markets
    return res.status(200).json({
      success: true,
      markets: responseContents,
    });
  } catch (error) {
    return next(new ErrorHandler(`Markets not found: ${error.message}`, 500));
  }
});

exports.getCityBasedMarkets = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch markets with populated address and city based on filters
    const findMarkets = await Market.find()
      .populate({
        path: "address",
        populate: { path: "city" },
      })
      .lean();

    let markets;

    if (req.query.city) {
      markets = findMarkets.filter((market) => {
        // console.log("city ", market?.address?.city);
        return (
          market?.address?.city &&
          String(market?.address?.city._id) === req.query.city
        );
      });
    }

    // Filter by region ID if provided
    if (req.query.region) {
      markets = markets.filter((mar) => {
        return mar?.address?.city?.region
          ? String(mar?.address?.city?.region) === req.query.region
          : String(mar?.address?.region) === req.query.region;
      });
    }

    // Filter by city ZIP code if provided
    if (req.query.zip) {
      markets = findMarkets.filter((market) => {
        return (
          market?.address?.city?.zip &&
          String(market?.address?.city?.zip) === req.query.zip
        );
      });
    }

    // Translate the market data based on language
    const responseContents = await translateNestedContent(language, markets);

    // console.log(responseContents);
    // Return the response with filtered markets
    return res.status(200).json({
      success: true,
      markets: responseContents,
    });
  } catch (error) {
    return next(new ErrorHandler(`Markets not found: ${error.message}`, 500));
  }
});

exports.getMarketById = catchAsyncErrors(async (req, res, next) => {
  try {
    const market = await Market.findById(req.params.id)
      .populate("user")
      .populate({
        path: "address",
        populate: [{ path: "country" }, { path: "region" }, { path: "city" }],
      })
      .lean(); // Convert Mongoose documents to plain objects

    if (!market) {
      return next(new ErrorHandler("Market not found", 404));
    }

    const language = req.headers["x-localization"] || "vi";

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(language, market);

    // console.log(response._id);

    return res.status(200).json({
      success: true,
      market: response,
    });
  } catch (error) {
    console.error("Error in getMarketById:", error);
    return next(new ErrorHandler(`Market not found: ${error.message}`, 500));
  }
});

// Get single Market details update   =>   /api/v1/market/:id
exports.updateMarketById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch countries
    const getMarket = await Market.findById(req.params.id);

    // Upload files if any
    const fieldsToUpload = ["image", "banner"];
    const uploadedFiles = await fileUpdatePromises(
      req,
      res,
      next,
      fieldsToUpload,
      "market",
      getMarket
    );

    // Prepare the response contents
    getMarket.set({ ...req.body, ...uploadedFiles });
    getMarket.save();

    return res.status(200).json({
      success: true,
      market: getMarket,
    });
  } catch (error) {
    return next(new ErrorHandler(`Market not found: ${error.message}`, 500));
  }
});

// DELETE single market    =>   /api/v1/admin/market/:id
exports.deleteMarketById = catchAsyncErrors(async (req, res, next) => {
  // Fetch market
  Market.findByIdAndDelete(req.params.id).then((m) => {
    if (!m) {
      return next(new ErrorHandler("Market not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Market is deleted.",
      });
    }
  });
});

const DEFAULT_COORDINATES = [107.1957203, 21.2432501];

const isValidCoordinate = (lat, lng) => {
  return (
    lat >= -90 &&
    lat <= 90 && // Latitude range
    lng >= -180 &&
    lng <= 180 // Longitude range
  );
};

exports.updateMarkets = catchAsyncErrors(async (req, res, next) => {
  try {
    const migrateLatLngToLocation = async () => {
      const markets = await Market.find({});

      for (let market of markets) {
        const latitude = parseFloat(market.lat);
        const longitude = parseFloat(market.lng);

        // Use default coordinates if the current ones are invalid
        const coordinates = isValidCoordinate(latitude, longitude)
          ? [longitude, latitude]
          : DEFAULT_COORDINATES;

        market.location = {
          type: "Point",
          coordinates: coordinates,
        };

        // Optional: remove lat and lng fields if no longer needed
        market.lat = undefined;
        market.lng = undefined;

        await market.save();
      }

      console.log("Migration completed successfully.");
    };

    await migrateLatLngToLocation();

    res.status(200).json({
      success: true,
      message: "Markets migration completed successfully.",
    });
  } catch (error) {
    next(error);
  }
});
