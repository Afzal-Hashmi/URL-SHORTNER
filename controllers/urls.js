const { nanoid } = require("nanoid");
const Url = require("../models/urls");

// This function handles the POST request to create a new short URL.
// It receives the request and response objects as parameters.
//
// First, it checks if the user is authenticated.
// If the user is not authenticated, it redirects the user to the login page.
//
// Then, it logs the request body to the console for debugging purposes.
// This can help us understand what's going on if something goes wrong.
//
// Next, it extracts the URL from the request body.
// If the URL is missing, it returns a 400 (Bad Request) status code
// with an error message.
// This is to prevent the user from creating a short URL without providing
// a valid URL.
//
// After that, it generates a random short ID using the nanoid library.
// Nanoid is a library that generates unique IDs using a cryptographically
// secure random number generator.
// The short ID should be unique for each URL, so we can use it to identify
// the URL in the database.
//
// Finally, it creates a new URL document in the database with the provided URL,
// the generated short ID, and an empty analytics array.
// The analytics array is empty for now, but we can use it to store information
// about the URL, such as when it was accessed.
//
// After creating the URL document, it returns a 200 (OK) status code
// with the generated short ID.
// This tells the user that the short URL was created successfully.
async function newShortUrl(req, res) {
  if (!req.user) {
    return res.redirect("/user/login");
  }

  // Log the request body to the console for debugging purposes
  console.log(req.body);

  // Extract the URL from the request body
  const body = req.body;

  // If the URL is missing, return a 400 (Bad Request) status code with an error message
  if (!body.Url) {
    return res.status(400).json({ error: "Url is Required" });
  }

  // Generate a random short ID using the nanoid library
  const short = nanoid(5);

  // Create a new URL document in the database with the provided URL,
  // the generated short ID, and an empty analytics array
  await Url.create({
    originalUrl: body.Url,
    shortId: short,
    analytics: [],
  });

  // Return a 200 (OK) status code with the generated short ID
  return res.status(200).json({ Id: short });
}

// This function handles the GET request when a user enters a short URL.
// It first gets the short ID from the request parameters.
//
// Next, it searches the database for a URL with a matching short ID.
// It uses the findOneAndUpdate method provided by Mongoose to search for a URL with a matching short ID and update its analytics with the current timestamp.
//
// The findOneAndUpdate method returns the found URL document, or null if no URL with a matching short ID was found.
//
// Finally, it redirects the user to the original URL stored in the found URL document.
async function getUrl(req, res) {
  // Check if the user is authenticated
  if (!req.user) {
    // If the user is not authenticated, redirect them to the login page
    return res.redirect("/user/login");
  }

  // Get the short ID from the request parameters
  const short = req.params.shortId;

  // Search the database for a URL with a matching short ID and update its analytics
  const url = await Url.findOneAndUpdate(
    { shortId: short }, // Search for URLs with a matching short ID
    {
      $push: { analytics: { timestamps: Date.now() } }, // Add the current timestamp to the URL's analytics
    }
  );

  // If no URL with a matching short ID was found, return a 404 (Not Found) status code
  if (!url) {
    return res.status(404).json({ error: "Url Not Found" });
  }

  // Redirect the user to the original URL
  res.redirect(url.originalUrl);
}

module.exports = { newShortUrl, getUrl };
