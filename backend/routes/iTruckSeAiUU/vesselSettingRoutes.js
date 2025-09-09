const express = require("express");
const router = express.Router();
const {
  getAllVesselSettings,
  createVesselSetting,
  getVesselSetting,
  updateVesselSetting,
  deleteVesselSetting,
  getUserAllVesselSettings,
} = require("../../controllers/iTruckSeAiUU/vesselSettingController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../../middlewares/auth");
const upload = require("../../config/multerConfig");

// Public routes
router.get("/vessel-settings", getAllVesselSettings);

router.get(
  "/my-vessel-settings",
  isAuthenticatedUser,
  getUserAllVesselSettings
);
router.get("/vessel-setting/:id", getVesselSetting);

// Protected routes (require authentication)
router.post(
  "/vessel-setting",
  upload.fields([{ name: "document_image" }]),
  isAuthenticatedUser,
  createVesselSetting
);

router.put(
  "/vessel-setting/:id",
  upload.fields([{ name: "document_image" }]),
  isAuthenticatedUser,
  authorizeRoles("user", "admin"),
  updateVesselSetting
);

router.delete(
  "/vessel-setting/:id",
  isAuthenticatedUser,
  authorizeRoles("user", "admin"),
  deleteVesselSetting
);

module.exports = router;
