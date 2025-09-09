const express = require("express");
const router = express.Router();

const {
  createSubscriptionPackage,
  getSubscriptionPackages,
  getPackageById,
  updateSubscriptionPackage,
  deletePackage,
} = require("../controllers/subscription/subscriptionController");
const upload = require("../config/multerConfig");
const { unlockBody } = require("../middlewares/isBodyLocked");

router
  .route("/admin/package")
  .post(upload.fields([{ name: "icon_image" }]), createSubscriptionPackage);
router
  .route("/admin/package/:id")
  .put(upload.fields([{ name: "icon_image" }]), updateSubscriptionPackage);
router.route("/admin/package/:id").delete(deletePackage);

router.route("/packages").get(getSubscriptionPackages);
router.route("/packages/:id").get(getPackageById);

module.exports = router;
