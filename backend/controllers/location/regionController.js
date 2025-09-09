const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const { Region } = require("../../models")
const ErrorHandler = require("../../utils/errorHandler")
const { translateNestedContent } = require("../../utils/translatedContent")

exports.createRegion = catchAsyncErrors(async (req, res, next) => {
  try {
    // Create new subscription package
    const data = { ...req.body }
    const newData = new Region(data)

    await newData.save()

    res.status(201).json({
      success: true,
      newData,
    })
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error creating package: ${error.message}`, 500)
    )
  }
})

exports.getRegions = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    let filter = {}
    if (req.query.country) {
      filter = { country: req.query.country }
    }

    // Fetch region
    const regions = await Region.find(filter).populate("cities").lean()

    // Prepare the response contents
    const responseContents = await translateNestedContent(language, regions)

    return res.status(200).json({
      success: true,
      regions: responseContents,
    })
  } catch (error) {
    return next(new ErrorHandler(`Regions not found: ${error.message}`, 500))
  }
})

// Get single region details   =>   /api/v1/region/:id
exports.getRegionById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi"

    // Fetch region
    const getRegion = await Region.findById(req.params.id).lean()

    // Prepare the response contents
    const response = await translateNestedContent(language, getRegion)

    return res.status(200).json({
      success: true,
      region: response,
    })
  } catch (error) {
    return next(new ErrorHandler(`region not found: ${error.message}`, 500))
  }
})

// PUT single region details   =>   /api/v1/region/:id
exports.updateRegionById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch region
    const getRegion = await Region.findById(req.params.id)

    // Prepare the response contents
    getRegion.set({ ...req.body })
    getRegion.save()

    return res.status(200).json({
      success: true,
      getRegion,
    })
  } catch (error) {
    return next(new ErrorHandler(`Region not found: ${error.message}`, 500))
  }
})

// DELETE single region    =>   /api/v1/admin/region/:id
exports.deleteRegionById = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch region
    Region.findByIdAndDelete(req.params.id).then((r) => {
      if (!r) {
        return next(new ErrorHandler("Region not found", 404))
      } else {
        return res.status(200).json({
          success: true,
          message: "Region is deleted.",
        })
      }
    })
  } catch (error) {
    return next(new ErrorHandler(`Region not found: ${error.message}`, 500))
  }
})
