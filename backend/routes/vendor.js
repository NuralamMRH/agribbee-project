const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { unlockBody, isBodyLocked } = require("../middlewares/isBodyLocked");
const { getVendors } = require("../controllers/vendor/vendorController");

router.route("/vendors").get(unlockBody, getVendors);

module.exports = router;
