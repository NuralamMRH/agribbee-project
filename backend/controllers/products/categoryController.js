const { default: mongoose } = require("mongoose")
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const {
  Language,
  Address,
  Category,
  Product,
  Auction,
} = require("../../models")
const APIFeatures = require("../../utils/apiFeatures")
const ErrorHandler = require("../../utils/errorHandler")
const {
  fileUploadPromises,
  fileUpdatePromises,
} = require("../../utils/fileUploader")
const { translateNestedContent } = require("../../utils/translatedContent")

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    // Upload files if any
    const fieldsToUpload = ["image", "banner", "icon", "meta_image"]
    const uploadedFiles = await fileUploadPromises(
      req,
      res,
      next,
      fieldsToUpload,
      "category"
    )

    // Create new kioskData package
    const categoryData = {
      ...req.body,
      ...uploadedFiles,
    }
    const newCategory = new Category(categoryData)

    await newCategory.save()

    res.status(201).json({
      success: true,
      category: newCategory,
    })
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error creating new Category: ${error.message}`, 500)
    )
  }
})

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    let getCategory = await Category.findById(req.params.id)
    if (!getCategory) {
      return next(new ErrorHandler("Category not found", 404))
    }
    // Upload files if any
    const fieldsToUpload = ["image", "banner", "icon", "meta_image"]
    const uploadedFiles = await fileUpdatePromises(
      req,
      res,
      next,
      fieldsToUpload,
      "category",
      getCategory
    )

    // Create new kioskData package
    const categoryData = {
      ...req.body,
      ...uploadedFiles,
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    )

    res.status(201).json({
      success: true,
      category: updatedCategory,
    })
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error creating new Category: ${error.message}`, 500)
    )
  }
})

// except categories res.params.except=66f801aeccd41c266fe15e3b,66f8024eccd41c266fe15e40
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    // Parse the 'except' parameter into an array of category IDs to exclude
    const exceptIds = req.params.except ? req.params.except.split(",") : []

    const searchKey = req.query.name
      ? {
          [`${language}.name`]: { $regex: req.query.name, $options: "i" },
        }
      : {}

    // Build the query to exclude specified categories and those with `beverage: true`
    const filterQuery = {
      ...searchKey,
      _id: { $nin: exceptIds },
      beverage: { $ne: true }, // Exclude categories where `beverage` is true
      parent_id: null,
    }

    // Build the query to exclude specified category IDs
    const categoryQuery = new APIFeatures(
      Category.find(filterQuery)
        .populate("totalAuctions")
        .populate("totalProducts")
        .populate("totalChildren")
        .populate("children")
        .lean(),
      req.query
    )
      .search()
      .filter()

    const categories = await categoryQuery.query

    // Translate nested content for the specified language
    const response = await translateNestedContent(language, categories)

    return res.status(200).json({
      total_size: categories?.length,
      response,
    })
  } catch (error) {
    return next(new ErrorHandler(`Categories not found: ${error.message}`, 500))
  }
})

exports.getCategoryById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    const category = await Category.findById(req.params.id)
      .populate("products")
      .populate("sellers")
      .populate("totalChildren")
      .populate("children")
      .lean()

    // Fetch countries

    const response = await translateNestedContent(language, category)

    return res.status(200).json(response)
  } catch (error) {
    return next(new ErrorHandler(`Categories not found: ${error.message}`, 500))
  }
})

exports.getCategoriesWithProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    // Extract the category ID from request parameters
    const categoryId = req.params.id

    // Check if categoryId exists and is a valid ObjectId
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(new ErrorHandler("Invalid Category ID", 400))
    }

    // Extract query parameters for filtering
    const { limit, offset, type, seller_type, top_rated, avg_rating, price } =
      req.query

    // Construct product filters based on query parameters
    let productFilters = {}
    if (type) productFilters.type = type // Filter by product type
    if (seller_type) productFilters.seller_type = seller_type // Filter by seller type
    if (top_rated === "1") productFilters.top_rated = true // Top-rated products
    if (avg_rating) productFilters.avg_rating = { $gte: parseFloat(avg_rating) } // Minimum average rating
    if (price) productFilters.price = { $lte: parseFloat(price) } // Price filter

    // Fetch category with sellers and products, applying filters
    const category = await Category.findById(categoryId)
      .populate({
        path: "sellers",
        match: productFilters, // Apply filters to sellers
        options: {
          limit: parseInt(limit) || 10, // Limit number of products
          skip: parseInt(offset) || 0, // Pagination for products
        },
        populate: {
          path: "products",
          match: productFilters, // Apply filters to products
          options: {
            limit: parseInt(limit) || 10, // Limit number of products
            skip: parseInt(offset) || 0, // Pagination for products
          },
        },
      })
      .lean() // Ensure we get a plain object for manipulation

    // If category is not found, throw an error
    if (!category) {
      return next(new ErrorHandler("Category not found", 404))
    }

    // Translate category and sellers' data based on the selected language
    const translatedCategory = await translateNestedContent(language, category)

    // Send response with filtered and translated category data
    return res.status(200).json({
      success: true,
      category: translatedCategory,
    })
  } catch (error) {
    return next(
      new ErrorHandler(`Error fetching categories: ${error.message}`, 500)
    )
  }
})

