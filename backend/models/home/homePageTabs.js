const mongoose = require("mongoose");
const language = require("../config/language");
const ErrorHandler = require("../../utils/errorHandler");

const homeTabs = async () => {
  let tabs;

  try {
    tabs = mongoose.model("HomePageTabs");
  } catch (error) {
    if (error.name === "MissingSchemaError") {
      const languages = await language.find();

      if (!languages) {
        throw new ErrorHandler("No languages found in config", 500);
      }

      // Define the schema structure for multilingual content
      const translatedFields = {};
      languages.forEach((lang) => {
        translatedFields[lang.key] = {
          text: { type: String, required: true },
        };
      });

      const pageTabSchema = new mongoose.Schema({
        ...translatedFields,
        icon_image: { type: String, required: false },
        icon_image_full_url: { type: String, required: false },
        link: { type: String, required: false },
      });

      tabs = mongoose.model("HomePageTabs", pageTabSchema); // Create and compile the model
    } else {
      throw error; // Re-throw the error if it's something else
    }
  }

  return tabs;
};

module.exports = homeTabs;
