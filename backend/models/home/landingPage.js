const mongoose = require("mongoose");
const language = require("../config/language");

const agriculturalMarketplaceSetup = async () => {
  const languages = await language.find().lean();
  if (!languages) {
    throw new ErrorHandler("No languages found in config", 500);
  }

  // Define the schema structure for multilingual content
  const translatedFields = {};
  languages.forEach((lang) => {
    translatedFields[lang.key] = {
      platformName: { type: String, required: true },
      tagline: { type: String, required: false },
      searchPlaceholder: { type: String, required: false },
      greenBarTitle: { type: String, required: true },
      aiAuctionService: aiAuctionService,
      efficiencyHeading: contentHeading,
      marketServiceKeys: marketServiceKeys,
      wholesalesMarketHeading: contentHeading,
      exploreCatSectionTitle: { type: String, required: false },
      searchFoodCatTitle: { type: String, required: false },
      howToTradeHeading: contentHeading,
      howToTradeContent: [marketServiceKeys],
      whyJoinUsTitle: { type: String, required: false },
      whyJoinWithUsContent: marketServiceKeys,
      wholesaleRegisterBtnTitle: { type: String, required: false },
      lookingForTraderTitle: { type: String, required: false },
      supplyChainSectionTitle: { type: String, required: false },
      supplyChainLeftContent: [contentHeading],
      supplyChainMiddle: [supplyChainCard],
      supply_card_first_name: { type: String, required: false },
      supply_card_second_name: { type: String, required: false },
      startBiddingTitle: { type: String, required: false },
      startBidding: [startBiddingCard],
      featuredAuctionTitle: { type: String, required: false },
      recentlyViewTitle: { type: String, required: false },
      recommendationTitle: { type: String, required: false },
      customerReviewSectionTitle: { type: String, required: false },
      internationalTransactions: {
        title: { type: String, required: false },
        keys: [{ type: String, required: false }],
        connectingWorldTitle: { type: String, required: false },
        connectingWorldDesc: { type: String, required: false },
      },
      contactSectionTitle: { type: String, required: false },
      contactSectionDesc: { partOne: String, partTwo: String },
    };
  });

  // Main schema that includes all sections and language-specific content
  const AgriculturalMarketplaceSchema = new mongoose.Schema({
    ...translatedFields,
    hero_banner_bg: { type: String, required: false },
    hero_banner_bg_full_url: { type: String, required: false },
    aiAuction_service_banner: { type: String, required: false },
    aiAuction_service_banner_full_url: { type: String, required: false },
    market_service_banner: { type: String, required: false },
    market_service_banner_full_url: { type: String, required: false },
    why_join_with_us_banner: { type: String, required: false },
    why_join_with_us_banner_full_url: { type: String, required: false },

    supply_card_first_image: { type: String, required: false },
    supply_card_first_image_full_url: { type: String, required: false },

    supply_card_second_image: { type: String, required: false },
    supply_card_second_image_full_url: { type: String, required: false },

    supply_chain_banner: { type: String, required: false },
    supply_chain_banner_full_url: { type: String, required: false },
    start_bidding_bg: { type: String, required: false },
    start_bidding_bg_full_url: { type: String, required: false },
    international_transaction_banner: { type: String, required: false },
    international_transaction_banner_full_url: {
      type: String,
      required: false,
    },
    search_bg: { type: String, required: false },
    search_bg_full_url: { type: String, required: false },
    // Additional fields you may need
  });

  return AgriculturalMarketplaceSchema;
};

// Schema definitions for different sections
const aiAuctionService = new mongoose.Schema({
  title: { type: String, required: true }, // Name of the service
  topTagline: { type: String, required: false },
  description: { type: String, required: false }, // Description of the service
});

const contentHeading = new mongoose.Schema({
  tagline: { type: String, required: false },
  topTagline: { type: String, required: false },
});

const supplyChainCard = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  icon: { type: String, required: false },
  priority: { type: Number, required: false },
});

const startBiddingCard = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  buttons: [{ btnName: String, btnLink: String }],
});

const marketServiceKeys = new mongoose.Schema({
  title: { type: String, required: true }, // Name of the service
  serviceKeys: [{ type: String, required: false }],
});

let AgriculturalMarket;

(async () => {
  const schema = await agriculturalMarketplaceSetup();
  AgriculturalMarket = mongoose.model("AgriculturalMarketplace", schema);
})();

module.exports = () => AgriculturalMarket;