exports.getCategoriesWithSellers = catchAsyncErrors(async (req, res, next) => {
  try {
    // Extract the category ID from request parameters
    const categoryId = req.params.id

    // Check if categoryId exists and is a valid ObjectId
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(new ErrorHandler("Invalid Category ID", 400))
    }

    // Extract query parameters for filtering
    const { limit, offset, type, seller_type, top_rated, avg_rating, price } =
      req.query

    // Construct product filters based on query parameters
    let productFilters = {}
    if (type) productFilters.type = type // Filter by product type
    if (seller_type) productFilters.seller_type = seller_type // Filter by seller type
    if (top_rated === "1") productFilters.top_rated = true // Top-rated products
    if (avg_rating) productFilters.avg_rating = { $gte: parseFloat(avg_rating) } // Minimum average rating
    if (price) productFilters.price = { $lte: parseFloat(price) } // Price filter

    // Fetch category with sellers and products, applying filters
    const category = await Category.findById(categoryId)
      .populate({
        path: "sellers",
        match: productFilters, // Apply filters to sellers
        options: {
          limit: parseInt(limit) || 10, // Limit number of products
          skip: parseInt(offset) || 0, // Pagination for products
        },
        populate: {
          path: "products",
          match: productFilters, // Apply filters to products
          options: {
            limit: parseInt(limit) || 10, // Limit number of products
            skip: parseInt(offset) || 0, // Pagination for products
          },
        },
      })
      .lean() // Ensure we get a plain object for manipulation

    // If category is not found, throw an error
    if (!category) {
      return next(new ErrorHandler("Category not found", 404))
    }

    // Send response with filtered and translated category data
    return res.status(200).json({
      success: true,
      category,
    })
  } catch (error) {
    return next(
      new ErrorHandler(`Error fetching categories: ${error.message}`, 500)
    )
  }
})

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    return next(new ErrorHandler("Category not found", 404))
  }

  await Auction.findByIdAndUpdate(
    category.category_id,
    { category_id: null },
    { new: true, useFindAndModify: false }
  )
  await Product.findByIdAndUpdate(
    category.category_id,
    { category_id: null },
    { new: true, useFindAndModify: false }
  )

  await category.remove()

  res.status(200).json({
    success: true,
    message: "Category is deleted.",
  })
})

const updateCategoriesAndSubcategories = async () => {
  try {
    const mainCategory = await Category.findById("66f801aeccd41c266fe15e3b") // Main category parent_id
    let counter = 0

    // Define categories and their subcategories
    const categories = [
      {
        name: "Fish",
        subCategories: [
          "Cá nục suông/ nục chuối",
          "Cá phèn nhỏ",
          "Cá phèn hồng lớn",
          "Cá bạc má",
          "Cá chim trắng",
          "Cá hố tươi",
          "Cá cơm sữa",
          "Cá cơm than",
          "Cá đối nhỏ",
          "Cá đối lớn",
          "Cá mó",
          "Cá sòng",
          "Cá ngân",
          "Cá thu cắt khoanh",
          "Cá bóp khoanh",
          "Đầu cá thu ( Fish Head Cá Thu)",
          "Đầu cá bóp",
          "Cá dìa",
          "Cá chỉ vàng",
          "Cá cam biển",
          "Cá khoai",
          "Cá gáy biển",
          "Cá đổng cờ",
          "Cá liệt",
          "Cá ngừ bò nguyên con",
          "Cá ngừ cắt khoanh",
          "Cá ngừ ồ",
          "Cá hường",
          "Cá hanh",
          "Cá bống đục",
          "Cá kình",
          "Cá bã trầu",
          "Cá bã trầu lửa ( sơn thóc )",
          "Cá mú biển",
          "Cá mú đỏ biển",
          "Cá khế ( bè trang)",
          "Cá chuồng",
          "Cá hồng biển",
          "Cá đù tươi",
          "Cá đuối",
          "Cá hồi phi lê",
          "Cá hồi khoanh",
          "Đầu cá hồi",
          "Cá bánh đường",
          "Cá chim đen",
        ],
      },
      {
        name: "Shrimp, Octopus, Squid",
        subCategories: [
          "Tôm sú biển",
          "Bạch tuột 2 da",
          "Mực ống trung",
          "Mực ống lớn",
          "Mực lá size 500g đến 1kg",
          "Ruột hàu",
          "Cua",
          "Ghe",
          "Thịt ghẹ lột sẵn",
        ],
      },
    ]

    // Loop through categories
    for (const category of categories) {
      console.log(`Processing subcategories for: ${category.name}`)

      // Loop through and insert subcategories
      for (const subCategory of category.subCategories) {
        const subCategoryData = {
          name: subCategory,
          meta_title: subCategory,
          description: subCategory,
          meta_description: subCategory,
          parent_id: mainCategory._id, // Use the provided main category parent_id
          image: mainCategory.image,
          image_full_url: mainCategory.image_full_url,
          banner: mainCategory.banner,
          banner_full_url: mainCategory.banner_full_url,
          icon: mainCategory.icon,
          icon_full_url: mainCategory.icon_full_url,
        }

        try {
          const subCategoryInstance = new Category(subCategoryData)
          const savedSubCategory = await subCategoryInstance.save()

          console.log(`Created subcategory: ${savedSubCategory.name}`)
          counter++
        } catch (saveError) {
          console.error(
            `Error saving subcategory "${subCategory}":`,
            saveError.message
          )
        }
      }
    }

    console.log(`All subcategories created successfully! Total: ${counter}`)
  } catch (error) {
    console.error("Error updating subcategories:", error.message)
  }
}

// updateCategoriesAndSubcategories()
