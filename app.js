const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const rIndex = require("./routers/index");
const rAdd = require("./routers/add");
const rInfo = require("./routers/info");
const rAdmin = require("./routers/admin");
const rUserSettings = require("./routers/userSettings");
const rUser = require("./routers/user");
const config = require('./config');
const expressValidator = require("express-validator");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));

// Setting express validator

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split(".");
      root = namespace.shift();
      formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Setting mongoose
mongoose
  .connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDBga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.error("MongoDBga ulanish vaqtida xato ro'y berdi...", err);
  });

// Body Parser setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/// setting pug

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname)));

/// AUTH
require("./md/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
const def = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "iltimos login qiling");
    res.redirect("/login");
  }
};
app.use(rIndex);
app.use(rInfo);
app.use(rUser);
app.use(def);
app.use(rAdd);
app.use(rUserSettings);
app.use(rAdmin);
let port = process.env.PORT || '3000';
app.listen(port, () => {
  console.log(`server http://localhost:${port}/ portda ishladi`);
});
