const { WarehouseTransfer } = require("../models");

// Middleware to validate transfer existence and status
const validateTransferStatus = async (req, res, next) => {
  const { transfer_id } = req.body;

  try {
    const transfer = await WarehouseTransfer.findOne({ transfer_id }).populate(
      "products.product"
    );
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found." });
    }

    if (transfer.status === "Completed") {
      return res.status(400).json({ message: "Transfer already completed." });
    }

    req.transfer = transfer; // Attach transfer to request object
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error validating transfer.", error });
  }
};

module.exports = validateTransferStatus;
