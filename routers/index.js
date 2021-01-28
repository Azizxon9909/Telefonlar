const express = require("express");
const DbProduct = require("../model/Product");
const router = express.Router();

router.get("/", (req, res) => {

  let pagesize = 5;
  if (req.query.page != null) {
    var page = req.query.page;
  }
  const phones = DbProduct.find({})
    .skip((page - 1) * pagesize)
    .limit(pagesize)
    .sort({dateNow: -1});
  phones
    .then((data) =>
      DbProduct.count((err, match) => {
        res.render("index", {
          title: "Bosh sahifasi",
          datas: data,
          pages: Math.ceil(match / pagesize),
        });
      })
    )
    .catch((err) => {
      console.log(err);
    });
});

router.get("/search", (req, res) => {
  let { search } = req.query;
  let search1 = search.toLocaleLowerCase();
  const phones = DbProduct.find({ title: { $regex: search1 } });
  phones
    .then((data) => {
      res.render("index", {
        title: "Bosh sahifasi",
        datas: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
