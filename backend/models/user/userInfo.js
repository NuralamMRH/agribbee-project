const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor" },
  deliveryman_id: { type: Schema.Types.ObjectId, ref: "DeliveryMan" },
  admin_id: { type: Schema.Types.ObjectId, ref: "Admin" },
});

// Relationships
UserInfoSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
});

// To include the virtuals when converting to JSON or Object
UserInfoSchema.set("toObject", { virtuals: true });
UserInfoSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("UserInfo", UserInfoSchema);
