const express = require("express")
const router = express.Router()
const upload = require("../config/multerConfig")
const { unlockBody, isBodyLocked } = require("../middlewares/isBodyLocked")
const {
  createSellerAccount,
  updateSellerById,
  deleteSellerById,
  getSellers,
  getSellerById,
  getLocationBasedSellers,
} = require("../controllers/vendor/sellerController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router
  .route("/seller/register")
  .post(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    upload.fields([{ name: "image" }, { name: "banner" }]),
    createSellerAccount
  )

router
  .route("/seller/:id")
  .put(upload.fields([{ name: "image" }, { name: "banner" }]), updateSellerById)

router.route("/sellers").get(getSellers)

router.route("/sellers/location").get(getLocationBasedSellers)

router.route("/seller/:id").get(getSellerById)

router.route("/seller/:id").delete(deleteSellerById)

module.exports = router
