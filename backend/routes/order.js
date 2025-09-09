const express = require("express")
const router = express.Router()

// const {
//   newOrder,
//   getSingleOrder,
//   myOrders,
//   allOrders,
//   updateOrder,
//   deleteOrder,
// } = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")
const {
  submitOrderRequest,
  ordersBySellerId,
  orderRequestsBySellerId,
  myOrderRequests,
  getOrderRequestsByQr,
  eCommerceOrderApprovalBySeller,
} = require("../controllers/order/productOrderController")

// router.route("/order/new").post(isAuthenticatedUser, newOrder);

// router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
// router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// router
//   .route("/admin/orders/")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
// router
//   .route("/admin/order/:id")
//   .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

router
  .route("/submit-order-request")
  .post(isAuthenticatedUser, submitOrderRequest)

router.route("/buyer-orders-requests").get(isAuthenticatedUser, myOrderRequests)
router
  .route("/seller-order-requests")
  .get(isAuthenticatedUser, orderRequestsBySellerId)
router
  .route("/seller-order-request-details")
  .get(isAuthenticatedUser, getOrderRequestsByQr)

router
  .route("/ecommerce-order-request-approval")
  .post(isAuthenticatedUser, eCommerceOrderApprovalBySeller)

module.exports = router
