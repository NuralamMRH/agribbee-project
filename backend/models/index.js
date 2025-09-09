const Language = require("./config/language")
const PaymentMethod = require("./payment/payment-method")
const SocialLogin = require("./config/social-login")
const SocialMedia = require("./config/social-media")
const agriculturalMarket = require("./home/landingPage")
const homeTabs = require("./home/homePageTabs")
const subscription = require("./subscription/subscription")
const subscriptionPackage = require("./subscription/subscriptionPackage")
const vendor = require("./vendor/vendor")
const address = require("./location/address")

const country = require("./location/country")
const region = require("./location/region")
const city = require("./location/city")
const market = require("./location/market")
const category = require("./product/category")
const product = require("./product/product")
const seller = require("./vendor/seller")
const sellerTag = require("./vendor/sellerTag")
const auction = require("./auction/auction")
const auction_bid = require("./auction/auctionBid")
const user = require("./user/user")
const cart = require("./product/cart")
const order = require("./order/order")
const warehouseTransfer = require("./warehouse/warehouseTransfer")
const warehouse = require("./warehouse/warehouse")
const QRCode = require("./QRCode/QRCode")
const inventory = require("./warehouse/inventory")
const configSchema = require("./config/config")
// Import other models as needed

module.exports = {
  Config: configSchema, // Exported as 'Config'
  User: user,
  Auction: auction,
  Bid: auction_bid,
  Country: country,
  Region: region,
  City: city,
  Market: market,
  Address: address,
  Vendor: vendor,
  Seller: seller,
  SellerTag: sellerTag,
  subscription,
  MembershipPackage: subscriptionPackage,
  Language,
  PaymentMethod,
  SocialMedia,
  SocialLogin,
  HomePageTabs: homeTabs,
  LandingPage: agriculturalMarket,
  Category: category,
  Product: product,
  Cart: cart,
  Order: order,
  Warehouse: warehouse,
  WarehouseTransfer: warehouseTransfer,
  QRCode: QRCode,
  Inventory: inventory,

  // Add other models here
}
