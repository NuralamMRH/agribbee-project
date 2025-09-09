const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Product schema
const VesselSettingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: String, default: "" },
    ownerId: { type: String, default: "" },
    residentialAddress: { type: String, default: "" },
    vesselId: { type: String, default: "", unique: true },
    type: { type: String, default: "" },
    grossTonnage: { type: Number, default: 0 },
    lengthOverall: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    draft: { type: Number, default: 0 },
    materials: { type: String, default: "" },
    numberOfEngines: { type: Number, default: 0 },
    totalPower: { type: Number, default: 0 },
    machineType: { type: String, default: "" },
    engineSerialNumber: { type: String, default: "" },
    portRegistry: { type: String, default: "" },
    fisheryPermit: { type: String, default: "" },
    expirationDate: { type: Date, default: null },
    document_image: { type: String, default: null },
    document_image_full_url: { type: String, default: null },

    // Fishing Methods
    fishingMethods: {
      primary: {
        purseSeine: { type: Boolean, default: false },
        hook: { type: Boolean, default: false },
        net: { type: Boolean, default: false },
        trawl: { type: Boolean, default: false },
      },
      secondary1: {
        purseSeine: { type: Boolean, default: false },
        hook: { type: Boolean, default: false },
        net: { type: Boolean, default: false },
        trawl: { type: Boolean, default: false },
      },
      secondary2: {
        purseSeine: { type: Boolean, default: false },
        hook: { type: Boolean, default: false },
        net: { type: Boolean, default: false },
        trawl: { type: Boolean, default: false },
      },
    },

    // Gear Size
    gearLength: { type: Number, default: 0 },
    gearHeight: { type: Number, default: 0 },
    gearCircumference: { type: Number, default: 0 },
    hookPosition: { type: Number, default: 0 },

    // Tank Info
    numberOfTanks: { type: Number, default: 1.8 },

    // Crew Information
    captainName: { type: String, default: "" },
    captainLicense: { type: String, default: "" },
    captainPhone: { type: String, default: "" },
    mechanicName: { type: String, default: "" },
    mechanicLicense: { type: String, default: "" },
    crewCertifications: [
      {
        id: { type: Number, required: true },
        checked: { type: Boolean, default: false },
        name: { type: String, default: "" },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Logs relationship
VesselSettingSchema.virtual("logs", {
  ref: "Log",
  localField: "_id",
  foreignField: "model_id",
  match: { model: "VesselSetting" },
});

// Method to generate unique vesselId
VesselSettingSchema.methods.generateUniqueVesselId = async function () {
  const prefix = "BV-";
  const suffix = "-TS";

  // Get the latest vesselId
  const latestVessel = await this.constructor
    .findOne({})
    .sort({ vesselId: -1 });

  let nextNumber = 1;

  if (latestVessel && latestVessel.vesselId) {
    // Extract the number from the existing vesselId
    const match = latestVessel.vesselId.match(/BV-(\d+)-TS/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  // Format the number with leading zeros (5 digits)
  const formattedNumber = nextNumber.toString().padStart(5, "0");

  return `${prefix}${formattedNumber}${suffix}`;
};

// Slug Generation before save
VesselSettingSchema.pre("save", async function (next) {
  const vessel = this;

  // Generate vesselId if not provided
  if (!vessel.vesselId) {
    vessel.vesselId = await vessel.generateUniqueVesselId();
  }

  // Generate slug if the vessel is new or the name is modified
  if (vessel.isNew || vessel.isModified("name") || vessel.isModified("slug")) {
    if (vessel.name) {
      vessel.slug = await vessel.generateSlug(vessel.name);
    }
  }

  next();
});

// Export the Product model
module.exports = mongoose.model("VesselSetting", VesselSettingSchema);
