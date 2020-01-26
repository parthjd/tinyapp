//  ******* Variable declaration and require ******
const {
  emailLookUp
} = require("./helper")

const {
  urlsForUser
} = require("./helper")

const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
const PORT = 8080;
const session = require("cookie-session")
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//  *** Database object ***

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID"
  }
};

// *** Global users object ***

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "a@a.com",
    password: bcrypt.hashSync("123", 10)
  }
};

//  *** urls homepage and redirection for shortURL***

app.get("/urls", (req, res) => {
  if (!users[req.session.id]) {
    res.redirect("/login")
    return
  }
  let obj1 = {};
  const loginID = req.session.id
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === loginID) {
      obj1[i] = urlDatabase[i]
    }
  }
  let templateVars = {
    urls: obj1,
    username: users[req.session["id"]].email
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL
  if (!longURL.startsWith("http://")) {
    longURL = `http://${longURL}`
  }
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: req.session.id
  };
  res.redirect("/urls/" + shortURL);
});


//  *** urls  create a new url ***

app.get("/urls/new", (req, res) => {
  if (!users[req.session.id]) {
    res.redirect("/login")
    return
  }
  let templateVars = {
    username: users[req.session["id"]].email
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: users[req.session.id].email
  }
  let individualURL = urlsForUser(req.session.id, urlDatabase)
  if (individualURL[req.params.shortURL]) {
    res.render("urls_show", templateVars);
    return
  } else {
    res.status(400).send("Please login to continue");
  }
});

// *** delete  URL ***

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// *** Update URL ***

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

// *** Login & Logout ***

app.get("/login", (req, res) => {
  let templateVars = {
    username: users[req.session.id]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  const password = req.body.password;
  for (let key in users) {
    if (users[key].email === email && bcrypt.compareSync(password, users[key].password)) {
      req.session.id = key;
      res.redirect("/urls");
      return
    }
  }
  res.status(400);
  res.send("Login failed");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// *** Registration *** 

app.get("/register", (req, res) => {
  let templateVars = {
    username: users[req.session.id],

  };
  res.render("urls_registration", templateVars);
});
//  check if  email exists .. give error if true

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.status(404);
    res.send("Email and Password cannot be blank");
  } else if (emailLookUp(email, users)) {
    res.status(400).send("Email already exists. Please login!!");
  } else {
    users[userID] = {
      id: userID,
      email: email,
      password: bcrypt.hashSync(password, 10)
    };
    console.log(users)
    req.session.id = userID;
    res.redirect("/urls");

  }
});

//  ***function to generate random string***

function generateRandomString() {
  let randomString = Math.random()
    .toString(36)
    .substring(2, 8);
  return randomString;
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});