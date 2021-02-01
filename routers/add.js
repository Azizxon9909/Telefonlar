const express = require("express");
const DbProduct = require("../model/Product");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({
  storage,
  limits: { fieldSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (extname !== ".jpg" && extname !== ".jpeg" && extname !== ".png") {
      const err = new Error("xatolik bor");
      err.code = 404;
      return cb(err);
    }
    cb(null, true);
  },
  preservePath: true,
}).single("photo");

router.get("/add", (req, res) => {
  res.render("add", {
    title: "Maxsulot qoshish sahifasi",
    type: "add",
  });
});

router.post("/add", uploads, (req, res) => {
  req.checkBody("title", "Maxsulotning nomini kamida 3ta belgidan iborat bo'lishi kerak").notEmpty().isLength({ min: 3 });
  req.checkBody("price", "Maxsulotning narxini kiriting").notEmpty()
  req.checkBody("memory", "Maxsulotning hotirasini kiriting").notEmpty()
  req.checkBody("comment", "Maxsulotning haqida kamida 10ta bo'lishi kerak").notEmpty().isLength({ min: 10 });
  req.checkBody("color", "Maxsulotning rangini kiriting").notEmpty();
  req.checkBody("photo", "Maxsulotning suratini kiriting")

  const errors = req.validationErrors();
  if (errors) {
    res.render("add", {
      title: "Xatolik bor",
      errors: errors,
    });
  } else {
    const db = new DbProduct({
      title: req.body.title.toLowerCase(),
      price: req.body.price,
      sale: req.body.sale,
      memory: req.body.memory,
      comment: req.body.comment,
      photo: req.file.path,
      color: req.body.color,
      author: req.user._id
    });
    db.save()
      .then(() => {
        // req.flash('success', 'Mahsulot yuklandi!')
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
