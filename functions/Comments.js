const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
admin.initializeApp();

class Comments {
    constructor() {
        this.collectionName = 'comments'
    }

    async get(request, response) {
        logger.info("Get comments!", {structuredData: true});

        const snapshot = await admin.firestore().collection(this.collectionName)
            .orderBy('timestamp', 'asc').get();


        if (snapshot.empty) {
            const msg = "The collection is empty";

            logger.info(msg, {structuredData: true})
            response.send({
                msg: msg
            });
            return;
        }

        const data = [];
        snapshot.forEach(doc => data.push(doc.data()))
        response.send(data)
    }

    async post(request, response) {
        logger.info("Post comment function!", {structuredData: true});

        const sanitizedData = this.sanitizeData(request.body);

        try {
            this.validate(sanitizedData)
        } catch (e) {
            logger.error(e)
            response.status(400).send({
                error:  e.message,
            });
            return;
        }

        // try to get a timestamp
        try {
            sanitizedData.timestamp = admin.firestore.Timestamp.now();
        } catch (e) {
            logger.info("The timestamp is not available locally.")
        }

        // Updating the name property to follow the same convention
        sanitizedData.name = "@" + sanitizedData.name;

        // try to save the data to the database
        try {
            await admin.firestore().collection(this.collectionName).add(sanitizedData);
            response.status(201).send({
                status: "Saved in the database",
                data: sanitizedData
            })
        } catch (e) {
            logger.error(e);
            response.status(500).send({
                error: 'Something goes wrong!'
            });
        }
    }

    validate(data) {
        if(!data.name || data.name === '') {
            throw new Error("Name is required!");
        }

        // check the name after conversion to lower case contains the prohibited word hacker if so display the error
        if (data.name.toLowerCase().match(/hacker/g)) {
            throw new Error("Mr. Hacker please don't hack our website. The comment cannot be added use a different username.");
        }

        // comment
        if(!data.comment || data.comment === '') {
            throw new Error("Comment is required!");
        }

        if(data.comment.length > 280) {
            throw new Error("The comment has extended 280 characters");
        }
    }

    sanitizeData(request) {
        return {
            name: ('name' in request) ? request.name.trim().replaceAll('@', '') : null,
            comment: ('comment' in request) ? request.comment.trim() : null
        }
    }
}

module.exports = {Comments};