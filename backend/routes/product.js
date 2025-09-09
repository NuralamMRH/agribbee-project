const express = require("express")
const router = express.Router()

// const {
//   getProducts,
//   getAdminProducts,
//   newProduct,
//   getSingleProduct,
//   updateProduct,
//   deleteProduct,
//   createProductReview,
//   getProductReviews,
//   deleteReview,
// } = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

const {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  getMyProducts,
  getSellerIdProducts,
} = require("../controllers/products/productController")
const upload = require("../config/multerConfig")
const { globalSearch } = require("../controllers/globalSearch")

// router.route("/products").get(getProducts);
// router.route("/admin/products").get(getAdminProducts);
// router.route("/product/:id").get(getSingleProduct);

// router
//   .route("/admin/product/new")
//   .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

// router
//   .route("/seller/product/new")
//   .post(isAuthenticatedUser, authorizeRoles("seller"), newProduct);

// router
//   .route("/admin/product/:id")
//   .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// router.route("/review").put(isAuthenticatedUser, createProductReview);
// router.route("/reviews").get(isAuthenticatedUser, getProductReviews);
// router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

router
  .route("/seller/create/product")
  .post(
    upload.fields([{ name: "image" }, { name: "images" }]),
    isAuthenticatedUser,
    authorizeRoles("seller"),
    createProduct
  )

router
  .route("/seller/update/product/:id")
  .put(
    upload.fields([{ name: "image" }, { name: "images" }]),
    isAuthenticatedUser,
    authorizeRoles("seller"),
    updateProduct
  )

router.route("/products").get(getProducts)

router.route("/products/:id").get(getProductById)
router.route("/sourcers-products/:id").get(getSellerIdProducts)

router.route("/search").get(globalSearch)

router
  .route("/me/products")
  .get(isAuthenticatedUser, authorizeRoles("seller"), getMyProducts)

module.exports = router
