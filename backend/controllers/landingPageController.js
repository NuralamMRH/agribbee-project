const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { LandingPage, Language } = require("../models");
const {
  uploadFile,
  deleteLocalFile,
  deleteCloudinaryFile,
  uploadMultipleFiles,
  fileUpdatePromises,
  fileUploadPromises,
} = require("../utils/fileUploader");
// controllers/landingPageController.js

exports.getLandingPageData = async (req, res, next) => {
  try {
    if (req.bodyStream.locked) {
      // If the stream is locked, the response would have been sent by the middleware.
      return;
    }

    // Simulate fetching data
    const landingPageData = {
      title: "Welcome to Our Landing Page",
      description: "This is the best place to find amazing deals.",
      featuredProducts: [
        { id: 1, name: "Product A", price: 100 },
        { id: 2, name: "Product B", price: 200 },
      ],
    };

    // Send the actual response when the stream is unlocked
    return res.status(200).json({
      success: true,
      message: "Landing page data fetched successfully.",
      data: landingPageData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHomePageData = catchAsyncErrors(async (req, res, next) => {
  // If the middleware unlocked the stream, this will be the response
  const language = req.headers["x-localization"] || "vi";

  const landingPage = await LandingPage();
  const languages = await Language.find();

  let landing = await landingPage.findOne().populate("");
  if (!landing) {
    return next(new ErrorHandler("Configuration not found", 404));
  }

  // Convert document to a plain object
  const landingPageObject = landing.toObject();

  // Build the translated content dynamically based on the selected language
  const translatedContent = landingPageObject[language] || {};

  // Remove all language-specific fields from the main config object
  Object.keys(landingPageObject).forEach((key) => {
    if (languages.map((lang) => lang.key).includes(key)) {
      delete landingPageObject[key];
    }
  });

  // Merge the translated content with the other fields
  const response = { ...landingPageObject, ...translatedContent };

  return res.status(200).json({
    success: true,
    response,
  });
});

// controllers/landingPageController.js
exports.homePageContent = catchAsyncErrors(async (req, res, next) => {
  try {
    const Home = await LandingPage();
    let home = await Home.findOne();

    // Push file upload promises if files exist

    const fieldsToUpload = [
      "hero_banner_bg",
      "aiAuction_service_banner",
      "market_service_banner",
      "why_join_with_us_banner",
      "supply_card_first_image",
      "supply_card_second_image",
      "supply_chain_banner",
      "start_bidding_bg",
      "international_transaction_banner",
      "search_bg",
    ];

    // Create or update the config document
    if (!home) {
      const uploadResults = await fileUploadPromises(
        req,
        res,
        next,
        fieldsToUpload,
        "home"
      );
      home = new Home({ ...req.body, ...uploadResults });
    } else {
      const uploadResults = await fileUpdatePromises(
        req,
        res,
        next,
        fieldsToUpload,
        "home",
        home
      );

      // Check if the array field is being updated and push new content
      if (req.body.supplyChainLeftContent) {
        req.body.supplyChainLeftContent.forEach((content) => {
          home[req.body.language].supplyChainLeftContent.push(content);
        });
      }

      home.set({ ...req.body, ...uploadResults });
    }

    // Save the configuration
    await home.save();
    res.status(201).json({
      success: true,
      home,
    });
  } catch (err) {
    return next(new ErrorHandler("Some problems with this API", 500));
  }
});

// Controller to update supplyChainLeftContent for a specific language
exports.updateSupplyChainLeftContent = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const Home = await LandingPage(); // Get the model instance
      let home = await Home.findOne();

      if (!home) {
        return next(new ErrorHandler("Home content not found", 404));
      }

      // Iterate over the request body keys to handle multi-language updates
      const updates = req.body;

      Object.keys(updates).forEach((key) => {
        // Split the key into language and fieldName (e.g., 'vi.supplyChainLeftContent')
        const [language, field] = key.split(".");

        if (language && field) {
          // Update the array in the respective language's field
          if (!home[language]) {
            // Initialize the language object if it doesn't exist
            home[language] = {};
          }

          // Dynamically set the field's value based on the key
          home[language][field] = updates[key]; // Overwrite or create the array for this field
        }
      });

      // Save the updated document
      await home.save();

      res.status(200).json({
        success: true,
        message:
          "Content updated successfully for multiple languages and fields",
        home, // Return the updated content
      });
    } catch (err) {
      return next(
        new ErrorHandler(`Failed to update content: ${err.message}`, 500)
      );
    }
  }
);
