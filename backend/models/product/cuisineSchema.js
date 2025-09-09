const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const CuisineSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    image_full_url: { type: String },
    status: { type: Number, default: 1 },
    slug: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug on document creation
CuisineSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

CuisineSchema.methods.generateSlug = function (name) {
  let slug = slugify(name, { lower: true });
  return Cuisine.findOne({ slug: new RegExp("^" + slug + "(-[0-9]*)?$") })
    .sort({ slug: -1 })
    .then((existing) => {
      if (!existing) {
        return slug;
      }
      const match = existing.slug.match(/-(\d+)$/);
      const nextNumber = match ? parseInt(match[1]) + 1 : 2;
      return `${slug}-${nextNumber}`;
    });
};

module.exports = mongoose.model("Cuisine", CuisineSchema);
