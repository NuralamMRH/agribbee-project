const {
  Warehouse,
  WarehouseTransfer,
  Inventory,
  User,
  Seller,
} = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { sendGmail } = require("../../utils/sendEmail");
const {
  generateWarehousePDF,
  generateWarehouseProductListPDF,
} = require("../../utils/generatePDF");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const createAddress = require("../../utils/createAddress");

const createWarehouseWithoutManager = catchAsyncErrors(
  async (req, res, next) => {
    let { name, managerEmail, phone, addressId } = req.body;

    const sellerData = await Seller.findOne({ user_id: req.user.id });
    if (!sellerData) {
      return next(new ErrorHandler("Seller not found for this user.", 404));
    }

    if (!name || !managerEmail || !phone) {
      name = req.body.contact_person_name;
      managerEmail = req.body.contact_person_email;
      phone = req.body.contact_person_number;
    }
    if (
      !req.body.contact_person_name ||
      !req.body.contact_person_email ||
      !req.body.contact_person_number
    ) {
      req.body.contact_person_name = name;
      req.body.contact_person_email = managerEmail;
      req.body.contact_person_number = phone;
    }

    if (!addressId) addressId = await createAddress(req, next);

    // Send email to the manager with login credentials

    const message = `Dear ${
      sellerData?.seller_type || ""
    },\n\nYour warehouse has been created.\n\nThank you,\nAgribbee`;

    let location = {
      type: "Point", // GeoJSON format
      coordinates: [req.body.lng, req.body.lat], // Store longitude first in GeoJSON
    };

    if (req.body.isDefault) {
      // Update all other addresses to isDefault: false for the given user
      await Warehouse.updateMany(
        { seller_id: sellerData._id, isDefault: true }, // Find all addresses with the same user_id and isDefault: true
        { $set: { isDefault: false } } // Set their isDefault to false
      );
    }

    const warehouseData = {
      name,
      location,
      address_id: addressId,
      manager_id: req.user.id,
      seller_id: sellerData._id,
      zip: req.body.zip,
    };
    console.log("warehouse: ", warehouseData);
    // Create new warehouse
    const warehouse = await Warehouse.create(warehouseData);

    res.status(201).json({
      success: true,
      message: "Warehouse Management Account Created",
      warehouse,
    });
  }
);

