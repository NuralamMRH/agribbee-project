const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { Cart, Product } = require("../../models");
const ErrorHandler = require("../../utils/errorHandler");

// Create a new cart   =>  /api/v1/cart/new
exports.newCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.create({
    ...req.body,
  });

  res.status(200).json({
    success: true,
    cart,
  });
});

// Get single cart   =>   /api/v1/cart/:id
exports.getSingleCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!cart) {
    return next(new ErrorHandler("No Cart found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// Get logged in user carts   =>   /api/v1/carts/me
exports.myCarts = catchAsyncErrors(async (req, res, next) => {
  const carts = await Cart.find({ user_id: req.user.id });

  res.status(200).json({
    success: true,
    carts,
  });
});

exports.guestCarts = catchAsyncErrors(async (req, res, next) => {
  const { guest_id } = req.query;
  const carts = await Cart.find({ guest_id });

  if (!carts) {
    return next(new ErrorHandler("No Carts items found", 404));
  }

  res.status(200).json(carts);
});

// Get all carts - ADMIN  =>   /api/v1/admin/carts/
exports.allCarts = catchAsyncErrors(async (req, res, next) => {
  const carts = await Cart.find();

  res.status(200).json({
    success: true,
    carts,
  });
});

// Update / Process cart - ADMIN  =>   /api/v1/admin/cart/:id
exports.updateCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);

  cart.cartItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  (cart.price = req.body.price), (cart.updateAt = Date.now());

  await cart.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

// Delete cart   =>   /api/v1/admin/cart/:id
exports.deleteCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return next(new ErrorHandler("No Cart found with this ID", 404));
  }

  await cart.remove();

  res.status(200).json({
    success: true,
  });
});

// Update/Add Cart Item
exports.updateCartItem = catchAsyncErrors(async (req, res, next) => {
  const { guest_id, user_id, item_id, quantity, variation, is_guest } =
    req.body;

  // Check if the cart item already exists
  const existingCartItem = await Cart.findOne({
    $or: [
      { guest_id, item_id },
      { user_id, item_id },
    ],
  });

  if (existingCartItem) {
    // If item exists, update the quantity and variations
    existingCartItem.quantity = quantity || existingCartItem.quantity;
    existingCartItem.variation = variation || existingCartItem.variation;
    await existingCartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cartItem: existingCartItem,
    });
  }

  // If item does not exist, create a new cart item
  const newCartItem = await Cart.create({
    guest_id,
    user_id,
    item_id,
    quantity,
    variation,
    is_guest,
  });

  return res.status(201).json({
    success: true,
    message: "Cart item added successfully",
    cartItem: newCartItem,
  });
});

// Delete Cart Item
exports.deleteCartItem = catchAsyncErrors(async (req, res, next) => {
  const { guest_id, cart_id } = req.query;

  // Find and delete the item, optionally filtering by guest_id
  const filter = { _id: cart_id };
  if (guest_id) {
    filter.guest_id = guest_id;
  }

  const deletedCartItem = await Cart.findOneAndDelete(filter);

  if (!deletedCartItem) {
    return next(new ErrorHandler("Cart item not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Cart item removed successfully",
  });
});

// Delete all Cart Items for a Guest
exports.deleteAllCartItems = catchAsyncErrors(async (req, res, next) => {
  const { guest_id } = req.query;

  if (guest_id) {
    // Delete all items for the specified guest_id
    await Cart.deleteMany({ guest_id });

    return res.status(200).json({
      success: true,
      message: "All cart items for guest deleted successfully",
    });
  }

  return next(
    new ErrorHandler("Guest ID is required to delete cart items", 400)
  );
});
