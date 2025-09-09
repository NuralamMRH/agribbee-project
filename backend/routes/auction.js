const express = require("express")
const {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  getAuctionBySlug,
  getMyAuctions,
} = require("../controllers/auction/auctionController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")
const upload = require("../config/multerConfig")
const router = express.Router()

router
  .route("/seller/create/auction")
  .post(
    upload.fields([{ name: "image" }, { name: "images" }]),
    isAuthenticatedUser,
    authorizeRoles("seller"),
    createAuction
  )

router
  .route("/seller/update/auction/:id")
  .put(
    upload.fields([{ name: "image" }, { name: "images" }]),
    isAuthenticatedUser,
    authorizeRoles("seller"),
    updateAuction
  )

router.route("/auctions").get(getAuctions)
router.route("/auctions/:id").get(getAuctionById)
router
  .route("/me/auctions")
  .get(isAuthenticatedUser, authorizeRoles("seller"), getMyAuctions)

router.route("/get/auction/:slug").get(isAuthenticatedUser, getAuctionBySlug)

module.exports = router
