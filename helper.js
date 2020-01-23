const emailLookUp = (email, users) => {
  for (let key in users) {
    if (users[key].email === email) {
      return true;
    }
  }
  return false;
};

const urlsForUser = (id, urlDatabase) => {
  let filterDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filterDatabase[key] = urlDatabase[key]
    }
  }
  return filterDatabase;
}
const getUserByEmail = (email, users) => {
  for (let key in users) {
    if (users[key].email === email) {
      return key
    }
  }
}

module.exports = {
  emailLookUp,
  urlsForUser,
  getUserByEmail
}