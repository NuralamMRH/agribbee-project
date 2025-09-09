const { Language } = require("../models");
const ErrorHandler = require("./errorHandler");
const mongoose = require("mongoose");

exports.translatedContent = async (language, content) => {
  // Fetch available languages
  const languages = await Language.find();

  // Extract language keys
  const languageKeys = languages.map((lang) => lang.key);

  // Prepare the response contents
  const responseContents = content.map((data) => {
    const translatedContent = data[language] || {};

    // Remove language-specific fields
    languageKeys.forEach((key) => {
      delete data[key];
    });

    // Merge translated content with the other fields
    return { ...translatedContent, ...data };
  });
  return responseContents;
};

exports.singleTranslation = async (language, content) => {
  // Fetch available languages
  const languages = await Language.find();

  // Convert document to a plain object
  const dataObject = content.toObject();

  // Build the translated content dynamically based on the selected language
  const translatedContent = dataObject[language] || {};

  // Remove all language-specific fields from the main config object
  Object.keys(dataObject).forEach((key) => {
    if (languages.map((lang) => lang.key).includes(key)) {
      delete dataObject[key];
    }
  });

  // Merge the translated content with the other fields
  return { ...dataObject, ...translatedContent };
};

// Translation and cleanup function
exports.translateNestedContent = async (language, content) => {
  const languages = await Language.find();
  const languageKeys = languages.map((lang) => lang.key);

  // Helper function to convert ObjectId to strings dynamically
  const convertObjectIds = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (mongoose.Types.ObjectId.isValid(obj[key])) {
          obj[key] = obj[key].toString(); // Convert ObjectId to string
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          // Recursively check nested objects and arrays
          obj[key] = convertObjectIds(obj[key]);
        }
      }
    }
    return obj;
  };

  const translateAndClean = (obj, depth = 0, visited = new WeakSet()) => {
    if (depth > 20) {
      return obj; // Prevent excessive recursion
    }

    if (obj && typeof obj === "object") {
      if (visited.has(obj)) {
        return obj; // Avoid circular references
      }

      visited.add(obj);

      if (Array.isArray(obj)) {
        return obj.map((item) => translateAndClean(item, depth + 1, visited));
      } else {
        // Convert all ObjectId fields dynamically to strings
        obj = convertObjectIds(obj);

        // Store a copy of the original object without the language-specific fields
        const globalContent = { ...obj };

        // Handle translation
        const translatedContent = obj[language] || {};

        // Remove all language-specific keys (like 'vi', 'en') from the global object
        languageKeys.forEach((key) => {
          delete globalContent[key];
        });

        // Recursively process nested objects, preserving non-translatable fields
        for (const key in globalContent) {
          if (globalContent.hasOwnProperty(key)) {
            // Ensure date fields are kept intact and not processed as objects
            if (globalContent[key] instanceof Date) {
              // Do nothing; keep the date field as is
              continue;
            }

            if (typeof globalContent[key] === "object") {
              globalContent[key] = translateAndClean(
                globalContent[key],
                depth + 1,
                visited
              );
            }
          }
        }

        // Merge translated content with global content
        return { ...globalContent, ...translatedContent };
      }
    } else {
      return obj; // Return primitive values (non-objects) as is
    }
  };

  // Process the content (array or object)
  if (Array.isArray(content)) {
    return content.map((data) => translateAndClean(data));
  } else if (content && typeof content === "object") {
    return translateAndClean(content);
  } else {
    throw new ErrorHandler("Content is neither an object nor an array");
  }
};
