const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hash(Password) {
  return bcrypt.hash(Password, 10);
}

function compare(Password, hashedPassword) {
  return bcrypt.compare(Password, hashedPassword);
}

// This function handles the user sign-up request.
// It receives the request and response objects as parameters.
//
// First, it extracts the user's full name, email, and password from the request body.
// If any of these fields is missing, it returns a 400 (Bad Request) status code with an error message.
//
// Next, it checks if a user with the same email already exists in the database.
// If a user with the same email is found, it returns a 400 (Bad Request) status code with an error message.
//
// After that, it hashes the user's password using bcrypt.
// This is a secure way to store passwords.
//
// Then, it creates a new user document in the database with the user's full name, email, and hashed password.
// If the user document is successfully created, it returns a 200 (OK) status code with a success message and the user object.
//
// If any error occurs during the process, it returns a 500 (Internal Server Error) status code with an error message.
async function userSignup(req, res) {
  try {
    // Extract the user's full name, email, and password from the request body
    const { fullName, userEmail, userPassword } = req.body;

    // If any of these fields is missing, return a 400 (Bad Request) status code with an error message
    if (!fullName || !userEmail || !userPassword) {
      return res.json({ error: "All fields are required" });
    }

    // Check if a user with the same email already exists in the database
    const userExist = await User.findOne({ email: userEmail });

    // If a user with the same email is found, return a 400 (Bad Request) status code with an error message
    if (userExist) {
      return res.json({ error: "User already Exist" });
    }

    // Hash the user's password using bcrypt
    const hashedUserPassword = await hash(userPassword);

    // Create a new user document in the database with the user's full name, email, and hashed password
    const user = await User.create({
      fullname: fullName,
      email: userEmail,
      password: hashedUserPassword,
    });

    // If the user document is successfully created, return a 200 (OK) status code with a success message and the user object
    if (!user) {
      return res.status(400).json({ error: "Something went wrong" });
      // .render("signup", { error: "Something went wrong" });
    }

    return res
      .status(200)
      .json({ success: "Registed Successfully", USER: user });
    //   .render("login", { success: "Registed Successfully", USER: user });
  } catch (error) {
    // If any error occurs during the process, return a 500 (Internal Server Error) status code with an error message
    return res.status(500).json({ error: error.message });
    //   .render("signup", { error: "Internal Server Error" });
  }
}

// This function handles the user login request.
// It receives the request and response objects as parameters.
//
// First, it extracts the user email and password from the request body.
// If either the email or password is missing, it returns a 400 (Bad Request) status code with an error message.
//
// Next, it searches the database for a user with a matching email.
// If no user with a matching email is found, it returns a 400 (Bad Request) status code with an error message.
//
// After that, it compares the provided password with the hashed password stored in the database.
// If the passwords do not match, it returns a 400 (Bad Request) status code with an error message.
//
// If the passwords match, it generates a JSON Web Token (JWT) using the user's ID and a secret key.
// The JWT is a compact URL-safe means of representing claims to be transferred between two parties.
// The JWT contains the user's ID and is signed with a secret key.
// The JWT is set to expire in 2 hours.
//
// Finally, it returns a 200 (OK) status code with a success message and the JWT in a JSON response.
// It also sets the JWT as a cookie in the user's browser.
// The JWT is used to authenticate the user on subsequent requests.
async function userLogin(req, res) {
  try {
    // Extract the user email and password from the request body
    const { userEmail, userPassword } = req.body;

    // If either the email or password is missing, return a 400 (Bad Request) status code with an error message
    if (!userEmail || !userPassword) {
      return res.json({ error: "All fields are required" });
    }

    // Search the database for a user with a matching email
    const userExist = await User.findOne({ email: userEmail });

    // If no user with a matching email is found, return a 400 (Bad Request) status code with an error message
    if (!userExist) {
      return res.status(400).json({ error: "Please Check your Credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await compare(userPassword, userExist.password);

    // If the passwords do not match, return a 400 (Bad Request) status code with an error message
    if (!isMatch) {
      return res.status(400).json({ error: "Please Check your Credentials" });
    }

    // Generate a JSON Web Token (JWT) using the user's ID and a secret key
    const token = await jwt.sign({ _id: userExist._id }, process.env.SECRET, {
      expiresIn: "2h",
    });

    // Return a 200 (OK) status code with a success message and the JWT in a JSON response
    return res
      .status(200)
      .cookie("token", token)
      .json({ success: "Login Successfully", Token: token });
  } catch (error) {
    // If an error occurs, return a 500 (Internal Server Error) status code with an error message
    return res.status(500).json({ error: error.message });
  }
}

// This function handles the logout functionality for the user
function userLogout(req, res) {
  // Clear the token cookie to log the user out
  res.clearCookie("token").redirect("/");
}

module.exports = { userSignup, userLogin, userLogout };
