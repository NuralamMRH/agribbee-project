const express = require("express");
const router = express.Router();
const axios = require("axios");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { City } = require("../models");
const { translateNestedContent } = require("../utils/translatedContent");

// Route: /api/v1/config/place-api-autocomplete
router.get(
  "/config/place-api-autocomplete",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const searchText = req.query.search_text;
      if (!searchText) {
        return res
          .status(400)
          .json({ success: false, message: "Search text is required" });
      }

      // Call Google Places Autocomplete API
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const googleApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        searchText
      )}&key=${apiKey}`;

      const response = await axios.get(googleApiUrl);
      const placesData = response.data;

      if (placesData.status !== "OK") {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch autocomplete data",
        });
      }

      // Return the Google Places Autocomplete response
      return res.status(200).json({
        success: true,
        predictions: placesData.predictions,
      });
    } catch (error) {
      return next(
        new ErrorHandler(
          `Error fetching autocomplete data: ${error.message}`,
          500
        )
      );
    }
  })
);

// /api/v1/config/get-nearby-city?lat=${location?.lat}&lng=${location?.lng}

router.get(
  "/config/get-nearby-city",
  catchAsyncErrors(async (req, res, next) => {
    // Extract language, latitude, and longitude from the request
    const language = req.headers["x-localization"] || "vi";
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (!lat || !lng) {
      return next(new ErrorHandler("Invalid coordinates", 400));
    }

    try {
      // Query the City collection to find the nearest city using MongoDB's $near operator
      const nearbyCities = await City.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] }, // Note: Coordinates are [lng, lat]
          },
        },
      })
        .populate("region") // Populate the region data
        .limit(1) // Limit to 1 result, as we are only interested in the nearest city
        .lean();

      // If no city found
      if (!nearbyCities.length) {
        return next(
          new ErrorHandler(
            "No matching city found near the given coordinates",
            404
          )
        );
      }

      const matchedCity = nearbyCities[0];

      const zoneId = `["${matchedCity.zip}"]`;

      // Optionally, translate the city data if needed
      const cityInfo = await translateNestedContent(language, matchedCity);

      const cityData = {
        zip: matchedCity.zip,
        zone_id: zoneId,
        zone_data: cityInfo,
      };

      // console.log(cityData);

      // Return the city data as JSON response
      return res
        .status(200)
        .json({ zip: matchedCity.zip, zone_id: zoneId, zone_data: cityInfo });
    } catch (error) {
      return next(
        new ErrorHandler(`Failed to fetch nearby city: ${error.message}`, 500)
      );
    }
  })
);

router.get(
  "/config/place-api-details",
  catchAsyncErrors(async (req, res, next) => {
    const { placeid } = req.query;

    if (!placeid) {
      return next(new ErrorHandler("Place ID is required", 400));
    }

    // Google Places API endpoint and key
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${apiKey}`;

    try {
      // Request Google Places API for place details
      const response = await axios.get(googleApiUrl);

      if (response.data.status !== "OK") {
        return next(
          new ErrorHandler("Failed to get place details from Google API", 500)
        );
      }

      // Send the place details back in response
      return res.status(200).json({
        result: response.data.result,
      });
    } catch (error) {
      return next(
        new ErrorHandler(`Failed to fetch place details: ${error.message}`, 500)
      );
    }
  })
);

// Route for reverse geocoding using lat and lng
router.get(
  "/config/geocode-api",
  catchAsyncErrors(async (req, res, next) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return next(new ErrorHandler("Latitude and longitude are required", 400));
    }

    // Google Geocoding API endpoint and API key
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      // Request Google Geocoding API for address details
      const response = await axios.get(googleApiUrl);

      if (response.data.status !== "OK") {
        return next(
          new ErrorHandler("Failed to get address details from Google API", 500)
        );
      }

      // Send the geocoded address details back in response
      return res.status(200).json({
        success: true,
        results: response.data.results,
      });
    } catch (error) {
      return next(
        new ErrorHandler(`Failed to fetch geocode data: ${error.message}`, 500)
      );
    }
  })
);

router.get(
  "/config/distance-api",
  catchAsyncErrors(async (req, res, next) => {
    const { origin_lat, origin_lng, destination_lat, destination_lng } =
      req.query;

    // Check if both origin and destination coordinates are provided
    if (!origin_lat || !origin_lng || !destination_lat || !destination_lng) {
      return next(
        new ErrorHandler("Origin and destination coordinates are required", 400)
      );
    }

    // Google Distance Matrix API endpoint and API key
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const googleApiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin_lat},${origin_lng}&destinations=${destination_lat},${destination_lng}&key=${apiKey}`;

    try {
      // Request Google Distance Matrix API for distance and duration
      const response = await axios.get(googleApiUrl);

      // Check if the response status is OK
      if (response.data.status !== "OK") {
        return next(
          new ErrorHandler("Failed to get distance data from Google API", 500)
        );
      }

      // Extract distance and duration from response
      const distanceInfo = response.data.rows[0].elements[0];

      const rows = response.data.rows;

      if (distanceInfo.status !== "OK") {
        return next(
          new ErrorHandler("No results found for the provided locations", 404)
        );
      }

      // Send distance and duration information back to the client
      return res.status(200).json({
        success: true,
        rows,
        distance: distanceInfo.distance.text, // e.g., "5.4 km"
        duration: distanceInfo.duration.text, // e.g., "12 mins"
        distance_value: distanceInfo.distance.value, // in meters
        duration_value: distanceInfo.duration.value, // in seconds
      });
    } catch (error) {
      return next(
        new ErrorHandler(`Failed to fetch distance data: ${error.message}`, 500)
      );
    }
  })
);

module.exports = router;
