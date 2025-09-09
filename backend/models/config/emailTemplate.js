const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the EmailTemplate schema
const EmailTemplateSchema = new Schema(
  {
    title: { type: String },
    body: { type: String },
    body_2: { type: String },
    button_name: { type: String },
    footer_text: { type: String },
    copyright_text: { type: String },
  },
  { timestamps: true }
);

// Translations relationship
EmailTemplateSchema.virtual("translations", {
  ref: "Translation",
  localField: "_id",
  foreignField: "translationable",
  justOne: false,
});

// Methods to get translated fields
EmailTemplateSchema.methods.getTranslatedField = function (
  field,
  defaultValue
) {
  const translations = this.translations;
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      if (translation.key === field) {
        return translation.value;
      }
    }
  }
  return defaultValue;
};

EmailTemplateSchema.virtual("translatedBody").get(function () {
  return this.getTranslatedField("body", this.body);
});

EmailTemplateSchema.virtual("translatedBody2").get(function () {
  return this.getTranslatedField("body_2", this.body_2);
});

EmailTemplateSchema.virtual("translatedButtonName").get(function () {
  return this.getTranslatedField("button_name", this.button_name);
});

EmailTemplateSchema.virtual("translatedFooterText").get(function () {
  return this.getTranslatedField("footer_text", this.footer_text);
});

EmailTemplateSchema.virtual("translatedCopyrightText").get(function () {
  return this.getTranslatedField("copyright_text", this.copyright_text);
});

// Export the EmailTemplate model
module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);
