const express = require("express");
const router = express.Router();
const {
  completeTransfer,
  getPendingTransfers,
  getCompletedTransfers,
  createTransferInventory,
  transferInventory,
  receiveInventory,
  createWarehouseWithoutManager,
} = require("../controllers/warehouse/warehouseController");
const validateTransferStatus = require("../middlewares/validateTransferStatus");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route to mark a transfer as completed
router
  .route("/create-own-warehouse")
  .post(
    isAuthenticatedUser,
    authorizeRoles("seller"),
    createWarehouseWithoutManager
  );

router.post("/create-transfer", createTransferInventory);

router.post("/warehouse-transfer-inventory", transferInventory);
router.post("/warehouse-received-inventory", receiveInventory);

router.post("/complete-transfer", validateTransferStatus, completeTransfer);

// Route to get pending transfers
router.get("/pending-transfers", getPendingTransfers);

// Route to get completed transfers
router.get("/completed-transfers", getCompletedTransfers);

module.exports = router;
