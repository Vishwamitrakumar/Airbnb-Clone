const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
     res.render("users/signup.ejs");
}

module.exports.Signup = async (req, res) => {

     try {
          let { username, email, password } = req.body;
          const newUser = new User({ email, username });
          const registerUser = await User.register(newUser, password);
          console.log(registerUser);
          req.login(registerUser, (err) => {
               if (err) {
                    return next(err);
               }
               req.flash("success", " Welcome to Wanderlust!");
               res.redirect("/listings");
          });
     }

     catch (e) {
          req.flash("error", "A user Already exist!");
          res.redirect("/signup");
     }
}

module.exports.renderLoginForm = (req, res) => {
     res.render("users/login.ejs");
}

module.exports.login = async function (req, res) {
     req.flash("success", " Welcome to Wanderlust!");
   
      let redirectUrl =  res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
     req.logout((err) => {
          if (err) {
               return next(err);
          }
          req.flash("success", " You are logout out!");
          res.redirect("/listings");
     })
}