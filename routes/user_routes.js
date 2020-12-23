const express = require("express");
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  deleteMe,
  updateMe
} = require("../controllers/userController");
const { login, forgotPassword, protect, resetPassword, restrictTo, signup, updatePassword } = require('../controllers/auth_controller');

const router = express.Router();
router.route("/").get(getAllUsers).post(createUser);
router.post('/login', login);
router.post('/signup', signup);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch(
  '/updateMyPassword',
  protect,
  updatePassword
);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);



router.route("/:id").get(getUser).patch(protect, updateUser).delete(protect, deleteUser);

module.exports = router;
