const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { unlockBody, isBodyLocked } = require("../middlewares/isBodyLocked");

const {
  createCountry,
  getCountries,
  getCountryById,
  updateCountryById,
} = require("../controllers/location/countryController");
const {
  createMarket,
  getMarkets,
  updateMarketById,
  getMarketById,
  deleteMarketById,
  getRegionBasedMarkets,
  getCityBasedMarkets,
  updateMarkets,
} = require("../controllers/location/marketController");
const {
  createCity,
  getCities,
  updateCityById,
  getCityById,
} = require("../controllers/location/cityController");
const {
  createRegion,
  getRegions,
  updateRegionById,
  getRegionById,
  deleteRegionById,
} = require("../controllers/location/regionController");
const {
  getAddress,
  getAddressById,
  updateAddressById,
  getUserAddressList,
  deleteUserAddress,
  userUpdateAddressById,
  userAddNewAddress,
} = require("../controllers/location/addressController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router
  .route("/admin/country")
  .post(upload.fields([{ name: "flag" }]), createCountry);

router.route("/countries").get(getCountries);
router
  .route("/admin/country/:id")
  .get(getCountryById)
  .put(upload.fields([{ name: "flag" }]), updateCountryById);

router.route("/admin/region").post(createRegion);
router.route("/admin/region/:id").put(updateRegionById);
router.route("/region/:id").get(getRegionById);
router.route("/admin/region/:id").delete(deleteRegionById);
router.route("/regions").get(getRegions);

router.route("/admin/city").post(createCity);
router.route("/admin/city/:id").put(updateCityById);
router.route("/city/:id").get(getCityById);
router.route("/cities").get(getCities);

router
  .route("/admin/market")
  .post(upload.fields([{ name: "image" }, { name: "banner" }]), createMarket);
router
  .route("/admin/market/:id")
  .put(upload.fields([{ name: "image" }, { name: "banner" }]), updateMarketById)
  .delete(deleteMarketById);

router.route("/markets").get(getMarkets);

router.route("/update-markets").put(updateMarkets);

router.route("/markets/regions").get(getRegionBasedMarkets);
router.route("/markets/cities").get(getCityBasedMarkets);
router.route("/market/:id").get(getMarketById);

router.route("/address").get(getAddress);
router.route("/me/address/list").get(isAuthenticatedUser, getUserAddressList);
router.route("/me/address/add").post(isAuthenticatedUser, userAddNewAddress);
router
  .route("/me/address/update/:id")
  .put(isAuthenticatedUser, userUpdateAddressById);
router
  .route("/me/address/delete/:id")
  .delete(isAuthenticatedUser, deleteUserAddress);

router.route("/address/:id").get(getAddressById).put(updateAddressById);

module.exports = router;
