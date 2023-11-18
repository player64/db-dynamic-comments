/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const {Comments} = require("./Comments");

// 'https://db-dynamic-comments.web.app'

const cors = require('cors')({origin: '*'});


const commentsEntity = new Comments();


exports.postComment = onRequest((request, response) => {
    cors(request, response, async () => {
        await commentsEntity.post(request, response);
    });
});

exports.getComments = onRequest((request, response) => {
    cors(request, response, async () => {
        await commentsEntity.get(request, response);
    });
});
