const express = require("express");
const {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  getCategoriesWithProducts,
  getCategoriesWithSellers,
} = require("../controllers/products/categoryController");
const upload = require("../config/multerConfig");
const router = express.Router();

router
  .route("/admin/new-category")
  .post(
    upload.fields([
      { name: "image" },
      { name: "banner" },
      { name: "icon" },
      { name: "meta_image" },
    ]),
    createCategory
  );

router
  .route("/admin/category/:id")
  .put(
    upload.fields([
      { name: "image" },
      { name: "banner" },
      { name: "icon" },
      { name: "meta_image" },
    ]),
    updateCategory
  );

router.route("/categories").get(getCategories);
router.route("/categories/:id").get(getCategoryById);
router.route("/categories/products/:id").get(getCategoriesWithProducts);
router.route("/categories/sellers/:id").get(getCategoriesWithSellers);

module.exports = router;
