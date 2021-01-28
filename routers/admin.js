const express = require("express");
const DbProduct = require("../model/Product");
const router = express.Router();
const multer = require("multer");
const path = require("path");

router.get("/admin", (req, res) => {
  const phones = DbProduct.find({});
  phones
    .then((data) => {
      res.render("admin", {
        title: "Sozlamalar",
        datas: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

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

router.get("/update/:id", (req, res) => {
  const phones = DbProduct.findById(req.params.id);
  phones
    .then((data) => {
      res.render("add", {
        title: "Sozlamalar",
        datas: data,
        type: "update",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update/:id", uploads, (req, res) => {
  const db = DbProduct.findByIdAndUpdate(req.params.id, {
    title: req.body.title.toLowerCase(),
    price: req.body.price,
    sale: req.body.sale,
    memory: req.body.memory,
    comment: req.body.comment,
    photo: req.file.path,
    color: req.body.color,
  });
  db.then(() => {
    res.redirect("/admin");
  }).catch((err) => {
    console.log(err);
  });
});

router.get("/delete/:id", (req, res) => {
    const phones = DbProduct.findByIdAndRemove(req.params.id);
    phones
      .then((data) => {
        res.redirect('/admin')
      })
      .catch((err) => {
        console.log(err);
      });
  });

router.get("/admin/search", (req, res) => {
  let { search } = req.query;
  let search1 = search.toLocaleLowerCase();
  const phones = DbProduct.find({ title: { $regex: search1 } });
  phones
    .then((data) => {
      res.render("admin", {
        title: "Admin sahifasi",
        datas: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
