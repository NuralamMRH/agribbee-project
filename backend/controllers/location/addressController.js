const axios = require("axios")
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const { Address, User } = require("../../models")
const ErrorHandler = require("../../utils/errorHandler")
const { translateNestedContent } = require("../../utils/translatedContent")

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const { user_id, country, region, city, address, zip } = req.body

    if (address && zip) {
      address = `${address}, ${zip}`
    }

    // Prepare the Google Maps Geocoding API URL
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`

    // Request Google Geocoding API for address details
    const response = await axios.get(googleApiUrl)

    // Check if the API response is successful
    if (response.data.status !== "OK") {
      return next(
        new ErrorHandler("Failed to get lat/lng from Google API", 500)
      )
    }

    // Extract latitude and longitude from the API response
    const location = response.data.results[0]?.geometry?.location

    if (!location) {
      return next(
        new ErrorHandler("No lat/lng found for the given address", 500)
      )
    }

    const addressData = {
      user_id,
      country,
      region,
      city,
      address,
      zip,
      location: {
        type: "Point", // GeoJSON format
        coordinates: [location.lng, location.lat], // Store longitude first in GeoJSON
      },
    }

    // Save the address to the database
    const newAddress = new Address(addressData)
    await newAddress.save()

    // Respond with the created address and location
    res.status(201).json({
      success: true,
      address: newAddress,
    })
  } catch (err) {
    return next(new ErrorHandler(`Address not created: ${err.message}`, 500))
  }
})

exports.getAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    // Fetch Address
    const address = await Address.find()
      .sort({ createdAt: -1 })
      .populate("city")
      .populate("region")
      .lean()

    // Prepare the response contents
    const responseContents = await translateNestedContent(language, address)

    return res.status(200).json({
      success: true,
      address: responseContents,
    })
  } catch (error) {
    return next(new ErrorHandler(`Address not found: ${error.message}`, 500))
  }
})

// Get single address details   =>   /api/v1/address/:id
exports.getAddressById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch address
    const getAddress = await Address.findById(req.params.id)
      .populate("city")
      .populate("region")
      .lean()

    if (!getAddress) {
      return next(new ErrorHandler("Address not found", 404))
    }

    return res.status(200).json({
      success: true,
      address: getAddress,
    })
  } catch (error) {
    return next(new ErrorHandler(`Address not found: ${error.message}`, 500))
  }
})

// Get single address details update   =>   /api/v1/address/:id
exports.updateAddressById = catchAsyncErrors(async (req, res, next) => {
  try {
    const address = Address()
    if (!address) {
      return next(new ErrorHandler("Address model not loaded", 500))
    }

    const updatedData = {
      ...req.body, // Spread body data from request
    }

    // Update kiosk with the new data
    const getAddress = await Address.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    )

    return res.status(200).json({
      success: true,
      address: getAddress,
    })
  } catch (error) {
    return next(new ErrorHandler(`Address not found: ${error.message}`, 500))
  }
})

// Get currently logged in user address list   =>   /api/v1/me/address/list
exports.getUserAddressList = catchAsyncErrors(async (req, res, next) => {
  const language = req.headers["x-localization"] || "vi"

  // Fetch Address
  const address = await Address.find({ user_id: req.user.id })
    .sort({ createdAt: -1 })
    .populate("city")
    .populate("region")
    .populate("country")
    .lean()

  // Prepare the response contents
  const responseContents = await translateNestedContent(language, address)

  res.status(200).json({ addresses: responseContents })
})

exports.deleteUserAddress = catchAsyncErrors(async (req, res, next) => {
  const address = await Address.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  })
})

// Get single address details update   =>   /api/v1/address/:id
exports.userUpdateAddressById = catchAsyncErrors(async (req, res, next) => {
  try {
    let { address, zip, location } = req.body

    // Request Google Geocoding API for address details if location is not provided
    if (!location) {
      const newAddress = `${address}, ${zip}`
      // Prepare the Google Maps Geocoding API URL
      const apiKey = process.env.GOOGLE_MAPS_API_KEY
      const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        newAddress
      )}&key=${apiKey}`
      const response = await axios.get(googleApiUrl)

      // Check if the API response is successful
      if (response.data.status !== "OK") {
        return next(
          new ErrorHandler("Failed to get lat/lng from Google API", 404)
        )
      }

      // Extract latitude and longitude from the API response
      const apiLocation = response.data.results[0]?.geometry?.location
      location = {
        type: "Point", // GeoJSON format
        coordinates: [apiLocation.lng, apiLocation.lat], // Store longitude first in GeoJSON
      }
    } else {
      location = {
        type: "Point", // GeoJSON format
        coordinates: [req.body.lng, req.body.lat], // Store longitude first in GeoJSON
      }
    }

    // Build address data for the new address entry
    const addressData = {
      ...req.body,
      location,
    }

    await Address.findByIdAndUpdate(req.params.id, addressData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
    })
  } catch (err) {
    return next(new ErrorHandler(`Address not updated: ${err.message}`, 500))
  }
})

exports.userAddNewAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    let { address, zip, location } = req.body

    // Request Google Geocoding API for address details if location is not provided
    if (!location) {
      const newAddress = `${address}, ${zip}`
      // Prepare the Google Maps Geocoding API URL
      const apiKey = process.env.GOOGLE_MAPS_API_KEY
      const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        newAddress
      )}&key=${apiKey}`
      const response = await axios.get(googleApiUrl)

      // Check if the API response is successful
      if (response.data.status !== "OK") {
        return next(
          new ErrorHandler("Failed to get lat/lng from Google API", 404)
        )
      }

      // Extract latitude and longitude from the API response
      const apiLocation = response.data.results[0]?.geometry?.location
      location = {
        type: "Point", // GeoJSON format
        coordinates: [apiLocation.lng, apiLocation.lat], // Store longitude first in GeoJSON
      }
    } else {
      location = {
        type: "Point", // GeoJSON format
        coordinates: [req.body.lng, req.body.lat], // Store longitude first in GeoJSON
      }
    }

    // Build address data for the new address entry
    const addressData = {
      ...req.body,
      user_id: req.user.id,
      location,
    }

    const newAddress = new Address(addressData)
    await newAddress.save()

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      newAddress,
    })
  } catch (err) {
    return next(new ErrorHandler(`Address not updated: ${err.message}`, 500))
  }
})
