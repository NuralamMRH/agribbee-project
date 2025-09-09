const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { unlockBody, isBodyLocked } = require("../middlewares/isBodyLocked");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const {
  createInventory,
  updateInventory,
  deleteInventory,
  getInventories,
  getInventoryById,
} = require("../controllers/warehouse/inventoryController");

router.route("/inventory/create").post(isAuthenticatedUser, createInventory);

router
  .route("/inventory/:id")
  .put(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventory);

router.route("/inventories").get(getInventories);

module.exports = router;
