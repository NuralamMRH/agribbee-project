const languages = require("../../config/languages");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Seller, Warehouse, Inventory, Product } = require("../../models");
const APIFeatures = require("../../utils/apiFeatures");
const ErrorHandler = require("../../utils/errorHandler");
const { translateNestedContent } = require("../../utils/translatedContent");

exports.createInventory = catchAsyncErrors(async (req, res, next) => {
  try {
    // Step 1: Fetch seller data based on user ID
    const seller = await Seller.findOne({ user_id: req.user.id });
    if (!seller) {
      return next(new ErrorHandler("Seller not found for this user.", 404));
    }

    // Step 2: Check if the product exists
    const productData = await Product.findById(req.body.product);
    if (!productData) {
      return next(new ErrorHandler("Product not found.", 404));
    }

    console.log(productData);

    // Step 3: Find all inventories for this product across all warehouses
    const productInventories = await Inventory.find({
      product: req.body.product,
    });

    // Calculate the total quantity of this product across all inventories
    const totalInventoryQuantity = productInventories.reduce(
      (acc, inventory) => acc + inventory.quantity,
      0
    );

    console.log(
      "totalInventoryQuantity:",
      totalInventoryQuantity +
        " in inventories, Product Left Quantity:" +
        productData.left_quantity +
        " Product Quantity:" +
        productData.quantity
    );

    // Step 4: Validate inventory limits
    if (
      (productData.left_quantity &&
        totalInventoryQuantity >= productData.left_quantity) ||
      totalInventoryQuantity >= productData.quantity
    ) {
      return next(
        new ErrorHandler(
          "Inventory limit exceeded for this product. Please remove some items from inventory first.",
          400
        )
      );
    }

    // Step 5: Check if inventory already exists for the given product in this warehouse
    const existingInventory = await Inventory.findOne({
      warehouse_id: req.body.warehouse_id,
      product: req.body.product,
    });

    if (existingInventory) {
      // Update the existing inventory's quantity
      const newQuantity = existingInventory.quantity + req.body.quantity;

      if (newQuantity >= productData.left_quantity) {
        return next(
          new ErrorHandler(
            "Updated inventory quantity exceeds the product's allowed limit.",
            400
          )
        );
      }

      existingInventory.quantity = newQuantity;
      await existingInventory.save();

      return res.status(200).json({
        success: true,
        message: "Inventory updated successfully.",
        inventory: existingInventory,
      });
    }

    // Step 6: Create new inventory if no existing record found
    const inventoryData = {
      warehouse_id: req.body.warehouse_id,
      product: req.body.product,
      quantity: req.body.quantity,
    };

    const newInventory = new Inventory(inventoryData);
    await newInventory.save();

    return res.status(201).json({
      success: true,
      message: "Inventory created successfully.",
      inventory: newInventory,
    });
  } catch (error) {
    console.error("Error creating inventory:", error);
    return next(
      new ErrorHandler(
        `Error creating or updating inventory: ${error.message}`,
        500
      )
    );
  }
});

exports.updateInventory = catchAsyncErrors(async (req, res, next) => {
  try {
    let getInventory = await Inventory.findById(req.params.id);
    if (!getInventory) {
      return next(new ErrorHandler("Inventory not found", 404));
    }

    // Create new kioskData package
    const inventoryData = {
      ...req.body,
    };
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      inventoryData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(201).json({
      success: true,
      inventory: updatedInventory,
    });
  } catch (error) {
    // console.error("ErrorHandler:", error.message);
    return next(
      new ErrorHandler(`Error update  Inventory: ${error.message}`, 500)
    );
  }
});

exports.getInventories = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get language from headers or default to 'vi'
    const language = req.headers["x-localization"] || "vi";

    // Fetch filtered markets and apply search, filter, and pagination
    const inventoriesQuery = new APIFeatures(Inventory.find().lean(), req.query)
      .search()
      .filter();

    let inventories;

    // Fetch countries
    if (req?.query?.latest === "true") {
      inventories = await inventoriesQuery.query.sort({ created_at: -1 });
    } else if (req?.query?.latest === "false") {
      inventories = await inventoriesQuery.query;
    } else {
      inventories = await inventoriesQuery.query.sort({ created_at: -1 });
    }

    const paginatedResponse = new APIFeatures(
      inventories,
      req?.query
    ).pagination();
    const paginatedInventories = paginatedResponse.query;

    const response = await translateNestedContent(
      language,
      paginatedInventories
    );

    return res.status(200).json(response);
  } catch (error) {
    return next(
      new ErrorHandler(`Inventories not found: ${error.message}`, 500)
    );
  }
});

// Get single Inventory details    =>   /api/v1/inventory/:id
exports.getInventoryById = catchAsyncErrors(async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate("product")
      .populate("warehouse_id")
      .lean(); // Convert Mongoose documents to plain objects

    if (!inventory) {
      return next(new ErrorHandler("Inventory not found", 404));
    }

    const language = req.headers["x-localization"] || "vi";

    // Perform translation on the plain JavaScript object
    const response = await translateNestedContent(language, inventory);

    // console.log(response._id);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in getInventoryById:", error);
    return next(new ErrorHandler(`Inventory not found: ${error.message}`, 500));
  }
});

// Delete Inventory   =>   /api/v1/seller/inventory/:id
exports.deleteInventory = catchAsyncErrors(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  await inventory.remove();

  res.status(200).json({
    success: true,
    message: "Inventory is deleted.",
  });
});
