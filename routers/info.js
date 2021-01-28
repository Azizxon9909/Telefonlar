const express = require("express");
const DbProduct = require("../model/Product");
const DbUser = require("../model/User");
const router = express.Router();
router.get("/product/:id", (req, res) => {
  const phones = DbProduct.findById(req.params.id);
  phones
    .then((data) => {
      data.like += 1;
      data.save();
      DbUser.findById(data.author, (err, user) => {
        res.render("info", {
          title: "Info sahifasi",
          datas: data,
          info: user,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
