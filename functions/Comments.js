// Importing necessary modules
const logger = require("firebase-functions/logger"); // For logging purposes
const admin = require('firebase-admin'); // Firebase admin SDK
admin.initializeApp(); // Initialize Firebase app

// Define the Comments class
class Comments {
    constructor() {
        this.collectionName = 'comments' // Firestore collection name for comments
    }

    // Method to get comments from Firestore
    async get(request, response) {
        logger.info("Get comments!", {structuredData: true}); // Log the action

        // Retrieve comments from Firestore, ordered by timestamp
        const snapshot = await admin.firestore().collection(this.collectionName)
            .orderBy('timestamp', 'asc').get();

        // Check if the collection is empty
        if (snapshot.empty) {
            const msg = "The collection is empty";
            logger.info(msg, {structuredData: true}) // Log the empty collection message
            response.send({ msg: msg }); // Send response to client
            return;
        }

        // If collection is not empty, extract data from documents
        const data = [];
        snapshot.forEach(doc => data.push(doc.data()))
        response.send(data) // Send the data as response
    }

    // Method to post a new comment to Firestore
    async post(request, response) {
        logger.info("Post comment function!", {structuredData: true}); // Log the action

        // Sanitize the incoming data
        const sanitizedData = this.sanitizeData(request.body);

        // Validate the sanitized data
        try {
            this.validate(sanitizedData)
        } catch (e) {
            logger.error(e) // Log the error
            response.status(400).send({ error:  e.message }); // Send error response
            return;
        }

        // Add a timestamp to the data
        try {
            sanitizedData.timestamp = admin.firestore.Timestamp.now();
        } catch (e) {
            logger.info("The timestamp is not available locally.")
        }

        // Update the name property to follow a specific convention
        sanitizedData.name = "@" + sanitizedData.name;

        // Save the data to Firestore
        try {
            await admin.firestore().collection(this.collectionName).add(sanitizedData);
            response.status(201).send({
                status: "Saved in the database",
                data: sanitizedData
            })
        } catch (e) {
            logger.error(e); // Log the error
            response.status(500).send({ error: 'Something goes wrong!' }); // Send error response
        }
    }

    // Method to validate the comment data
    validate(data) {
        if(!data.name || data.name === '') {
            throw new Error("Name is required!");
        }

        // Check if the name contains the word 'hacker' (case insensitive)
        if (data.name.toLowerCase().match(/hacker/g)) {
            throw new Error("Mr. Hacker please don't hack our website. The comment cannot be added use a different username.");
        }

        // Validate the comment text
        if(!data.comment || data.comment === '') {
            throw new Error("Comment is required!");
        }

        // Check the length of the comment
        if(data.comment.length > 280) {
            throw new Error("The comment has extended 280 characters");
        }
    }

    // Method to sanitize the incoming data
    sanitizeData(request) {
        return {
            name: ('name' in request) ? request.name.trim().replaceAll('@', '') : null,
            comment: ('comment' in request) ? request.comment.trim() : null
        }
    }
}

// Export the Comments class
module.exports = {Comments};
