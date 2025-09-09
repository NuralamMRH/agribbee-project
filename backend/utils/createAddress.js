const { Address } = require("../models");
const axios = require("axios");
const ErrorHandler = require("./errorHandler");

const createAddress = async (req, next) => {
  try {
    const user_id = req.user.id;

    const { country, region, city, address, zip } = req.body;

    let location;

    if (!req.body.lng && !req.body.lat) {
      // Prepare the Google Maps Geocoding API URL
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;
      const response = await axios.get(googleApiUrl);

      // Check if the API response is successful
      if (response.data.status !== "OK") {
        return next(
          new ErrorHandler("Failed to get lat/lng from Google API", 404)
        );
      }

      // Extract latitude and longitude from the API response
      const apiLocation = response.data.results[0]?.geometry?.location;
      location = {
        type: "Point", // GeoJSON format
        coordinates: [apiLocation.lng, apiLocation.lat], // Store longitude first in GeoJSON
      };
    } else {
      location = {
        type: "Point", // GeoJSON format
        coordinates: [req.body.lng, req.body.lat], // Store longitude first in GeoJSON
      };
    }

    if (req.body.isDefault) {
      // Update all other addresses to isDefault: false for the given user
      await Address.updateMany(
        { user_id: req.user.id, isDefault: true }, // Find all addresses with the same user_id and isDefault: true
        { $set: { isDefault: false } } // Set their isDefault to false
      );
    }

    // Build address data for the new address entry
    const addressData = {
      user_id: req.body.user_id ? req.body.user_id : user_id,
      country,
      region,
      city,
      address,
      zip,
      location,
      ...req.body,
    };

    let newAddress;
    if (address && country && city && region && user_id) {
      newAddress = await Address.create(addressData);
    }

    return newAddress ? newAddress._id : null;
  } catch (err) {
    return next(new ErrorHandler(`Address not created: ${err.message}`, 500));
  }
};

module.exports = createAddress;
