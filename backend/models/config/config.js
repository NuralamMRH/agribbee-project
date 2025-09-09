// models/Config.js
const mongoose = require("mongoose");
const Language = require("./language");
const Schema = mongoose.Schema;

const BaseUrlsSchema = new Schema({
  product_image_path: String,
  customer_image_path: String,
  banner_image_path: String,
  category_image_path: String,
  cuisine_image_path: String,
  review_image_path: String,
  notification_image_path: String,
  kiosk_image_path: String,
  vendor_image_path: String,
  seller_image_path: String,
  market_image_path: String,
  auction_image_path: String,
  email_image_path: String,
  user_image_path: String,
  delivery_man_image_path: String,
  chat_image_path: String,
  campaign_image_path: String,
  business_logo_path: String,
  home_page_image_path: String,
  refund_image_path: String,
  gateway_image_path: String,
  order_attachment_path: String,
  home_tabs_image_path: String,
});

const LocationSchema = new Schema({
  lat: String,
  lng: String,
});

const configSchema = async () => {
  let Config;

  // Check if the model has already been compiled
  try {
    Config = mongoose.model("Config");
  } catch (error) {
    if (error.name === "MissingSchemaError") {
      const languages = await Language.find(); // Get the config with languages

      if (!languages) {
        throw new ErrorHandler("No languages found", 500);
      }

      const contentFields = {};
      languages.forEach((lang) => {
        contentFields[lang.key] = {
          cookies_text: String,
          refund_policy_data: String,
          cancellation_policy_data: String,
          shipping_policy_data: String,
          terms_and_conditions: String,
          privacy_policy: String,
          about_us: String,
          footer_text: String,
        };
      });

      const ConfigSchema = new mongoose.Schema({
        business_name: String,
        logo: String,
        logo_full_url: String,
        banners: [],
        address: String,
        phone: String,
        email: String,
        base_urls: BaseUrlsSchema,
        country: String,
        default_location: LocationSchema,
        currency_symbol: String,
        currency_symbol_direction: String,
        app_minimum_version_android: Number,
        app_url_android: String,
        app_minimum_version_ios: Number,
        app_url_ios: String,
        customer_verification: Boolean,
        schedule_order: Boolean,
        order_delivery_verification: Boolean,
        cash_on_delivery: Boolean,
        digital_payment: Boolean,
        free_delivery_over: Number,
        free_delivery_distance: Number,
        demo: Boolean,
        maintenance_mode: Boolean,
        order_confirmation_model: String,
        popular_food: Number,
        popular_restaurant: Number,
        new_restaurant: Number,
        most_reviewed_foods: Number,
        show_dm_earning: Boolean,
        canceled_by_deliveryman: Boolean,
        canceled_by_restaurant: Boolean,
        timeformat: String,
        language: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Language",
          },
        ],
        toggle_veg_non_veg: Boolean,
        toggle_dm_registration: Boolean,
        toggle_restaurant_registration: Boolean,
        schedule_order_slot_duration: Number,
        digit_after_decimal_point: Number,
        loyalty_point_exchange_rate: Number,
        loyalty_point_item_purchase_point: Number,
        loyalty_point_status: Number,
        minimum_point_to_transfer: Number,
        customer_wallet_status: Number,
        ref_earning_status: Number,
        ref_earning_exchange_rate: Number,
        dm_tips_status: Number,
        theme: Number,
        social_media: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SocialMedia",
          },
        ],
        social_login: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SocialLoginMethods",
          },
        ],
        business_plan: {
          commission: Number,
          subscription: Number,
        },
        admin_commission: Number,
        footer_text: String,
        fav_icon: String,
        fav_icon_full_url: String,
        refund_active_status: Boolean,
        free_trial_period_status: Number,
        free_trial_period_data: Number,
        app_minimum_version_android_restaurant: Number,
        app_url_android_restaurant: String,
        app_minimum_version_ios_restaurant: Number,
        app_url_ios_restaurant: String,
        app_minimum_version_android_deliveryman: Number,
        app_url_android_deliveryman: String,
        app_minimum_version_ios_deliveryman: String,
        app_url_ios_deliveryman: String,
        tax_included: Number,
        apple_login: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SocialLoginMethods",
          },
        ],
        order_subscription: Number,

        refund_policy_status: Number,
        cancellation_policy_status: Number,
        shipping_policy_status: Number,

        take_away: Boolean,
        repeat_order_option: Boolean,
        home_delivery: Boolean,
        active_payment_method_list: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentMethod",
          },
        ],
        add_fund_status: Number,
        partial_payment_status: Number,
        partial_payment_method: String,
        additional_charge_status: Number,
        additional_charge_name: String,
        additional_charge: Number,
        dm_picture_upload_status: Number,
        digital_payment_info: {
          digital_payment: Boolean,
          plugin_payment_gateways: Boolean,
          default_payment_gateways: Boolean,
        },
        banner_data: {
          promotional_banner_image: String,
          promotional_banner_title: String,
          promotional_banner_image_full_url: String,
        },
        offline_payment_status: Number,
        guest_checkout_status: Number,
        country_picker_status: Number,
        instant_order: Boolean,
        extra_packaging_charge: Boolean,
        customer_date_order_sratus: Boolean,
        customer_order_date: Number,
        deliveryman_additional_join_us_page_data: Object,
        restaurant_additional_join_us_page_data: Object,
        disbursement_type: String,
        restaurant_disbursement_waiting_time: Number,
        dm_disbursement_waiting_time: Number,
        min_amount_to_pay_restaurant: Number,
        min_amount_to_pay_dm: Number,
        restaurant_review_reply: Boolean,
        ...contentFields,
        // Other fields you may need
      });

      Config = mongoose.model("Config", ConfigSchema); // Create and compile the model
    } else {
      throw error; // Re-throw the error if it's something else
    }
  }

  return Config;
};

module.exports = configSchema;
