const express = require("express");
const router = express.Router();
const {
  newCart,
  deleteCart,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
  guestCarts,
} = require("../controllers/products/cartController");

router.route("/customer/cart/list").get(guestCarts);
router.route("/customer/cart/add").post(newCart);
router.post("/customer/cart/update", updateCartItem);
router.delete("/customer/cart/remove-item", deleteCartItem);
router.delete("/customer/cart/remove", deleteAllCartItems);

module.exports = router;
