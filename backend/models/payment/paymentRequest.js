const PaymentRequestSchema = new Schema({
  // Define necessary fields
  table_name: { type: String, default: "payment_requests" },
});

module.exports = mongoose.model("PaymentRequest", PaymentRequestSchema);
