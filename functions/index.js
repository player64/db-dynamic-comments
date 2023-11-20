/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// Importing necessary modules and classes
const {onRequest} = require("firebase-functions/v2/https");
const {Comments} = require("./Comments");

// 'https://db-dynamic-comments.web.app'
// Enabling Cross-Origin Resource Sharing (CORS) with a wildcard, allowing requests from any origin
const cors = require('cors')({origin: '*'});

// Creating an instance of the Comments class to handle comment-related operations
const commentsEntity = new Comments();

// Exporting a Cloud Function 'postComment' for handling HTTP POST requests
exports.postComment = onRequest((request, response) => {
    // Using CORS middleware to handle Cross-Origin requests
    cors(request, response, async () => {
        // Delegating the request handling to the post method of the Comments instance
        await commentsEntity.post(request, response);
    });
});

// Exporting a Cloud Function 'getComments' for handling HTTP GET requests
exports.getComments = onRequest((request, response) => {
    // Using CORS middleware to handle Cross-Origin requests
    cors(request, response, async () => {
        // Delegating the request handling to the get method of the Comments instance
        await commentsEntity.get(request, response);
    });
});
