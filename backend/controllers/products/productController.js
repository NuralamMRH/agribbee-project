const { json } = require("body-parser")
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const { Address, Product, Auction, Seller } = require("../../models")
const APIFeatures = require("../../utils/apiFeatures")
const ErrorHandler = require("../../utils/errorHandler")
const {
  fileUploadPromises,
  fileUpdatePromises,
  uploadMultipleFiles,
  filesUpdatePromises,
} = require("../../utils/fileUploader")
const { translateNestedContent } = require("../../utils/translatedContent")

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    // Step 1: Fetch seller data based on user ID
    const sellerData = await Seller.findOne({ user_id: req.user.id })
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404))
    }

    console.log("warehouse_address", req.body.addressInfo)

    const wareQuery = {
      $or: [
        {
          zip: req.body.zip_code,
        },
        {
          contact_person_number: req.body.seller_phone,
        },
        {
          user_id: req.user.id,
        },
      ],
    }

    const wareHouseData = req.body.warehouse_address
      ? await Address.findById(req.body.warehouse_address)
      : await Address.findOne({
          ...wareQuery,
        })

    if (typeof req.body.image === "string") {
      delete req.body.image // Remove if `image` is a string
    }

    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter(
        (image) => typeof image !== "string"
      ) // Remove strings from `images`
    }

    // Step 2: Upload single and multiple files
    const singleFields = ["image", "video"]
    const uploadedFile = await fileUploadPromises(
      req,
      res,
      next,
      singleFields,
      "product"
    )

    const multiFields = ["images", "videos"]
    const uploadedFiles = await filesUpdatePromises(
      req,
      res,
      next,
      multiFields,
      "product"
    )

    req.body.quantity_left = req.body.quantity
    // Step 4: Prepare the product data
    const productData = {
      seller_id: sellerData._id,
      user_id: req.user.id,
      zip_code: req.body.zip_code || wareHouseData.zip,
      location: wareHouseData.location,
      warehouse_address: wareHouseData._id,
      warehouse_region: wareHouseData.region,
      category_id: req.body.category_id || null, // Ensure category_id is set
      seller_phone:
        req.body.seller_phone || wareHouseData.contact_person_number,
      ...uploadedFile, // Includes fields like 'image', 'video'
      ...uploadedFiles, // Includes fields like 'images', 'videos'
      ...req.body,
    }
    // Step 5: Create and save the product
    const newProduct = new Product(productData)
    await newProduct.save()

    if (req.body.isAuction && req.body.auction_type) {
      const auctionData = {
        product_id: newProduct._id,
        ...productData,
      }
      const newAuction = new Auction(auctionData)
      await newAuction.save()
    }

    const status = {
      message: `Product ${
        req.body.isAuction ? "& Auction" : ""
      } created successfully`,
      status: "success",
    }

    // Step 6: Send the response
    res.status(201).json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return next(
      new ErrorHandler(`Error creating new product: ${error.message}`, 500)
    )
  }
})

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    // Step 1: Fetch seller data based on user ID
    const sellerData = await Seller.findOne({ user_id: req.user.id })
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404))
    }

    console.log("warehouse_address", req.body.addressInfo)

    const wareQuery = {
      $or: [
        {
          zip: req.body.zip_code,
        },
        {
          contact_person_number: req.body.seller_phone,
        },
        {
          user_id: req.user.id,
        },
      ],
    }

    const wareHouseData = req.body.warehouse_address
      ? await Address.findById(req.body.warehouse_address)
      : await Address.findOne({
          ...wareQuery,
        })

    let getProduct = await Product.findById(req.params.id)
    if (!getProduct) {
      return next(new ErrorHandler("Product not found", 404))
    }

    if (typeof req.body.image === "string") {
      req.body.image = getProduct.image
      req.body.image_full_url = getProduct.image_full_url
    }

    let uploadedFile = {}

    if (typeof req.body.image === "string") {
      // Preserve the full URL
      req.body.image_full_url = req.body.image

      // Extract the file name from the URL
      req.body.image = req.body.image.split("/").pop()
    } else {
      const singleFields = ["image", "video"]
      uploadedFile = await fileUploadPromises(
        req,
        res,
        next,
        singleFields,
        "product",
        getProduct
      )
    }

    let uploadedFiles = {}
    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter((url) => {
        if (typeof url === "string") {
          return {
            file: url.split("/").pop(),
            file_full_url: url,
          }
        }
      }) // Remove strings from `images`
    } else {
      const multiFields = ["images", "videos"]
      uploadedFiles = await filesUpdatePromises(
        req,
        res,
        next,
        multiFields,
        "product",
        getProduct
      )
    }

    req.body.quantity_left = req.body.quantity
    // Step 4: Prepare the product data
    const productData = {
      seller_id: sellerData._id,
      user_id: req.user.id,
      zip_code: req.body.zip_code || wareHouseData.zip,
      location: wareHouseData.location,
      warehouse_address: wareHouseData._id,
      warehouse_region: wareHouseData.region,
      category_id: req.body.category_id || null, // Ensure category_id is set
      seller_phone:
        req.body.seller_phone || wareHouseData.contact_person_number,
      ...uploadedFile, // Includes fields like 'image', 'video'
      ...uploadedFiles, // Includes fields like 'images', 'videos'
      ...req.body,
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    )

    if (req.body.isAuction && req.body.auction_type) {
      const auctionData = {
        product_id: req.params.id,
        ...productData,
      }
      const newAuction = new Auction(auctionData)
      await newAuction.save()
    }

    res.status(201).json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error creating new Product: ${error.message}`, 500)
    )
  }
})

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const searchKey = req.query.name
      ? {
          name: { $regex: req.query.name, $options: "i" },
        }
      : {}

    // Fetch filtered markets and apply search, filter, and pagination
    const productsQuery = new APIFeatures(
      Product.find({ ...searchKey })
        .populate("category")
        .populate("region")
        .populate("warehouse")
        .lean(),
      req.query
    )
      .search()
      .filter()

    let products

    // Fetch countries
    if (req?.query?.latest === "true") {
      products = await productsQuery.query.sort({ created_at: -1 })
    } else if (req?.query?.latest === "false") {
      products = await productsQuery.query
    } else {
      products = await productsQuery.query.sort({ created_at: -1 })
    }

    const paginatedResponse = new APIFeatures(products, req?.query).pagination()
    const paginatedProducts = paginatedResponse.query

    // const response = await translateNestedContent(language, paginatedProducts)

    return res.status(200).json({
      response: paginatedProducts,
    })
  } catch (error) {
    return next(new ErrorHandler(`Products not found: ${error.message}`, 500))
  }
})

exports.getMyProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const sellerData = await Seller.findOne({ user_id: req.user.id })
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404))
    }

    // Fetch filtered markets and apply search, filter, and pagination
    const productsQuery = new APIFeatures(
      Product.find({ user_id: req.user.id })
        .populate("category")
        .populate("region")
        .populate("warehouse")
        .lean(),
      req.query
    )
      .search()
      .filter()

    let products

    // Fetch countries
    if (req?.query?.latest === "true") {
      products = await productsQuery.query.sort({ created_at: -1 })
    } else if (req?.query?.latest === "false") {
      products = await productsQuery.query
    } else {
      products = await productsQuery.query.sort({ created_at: -1 })
    }

    const paginatedResponse = new APIFeatures(products, req?.query).pagination()
    const paginatedProducts = paginatedResponse.query

    return res.status(200).json(paginatedProducts)
  } catch (error) {
    return next(new ErrorHandler(`Products not found: ${error.message}`, 500))
  }
})

exports.getSellerIdProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    // console.log(`Getting`, req.params);

    // Fetch filtered markets and apply search, filter, and pagination
    const productsQuery = new APIFeatures(
      Product.find({ seller_id: req.params.id }).lean(),
      req.query
    )
      .search()
      .filter()

    let products

    // Fetch countries
    if (req?.query?.latest === "true") {
      products = await productsQuery.query.sort({ created_at: -1 })
    } else if (req?.query?.latest === "false") {
      products = await productsQuery.query
    } else {
      products = await productsQuery.query.sort({ created_at: -1 })
    }

    const paginatedResponse = new APIFeatures(products, req?.query).pagination()
    const paginatedProducts = paginatedResponse.query

    const response = await translateNestedContent(language, paginatedProducts)

    return res.status(200).json(response)
  } catch (error) {
    return next(new ErrorHandler(`Products not found: ${error.message}`, 500))
  }
})

// Get single Product details    =>   /api/v1/product/:id
exports.getProductById = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category_id")
      .lean() // Convert Mongoose documents to plain objects

    if (!product) {
      return next(new ErrorHandler("Product not found", 404))
    }

    const language = req.headers["x-localization"] || "vi"

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(language, product)

    // console.log(response._id);

    return res.status(200).json({
      response,
    })
  } catch (error) {
    console.error("Error in getProductById:", error)
    return next(new ErrorHandler(`Product not found: ${error.message}`, 500))
  }
})

// Delete Product   =>   /api/v1/seller/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }

  await Auction.findByIdAndUpdate(
    product.product_id,
    { product_id: null },
    { new: true, useFindAndModify: false }
  )

  await product.remove()

  res.status(200).json({
    success: true,
    message: "Product is deleted.",
  })
})

const updateMissingQrCodes = async () => {
  try {
    const orders = await Product.find()

    if (!orders.length) {
      console.log("No orders found to update.")
      return
    }

    let counter = 1

    for (const order of orders) {
      if (order.vi) {
        console.log("vi.name: ", order.vi.name)
        order.name = order.vi.name
        order.description = order.vi.description
        order.introduction = order.vi.introduction
      }
      console.log("name: ", order.name)

      if (order.en) {
        delete order.en // Remove 'en' field
      }

      order.user_id = "672941009590b2ebde138085"

      console.log(`Updating order ${counter}: ${order._id}`)

      try {
        const updated = await order.save({ validateBeforeSave: false })
        console.log(`Updating updated name: ${updated.name}`)
        counter++
      } catch (saveError) {
        console.error(`Error saving order ${order._id}:`, saveError.message)
      }
    }

    console.log("All product info updated!")
  } catch (error) {
    console.error("Error updating products:", error.message)
  }
}

// updateMissingQrCodes()
