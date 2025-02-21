const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const upload = require("../middleware/multer");

const {
  getUser,
  getUsers,
  signup,
  login,
  uploadImage,
  getMe,
} = require("../controllers/mobileContoller");

router.post("/uploadImage", upload, uploadImage);
router.post("/register", signup);
router.post("/login", login);
router.get("/getUser", protect, getUser);
router.get("/getAllUser",  getUsers);
router.get("/getMe", protect, getMe);

module.exports = router;
