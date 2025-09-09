const express = require("express");
const { deleteFile } = require("../controllers/configController");
const { uploadFile } = require("../controllers/globalUploadDelete");
const { isAuthenticatedUser } = require("../middlewares/auth");
const upload = require("../config/multerConfig");
const router = express.Router();

router.delete("/delete-file", deleteFile);
router
  .route("/upload-file")
  .post(
    upload.fields([{ name: "file" }, { name: "files" }]),
    isAuthenticatedUser,
    uploadFile
  );

module.exports = router;
