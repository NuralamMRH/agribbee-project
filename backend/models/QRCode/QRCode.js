const { default: mongoose } = require("mongoose");

const QRCodeSchema = new mongoose.Schema({
  qr_code_id: { type: String, unique: true, required: true }, // Unique QR code ID
  data: { type: String, required: true }, // Encoded data for the QR code (e.g., JSON string)
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date }, // Optional expiration date for QR code
});

module.exports = mongoose.model("QRCode", QRCodeSchema);
