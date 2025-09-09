const CurrencySchema = new Schema(
  {
    country: { type: String, required: true },
    currency_code: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    exchange_rate: { type: Number, required: true },
  },
  { timestamps: true }
);

// Export the Currency model
module.exports = mongoose.model("Currency", CurrencySchema);
