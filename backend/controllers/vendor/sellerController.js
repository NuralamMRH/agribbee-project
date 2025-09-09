const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const { Seller, Language, Address, User } = require("../../models")
const APIFeatures = require("../../utils/apiFeatures")
const createAddress = require("../../utils/createAddress")
const ErrorHandler = require("../../utils/errorHandler")
const {
  fileUploadPromises,
  fileUpdatePromises,
} = require("../../utils/fileUploader")
const { translateNestedContent } = require("../../utils/translatedContent")

exports.createSellerAccount = catchAsyncErrors(async (req, res, next) => {
  try {
    // Retrieve user data and relevant details from the request
    const userData = await User.findById(req.user.id).populate("membership")

    console.log("req.body: ", req.body)
    // Create a new address document
    let newAddress = await createAddress(req, next)

    // Define fields for file upload and upload files
    const fieldsToUpload = ["image", "banner"]
    const uploadedFiles = await fileUploadPromises(
      req,
      res,
      next,
      fieldsToUpload,
      "seller"
    )

    // Determine seller type based on membership role
    const seller_type = userData?.membership?.user_role

    console.log("newAddress", newAddress)
    console.log(seller_type)

    if (userData?.membership?.type) {
      req.body.selling_role = userData?.membership?.type
    }

    // Clean up the market field to avoid casting errors
    let marketId = req.body.market?.trim()
    if (!marketId || marketId === "") {
      delete req.body.market // Remove the market field entirely
    } else {
      req.body.market = marketId // Keep the valid ObjectId
    }

    // Construct seller data package
    const sellerData = {
      ...req.body,
      seller_type,
      user_id: req.user.id,
      location: {
        type: "Point",
        coordinates: [req.body.lng, req.body.lat],
      },
      ...uploadedFiles,
      address: newAddress,
    }

    // Create and save the seller document
    const newSeller = await Seller.create(sellerData)

    console.log("newSeller ", newSeller)

    // Return a successful response with the new seller data
    res.status(201).json({
      success: true,
      seller: newSeller,
    })
  } catch (error) {
    return next(
      new ErrorHandler(`Error creating seller account: ${error.message}`, 500)
    )
  }
})

exports.getSellers = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    const searchKey = req.query.name
      ? {
          [`${language}.name`]: { $regex: req.query.name, $options: "i" },
        }
      : {}

    // Fetch filtered markets and apply search, filter, and pagination
    const sellersQuery = new APIFeatures(
      Seller.find({ ...searchKey })
        .populate("products")
        .populate("market")
        .lean(),
      req.query
    )
      .search()
      .filter()

    const seller = await sellersQuery.query

    // Fetch countries

    const response = await translateNestedContent(language, seller)

    return res.status(200).json({
      success: true,
      sellers: response,
    })
  } catch (error) {
    return next(new ErrorHandler(`Sellers not found: ${error.message}`, 404))
  }
})

exports.getLocationBasedSellers = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    // Extract seller type from query parameters, default to an empty object if not provided
    const sellerType = req.query.seller_type
      ? { seller_type: req.query.seller_type }
      : {}

    // Fetch sellers and populate city and region in address
    const sellers = await Seller.find(sellerType)
      .populate({
        path: "address",
        populate: [{ path: "city" }, { path: "region" }],
      })
      .lean() // lean() to return plain JavaScript objects instead of Mongoose documents

    // If no sellers are found, return an empty array early
    if (!sellers || sellers.length === 0) {
      return res.status(200).json({
        success: true,
        sellers: [],
      })
    }

    // Prepare the response content with language translation
    const translatedSellers = await translateNestedContent(language, sellers)

    // Initialize filteredSellers with translated sellers
    let filteredSellers = translatedSellers

    // Filter by city ID if provided in the query
    if (req.query.city) {
      filteredSellers = filteredSellers.filter(
        (seller) =>
          seller.address &&
          seller.address.city &&
          String(seller.address.city._id) === req.query.city
      )
    }

    // Filter by region ID if provided in the query
    if (req.query.region) {
      filteredSellers = filteredSellers.filter(
        (seller) =>
          seller.address &&
          seller.address.region &&
          String(seller.address.region._id) === req.query.region
      )
    }

    // Filter by city ZIP code if provided in the query
    if (req.query.zip) {
      filteredSellers = filteredSellers.filter(
        (seller) =>
          seller.address &&
          seller.address.city &&
          seller.address.city.zip === req.query.zip
      )
    }

    // Return filtered sellers or an empty array if no matches
    return res.status(200).json({
      success: true,
      sellers: filteredSellers.length ? filteredSellers : [],
    })
  } catch (error) {
    return next(new ErrorHandler(`Sellers not found: ${error.message}`, 500))
  }
})

// Get single seller details    =>   /api/v1/seller/:id
exports.getSellerById = catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.params.id)
      .populate("products")
      .populate("market")
      .populate("user_id")
      .populate("warehouses")
      .populate({
        path: "address",
        populate: [{ path: "country" }, { path: "region" }, { path: "city" }],
      })
      .lean() // Convert Mongoose documents to plain objects

    if (!seller) {
      return next(new ErrorHandler("seller not found", 404))
    }

    const language = req.headers["x-localization"] || "vi"

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(language, seller)

    // console.log(response._id);

    return res.status(200).json({
      response,
    })
  } catch (error) {
    // console.error("Error in getSellerById:", error);
    return next(new ErrorHandler(`seller not found: ${error.message}`, 500))
  }
})

// Get single seller details update   =>   /api/v1/seller/:id
exports.updateSellerById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch the seller by ID
    let getSeller = await Seller.findById(req.params.id)
    if (!getSeller) {
      return next(new ErrorHandler("seller not found", 404))
    }

    // Upload files if any
    const fieldsToUpload = ["image", "banner"]
    const uploadedFiles = await fileUpdatePromises(
      req,
      res,
      next,
      fieldsToUpload,
      "seller",
      getSeller
    )

    // Combine req.body and uploadedFiles into a single update object
    const updatedData = {
      ...req.body, // Spread body data from request
      ...uploadedFiles, // Add uploaded files
    }

    // Update kiosk with the new data
    getSeller = await Seller.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })

    // Return the updated kiosk
    return res.status(200).json({
      success: true,
      seller: getSeller,
    })
  } catch (error) {
    return next(new ErrorHandler(`seller not found: ${error.message}`, 500))
  }
})

// DELETE single seller    =>   /api/v1/admin/seller/:id
exports.deleteSellerById = catchAsyncErrors(async (req, res, next) => {
  // Fetch seller
  Seller.findByIdAndDelete(req.params.id).then((m) => {
    if (!m) {
      return next(new ErrorHandler("seller not found", 404))
    } else {
      return res.status(200).json({
        success: true,
        message: "Seller is deleted.",
      })
    }
  })
})
