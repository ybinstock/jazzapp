

var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  flash = require("connect-flash"), // for flash messages
  app = express(),
  request = require("request"),
  db = require("./models/index"),
  methodOverride = require('method-override'); //override the put and delete method

  //session: username, password on server

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public')); // access public folder for images and css

// yelp query
  var yelp = require("yelp").createClient({
    consumer_key: "wDLVVvgkswY90UiN6-jwYQ",
    consumer_secret: "KR_-iy69uIOKM5knKrfTW4C4ONc",
    token: "TMnWq0StFkM42WA4ve66NASj6v1w0Hkk",
    token_secret: "gb-td91ovqtkRfY_KyCKv9x3UHs"
  });

app.get('/search', function(req, res) {

var queryLocation = req.query.locationsearch || "94133";

yelp.search({term: "Jazz & Blues", location: queryLocation,}, function(error, data) {
  if(error){
    console.log("THERE IS AN ERROR!");
    console.log(error);}
  res.render('results', {businesses: data.businesses || [],
  isAuthenticated: req.isAuthenticated(),
  user: req.user,
  message: ""
  });
});
});


// sign up new users
app.post('/signup', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  db.user.createNewUser(username, password, function(err){
    console.log(err);
  },
  function(success){
    res.render("login", {message: success.message});
  }
);
});

//homepage
app.get('/homepage', function(req,res){
  res.render("homepage", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user,
  message: ""
  });
});


//favorites page
app.get('/results', function(req, res){
  res.render("favorites", {
    isAuthenticated: req.isAuthenticated()
  });
  });

app.get('/favorites', function(req, res){
  db.favorites.findAll().success(function(favorites){
    res.render('favorites', {listOfFavorites: favorites});
  });
});

//delete in the favorites
app.delete('/delete/:id', function(req,res){
  console.log(req.params.id);
  db.favorites.destroy({id: req.params.id}).success(function(){
    res.redirect("/favorites");
  });
});






//Authentication
// cookie session set up
app.use(cookieSession({
  secret: 'thisisthesecretkeyshouldberandomstring',
  name: 'cookie created by me',
  // maxage is in milliseconds
  maxage: 360000 //security reasons
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // flash messages up and running

// prepare our serialize - this runs when we log in
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){
      done(error, user);
    });
});

//add to favorites
app.post('/favorites', function(req, res) {
  console.log("posting to favorites. req.body:", req.body);
  console.log("current user:", req.user);
        db.favorites.create({
         title: req.body.business,
         // userId: req.user.id,
         image: req.body.image
    }).error(function(err) {
        res.redirect("homepage");
      }).success(function(id) {
    res.redirect("/favorites");
        });
  });

app.get('/', function(req, res){
  res.render('login', {username: ""});
});

// sign up
app.get('/signup', function(req,res){
  if(!req.user) {
    res.render("signup", { username: ""});
  }
  else{
    res.redirect('homepage');
  }
});

// login view
app.get('/login', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("login", {message: req.flash('loginMessage'), username: ""});
  }
  else{
    res.render('homepage', {message: ""});
  }
});

// login home page
app.get('/home', function(req,res){
  res.render("home", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});


// on submit, create a new users using form values
app.post('/submit', function(req,res){

  db.user.createNewUser(req.body.username, req.body.password,
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  },
  function(success){
    res.render("login", {message: success.message});
  });
});

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: 'homepage',
  failureRedirect: 'login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});

// 404s * is any route not pre-sepcified - any non-addressed routes will go here
// app.get("*", function(req, res) { // must be at bottom, cascading get pages
// res.render("404");
// });

//environment variable, to tell to which port Heroku is going to listen to
app.listen(process.env.PORT || 3000, function(){
  console.log('SERVER IS STARTING UP');
});