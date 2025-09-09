const express = require("express");
const { isBodyLocked, unlockBody } = require("../middlewares/isBodyLocked");
const {
  getLandingPageData,
  getHomePageData,
  homePageContent,
  updateSupplyChainLeftContent,
} = require("../controllers/landingPageController");
const upload = require("../config/multerConfig");
const {
  getHomePageTabs,
  homePageTab,
  updateTab,
} = require("../controllers/homePageTabsController");

const router = express.Router();

router
  .route("/react-landing-page")
  .get(unlockBody, getHomePageData)
  .post(
    upload.fields([
      { name: "hero_banner_bg" },
      { name: "aiAuction_service_banner" },
      { name: "market_service_banner" },
      { name: "why_join_with_us_banner" },
      { name: "supply_card_first_image" },
      { name: "supply_card_second_image" },
      { name: "supply_chain_banner" },
      { name: "start_bidding_bg" },
      { name: "international_transaction_banner" },
      { name: "search_bg" },
    ]),
    homePageContent
  ); // Example: Post to unlock

router
  .route("/update-supply-chain-left-content")
  .put(updateSupplyChainLeftContent);

router.route("/landing-page").get(isBodyLocked, getLandingPageData); // Example: Post to unlock

router
  .route("/home-page-tabs")
  .get(unlockBody, getHomePageTabs)
  .post(upload.fields([{ name: "icon_image" }]), homePageTab);

router.route("/home-page-tabs/:id").put(updateTab);

module.exports = router;
