const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteUserController,
  createAdminController,
  getAdminListController,
} = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || DONOR LIST
router.get(
  "/donor-list",
  authMiddleware,
  adminMiddleware,
  getDonorsListController
);
//GET || HOSPITAL LIST
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);
//GET || ORG LIST
router.get("/org-list", authMiddleware, adminMiddleware, getOrgListController);

//GET || ADMIN LIST
router.get("/admin-list", authMiddleware, adminMiddleware, getAdminListController);

// ==========================

// CREATE ADMIN || POST (Only admins can create other admins)
router.post(
  "/create-admin",
  authMiddleware,
  adminMiddleware,
  createAdminController
);

// DELETE USER || DELETE
router.delete(
  "/delete-user/:id",
  authMiddleware,
  adminMiddleware,
  deleteUserController
);

//EXPORT
module.exports = router;