// Create Transfer Inventory and Send Email with Invoice
const createTransferInventory = catchAsyncErrors(async (req, res, next) => {
  const { sender_warehouse, receiver_warehouse, inventories, transferId } =
    req.body;

  // Step 1: Validate input
  if (
    !sender_warehouse ||
    !receiver_warehouse ||
    !inventories ||
    inventories.length === 0
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data provided." });
  }

  // Step 2: Fetch sender and receiver warehouses
  const senderWarehouse = await Warehouse.findById(sender_warehouse);
  const receiverWarehouse = await Warehouse.findById(receiver_warehouse);

  if (!senderWarehouse || !receiverWarehouse) {
    return next(
      new ErrorHandler("Sender or receiver warehouse not found.", 404)
    );
  }

  // console.log(senderWarehouse, receiverWarehouse);

  // Step 3: Fetch managers for sender and receiver warehouses
  const senderManager = await User.findById(senderWarehouse.manager_id);
  const receiverManager = await User.findById(receiverWarehouse.manager_id);

  if (!senderManager || !receiverManager) {
    return next(
      new ErrorHandler("Sender or receiver warehouse manager not found.", 404)
    );
  }

  // console.log(senderManager, receiverManager);

  // Step 4: Validate inventories
  for (const item of inventories) {
    const inventoryData = await Inventory.findById(item.inventory);

    console.log(item);

    if (!inventoryData) {
      return next(
        new ErrorHandler(`Inventory with ID ${item.inventory} not found.`, 404)
      );
    }

    if (inventoryData.quantity < item.quantity) {
      return next(
        new ErrorHandler(
          `Insufficient quantity for inventory ID ${item.inventory}. Available: ${inventoryData.quantity}, Requested: ${item.inventory}.`,
          400
        )
      );
    }

    // Deduct quantity from sender inventory
    inventoryData.quantity -= item.quantity;
    await inventoryData.save();
  }

  // Step 5: Generate PDF documents
  const exportCTO =
    req.body.exportCTO || uuidv4() + "-" + senderWarehouse.location.zip;
  const importerCTO =
    req.body.importerCTO || uuidv4() + "-" + receiverWarehouse.location.zip;
  const transferIdFinal = transferId || uuidv4();

  const exportPDFPath = await generateWarehousePDF(
    req,
    exportCTO,
    importerCTO,
    senderWarehouse,
    receiverWarehouse
  );

  const productPDFPath = await generateWarehouseProductListPDF(
    req,
    inventories
  );

  // Step 6: Create transfer inventory record
  const transferInventory = await WarehouseTransfer.create({
    sender_warehouse,
    receiver_warehouse,
    inventories,
    transfer_id: transferIdFinal,
    status: "Pending", // Initial status
    exportPDFPath,
    productPDFPath,
  });

  // Step 7: Notify sender and receiver managers via email
  const senderMessage = `Dear ${senderManager.name},\n\nAn inventory transfer (ID: ${transferIdFinal}) has been created.\nPlease find the attached invoice.\n\nThank you.`;
  const receiverMessage = `Dear ${receiverManager.name},\n\nYou are receiving an inventory transfer (ID: ${transferIdFinal}).\nPlease find the attached invoice.\n\nThank you.`;

  try {
    await sendGmail({
      from: process.env.GMAIL,
      to: senderManager.email,
      subject: "Warehouse Transfer Order Details",
      text: senderMessage,
      attachments: [
        { filename: "Transfer_Order.pdf", path: exportPDFPath },
        { filename: "Product_List.pdf", path: productPDFPath },
      ],
    });

    await sendGmail({
      from: process.env.GMAIL,
      to: receiverManager.email,
      subject: "Warehouse Transfer Order Details",
      text: receiverMessage,
      attachments: [
        { filename: "Transfer_Order.pdf", path: exportPDFPath },
        { filename: "Product_List.pdf", path: productPDFPath },
      ],
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to send emails. Error: ${error.message}`, 500)
    );
  }

  res.status(201).json({
    success: true,
    message: "Transfer inventory created, and emails sent successfully.",
    transferInventory,
  });
});

// Mark transfer as completed and update inventory
const completeTransfer = catchAsyncErrors(async (req, res, next) => {
  const { transfer_id } = req.body;
  const { transfer } = req; // Comes from the middleware

  try {
    // Deduct inventory from sender warehouse
    const senderWarehouse = await Warehouse.findById(transfer.sender_warehouse);
    const receiverWarehouse = await Warehouse.findById(
      transfer.receiver_warehouse
    );

    if (!senderWarehouse || !receiverWarehouse) {
      return res
        .status(404)
        .json({ message: "Sender or receiver warehouse not found." });
    }

    transfer.products.forEach(({ product, quantity }) => {
      // Deduct from sender warehouse
      const senderInventory = senderWarehouse.inventory.find(
        (item) => item.product.toString() === product._id.toString()
      );
      if (senderInventory) {
        senderInventory.quantity -= quantity;
        if (senderInventory.quantity < 0) {
          return next(
            new ErrorHandler(
              `Insufficient inventory for product ${product.name} in sender warehouse.`,
              500
            )
          );
        }
      }

      // Add to receiver warehouse
      const receiverInventory = receiverWarehouse.inventory.find(
        (item) => item.product.toString() === product._id.toString()
      );
      if (receiverInventory) {
        receiverInventory.quantity += quantity;
      } else {
        receiverWarehouse.inventory.push({ product: product._id, quantity });
      }
    });

    // Save both warehouses
    await senderWarehouse.save();
    await receiverWarehouse.save();

    // Update transfer status to "Completed"
    transfer.status = "Completed";
    await transfer.save();

    return res.status(200).json({
      message: "Transfer completed successfully.",
      transfer,
      senderWarehouse,
      receiverWarehouse,
    });
  } catch (error) {
    return next(
      new ErrorHandler("Error completing transfer.", error.message, 500)
    );
  }
});

// Fetch pending transfers for dashboard
const getPendingTransfers = catchAsyncErrors(async (req, res) => {
  try {
    const transfers = await WarehouseTransfer.find({
      status: "Pending",
    }).populate("products.product");
    return res.status(200).json({ transfers });
  } catch (error) {
    return next(new ErrorHandler(`Error fetching transfers.`, 500));
  }
});

// Fetch completed transfers for dashboard
const getCompletedTransfers = catchAsyncErrors(async (req, res) => {
  try {
    const transfers = await WarehouseTransfer.find({
      status: "Completed",
    }).populate("products.product");
    return res.status(200).json({ transfers });
  } catch (error) {
    return next(new ErrorHandler(`Error fetching transfers.`, 500));
  }
});

const receiveInventory = catchAsyncErrors(async (req, res, next) => {
  const { warehouseId, products } = req.body; // Products contain productId and quantity

  try {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return next(new ErrorHandler("Warehouse not found", 404));
    }

    products.forEach(({ productId, quantity }) => {
      const existingProduct = warehouse.inventory.find(
        (item) => item.product.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        warehouse.inventory.push({ product: productId, quantity });
      }
    });

    await warehouse.save();
    res.status(200).json({ success: true, warehouse });
  } catch (error) {
    return next(new ErrorHandler("Error receiving inventory.", 500));
  }
});

const transferInventory = catchAsyncErrors(async (req, res, next) => {
  const { senderWarehouseId, receiverWarehouseId, products } = req.body;

  try {
    const senderWarehouse = await Warehouse.findById(senderWarehouseId);
    const receiverWarehouse = await Warehouse.findById(receiverWarehouseId);

    if (!senderWarehouse || !receiverWarehouse) {
      return next(
        new ErrorHandler("Sender or Receiver Warehouse not found", 404)
      );
    }

    // Deduct from sender warehouse
    products.forEach(({ productId, quantity }) => {
      const senderProduct = senderWarehouse.inventory.find(
        (item) => item.product.toString() === productId
      );
      if (!senderProduct || senderProduct.quantity < quantity) {
        throw new ErrorHandler(
          `Insufficient inventory for product ${productId}`,
          400
        );
      }
      senderProduct.quantity -= quantity;
    });

    // Add to receiver warehouse
    products.forEach(({ productId, quantity }) => {
      const receiverProduct = receiverWarehouse.inventory.find(
        (item) => item.product.toString() === productId
      );
      if (receiverProduct) {
        receiverProduct.quantity += quantity;
      } else {
        receiverWarehouse.inventory.push({ product: productId, quantity });
      }
    });

    await senderWarehouse.save();
    await receiverWarehouse.save();

    res.status(200).json({ success: true, message: "Transfer successful" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  completeTransfer,
  getPendingTransfers,
  getCompletedTransfers,
  receiveInventory,
  transferInventory,
  createTransferInventory,
  createWarehouseWithoutManager,
};
