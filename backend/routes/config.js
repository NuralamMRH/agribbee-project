// routes/config.js
const express = require("express");
const router = express.Router();
const {
  newConfig,
  getConfig,
  deleteFile,
  deleteLanguage,
  updateLanguage,
  newLanguage,
  newPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
  newSocial,
  deleteSocial,
  updateSocial,
  newSocialLogin,
  deleteSocialLogin,
  updateSocialLogin,
  newAppleLogin,
  deleteAppleLogin,
  updateAppleLogin,
} = require("../controllers/configController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

//New / Update config
// router
//   .route("/admin/config/update")
//   .post(
//     upload.fields([
//       { name: "logo" },
//       { name: "fav_icon" },
//       { name: "banners" },
//     ]),
//     newConfig
//   );

router.post(
  "/admin/config/update",
  upload.fields([{ name: "logo" }, { name: "fav_icon" }, { name: "banners" }]),
  newConfig
);

// Get Config
router.route("/config").get(getConfig);

router.route("/admin/delete-file").delete(deleteFile);

//add language
router.route("/admin/language").post(newLanguage);
//delete language
router.route("/admin/language/:id").delete(deleteLanguage);

// update language
router.route("/admin/language/:id").put(updateLanguage);

//add PaymentMethod
router.route("/admin/payment-method").post(newPaymentMethod);
//delete PaymentMethod
router.route("/admin/payment-method/:id").delete(deletePaymentMethod);

// update PaymentMethod
router.route("/admin/payment-method/:id").put(updatePaymentMethod);

//add Social
router.route("/admin/social").post(newSocial);
//delete Social
router.route("/admin/social/:id").delete(deleteSocial);

// update Social
router.route("/admin/social/:id").put(updateSocial);

//add Social login
router.route("/admin/social-login").post(newSocialLogin);
//delete Social login
router.route("/admin/social-login/:id").delete(deleteSocialLogin);

// update Social login
router.route("/admin/social-login/:id").put(updateSocialLogin);

//add Social login
router.route("/admin/apple-login").post(newAppleLogin);
//delete Social login
router.route("/admin/apple-login/:id").delete(deleteAppleLogin);

// update Social login
router.route("/admin/apple-login/:id").put(updateAppleLogin);

module.exports = router;
