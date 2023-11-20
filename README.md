# [DB Dynamic Comments](https://db-dynamic-comments.web.app/)

This project is a dynamic, interactive web application designed to handle user comments in real-time. It leverages
Firebase and Firestore to manage backend operations, ensuring a seamless and responsive user experience.

## Features

- **Real-time Comments:** Users can post and view comments in real-time.
- **Firebase Integration:** Utilises Firebase for backend operations including database management and serverless
  functions.
- **Data Validation and Sanitization:** Ensures the integrity and safety of user input through robust validation and
  sanitization processes.
- **Responsive Design:** The application is designed to be responsive and user-friendly across various devices.

## Technical Details

- **Frontend Development:** The frontend is built using static HTML, CSS, and JavaScript. This combination provides a
  clean
  and interactive design, allowing for dynamic comment updates and user interactions.
- **Styling Framework:** Bootstrap is utilized for styling the website, offering a responsive and modern look that
  adapts to
  different screen sizes and devices.
- **Hosting and Backend Service:** Firebase hosts the website and provides backend services. This includes Firestore for
  database management and Firebase Functions for serverless backend logic, ensuring fast, scalable, and reliable access
  for users.
- **Continuous Deployment:** GitHub Actions are configured for continuous deployment, automating the process of
  deploying
  updates to Firebase. This ensures that the latest version of the application is always available to users.
- **JavaScript Functionality:** The `main.js` file in the `public/assets/js` directory contains the core JavaScript
  logic
  for handling comment submissions, validations, and rendering comments dynamically on the webpage.
- **Serverless Functions:** The `functions` directory contains Node.js code for Firebase Functions (`Comments.js`
  and `index.js`). These functions handle HTTP requests for posting and retrieving comments, including data validation
  and interaction with Firestore.

## Disclaimer

This project is created for educational purposes only. It is not affiliated with, nor does it represent, any company or
organization. The application and its source code are intended as a demonstration of coding practices and for learning
and exploration of web development concepts.