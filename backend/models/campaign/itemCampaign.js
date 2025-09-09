const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemCampaignSchema = new Schema(
  {
    tax: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    start_date: { type: Date },
    end_date: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    maximum_cart_quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ItemCampaignSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.slug = await this.generateSlug(this.name);
  }
  next();
});

ItemCampaignSchema.methods.generateSlug = async function (name) {
  let slug = name.toLowerCase().replace(/ /g, "-");
  const existingSlug = await this.constructor
    .find({ slug: new RegExp(`^${slug}`, "i") })
    .sort({ _id: -1 })
    .limit(1);

  if (existingSlug.length > 0) {
    const lastSlug = existingSlug[0].slug;
    const slugParts = lastSlug.split("-");
    const lastCount = parseInt(slugParts[slugParts.length - 1]);
    if (isNaN(lastCount)) {
      slug = `${slug}-2`;
    } else {
      slug = `${slug}-${lastCount + 1}`;
    }
  }

  return slug;
};

// Export the model
module.exports = mongoose.model("ItemCampaign", ItemCampaignSchema);
