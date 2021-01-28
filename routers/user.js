const express = require("express");
const DbUser = require("../model/User");
const bcryptjs = require("bcryptjs");
const passport = require("../md/passport")
const passport1 = require('passport')

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Ro'yxatdan o'tish",
  });
});

router.post("/register", (req, res) => {
  req.checkBody("name", "Ismingizni kiriting").notEmpty();
  req.checkBody("tel", "Telefon raqamingizni kiriting").notEmpty();
  req.checkBody("email", "email kiriting").notEmpty();
  req.checkBody("username", "username kiriting").notEmpty();
  req.checkBody("password", "password kiriting").notEmpty();
  req.checkBody("confirm", "password qayta kiriting").equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      title: "Xatolik bor",
      errors: errors,
    });
  } else {
    const db = new DbUser({
      name: req.body.name,
      tel: req.body.tel,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    bcryptjs.genSalt(10, (err, pass) => {
      bcryptjs.hash(db.password, pass, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          db.password = hash;
          db.save()
            .then(() => {
              // req.flash('success', 'Mahsulot yuklandi!')
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    });
  }
});
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Kirish",
  });
});
router.post("/login", (req, res, next) => {
  passport1.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Login yoki Parol noto'g'ri kiritilgan!" 
    // successFlash: "Ulandik",
  })(req, res, next);
});
router.get('/logout', (req,res)=>{
  req.logout()
  res.redirect('/')
})

module.exports = router;
