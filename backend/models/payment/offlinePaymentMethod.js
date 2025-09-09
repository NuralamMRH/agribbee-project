const OfflinePaymentMethodSchema = new Schema({
  status: { type: Number },
  method_fields: { type: Array },
  method_informations: { type: Array },
});

module.exports = mongoose.model(
  "OfflinePaymentMethod",
  OfflinePaymentMethodSchema
);
