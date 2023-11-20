// Get document selectors
const form = document.getElementById('commentForm');
const nameField = form.querySelector('input[name=username]');
const commentField = form.querySelector("textarea[name=comment]");
const commentsWrapper = document.getElementById('comments');
const errors = document.querySelector('.errors');

// the amount of maximum characters for the comment field
const MAX_COMMENT_CHARS = 280;

// a global variable to shows how many characters left in the comment field.
let remainingCharacters;


// initialise comments array
let comments = [];

/**
 * The submitComment function is used to submit a new comment. It sends the comment data to a server using a POST
 * request. The data is first converted to a JSON string before being sent. After the server responds, the function
 * checks if the response is successful. If successful, it adds the new comment to the local comments array and updates
 * the UI by calling renderComments. In case of an error (like a network issue or server error), it attempts to parse
 * and log the error response.
 */
async function submitComment(data) {
    try {
        const response = await fetch('https://postcomment-siywgi3smq-uc.a.run.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseJson = await response.json();
            if ('data' in responseJson) {
                // Push comment to the array of comments
                comments.push(responseJson.data);

                // render comments
                renderComments();
            }
        }
    } catch (e) {
        const errorJson = await e.json();
        console.log(errorJson);
    }
}

/**
 * Handles the submission of a comment form.
 *
 * This function is triggered when the comment form is submitted. It first prevents the default form submission action.
 * It then performs validation checks on the input fields for the username and comment. The username is sanitized by trimming
 * whitespace and removing '@' symbols to maintain a consistent username format. The function checks for empty inputs and
 * the presence of the word 'hacker' in the username (case-insensitive). If any validation errors are found, they are displayed,
 * and the function execution is halted. If the form passes validation, it clears the input fields and submits the comment data.
 */
async function postComment(event) {
    // prevent the default form action
    event.preventDefault();

    // Clear out previous errors
    errors.innerHTML = '';

    // Variable to keep track if the form has any validation errors.
    let formHasErrors = false;

    // Initialise name with value from name field
    let name = nameField.value;
    // remove all whitespaces and replace all @ symbols to keep the same username convention
    name = name.trim().replaceAll('@', '');


    // check if the name is empty and if so display the error
    if (name === '') {
        addError("The username field cannot be empty.");
        formHasErrors = true;
    }

    // check the name after conversion to lower case contains the prohibited word hacker if so display the error
    if (name.toLowerCase().match(/hacker/g)) {
        addError("Mr. Hacker please don't hack our website. The comment cannot be added use a different username.");
        formHasErrors = true;
    }

    // initialise comment with value from comment field
    let comment = commentField.value;

    // remove any white spaces
    comment = comment.trim();

    // check if the comment is empty and if so display the error
    if (comment === '') {
        addError("The comment field cannot be empty.");
        formHasErrors = true;
    }

    // Check if the form contains errors if so stop the function execution
    if (formHasErrors) return

    // Clear the form fields
    nameField.value = '';
    commentField.value = '';
    remainingCharacters = 0;


    await submitComment({
        name: name,
        comment: comment
    })
}

/**
 * Renders comments on the page.
 *
 * This function iterates over each comment in the global `comments` array and creates HTML elements to display each comment.
 * It first clears any existing comments from the comments wrapper. For each comment, it creates a new div element, sets its class for styling,
 * and appends child elements for the comment's date, name, and content. The date is formatted and displayed in a specific timezone.
 * Each fully constructed comment div is then appended to the main comments wrapper on the page.
 */
function renderComments() {
    // Clear any existing comments from the display.
    commentsWrapper.textContent = ''

    // Loop through each comment in the comments array.
    comments.forEach((comment) => {
        // Create a new div to hold the entire comment.
        const div = document.createElement("div");
        div.classList.add('comment');  // Add a CSS class for styling.


        // create a time field to render a comment
        const dateElement = document.createElement('time');
        dateElement.classList.add('comment__date');

        // create a new date by converting seconds
        const date = new Date(comment.timestamp['_seconds'] * 1000);


        dateElement.innerHTML = 'Posted at: <strong>' + date.toLocaleString('en-IE', {timeZone: 'Europe/Dublin'}) + '</strong>';
        div.appendChild(dateElement);

        // Create a new div for the comment name,  add a CSS class for styling, fill with actual comment and append to the parent
        const commentName = document.createElement('div');
        commentName.classList.add('comment__name');
        commentName.innerHTML = comment.name;
        div.appendChild(commentName);

        // Create a new div for the actual comment text,  add a CSS class for styling, fill with actual comment and append to the parent
        const commentContent = document.createElement('div');
        commentContent.classList.add('comment__content');
        commentContent.innerHTML = comment.comment;
        div.appendChild(commentContent);

        // Add the fully constructed comment div to the main comments wrapper on the page.
        commentsWrapper.appendChild(div);
    });
}

/**
 * Displays an error message on the page.
 *
 * This function is used to display error messages related to comment submission. It creates a new div element for each error message,
 * sets its class for styling, and sets its inner HTML to the provided message. The div is then appended to the 'errors' container,
 * allowing the error messages to be visible to the user.
 *
 */
 function addError(msg) {
    // Create a new div for the comment name,  add a CSS class for styling, fill with actual comment and append to the parent
    const errorDiv = document.createElement('div')
    errorDiv.classList.add('error')
    errorDiv.innerHTML = msg
    errors.appendChild(errorDiv)
}


/**
 * The function getComments asynchronously fetches comments from a specified URL. It sends a GET request to the server
 * and expects a JSON response. Once the response is received, it is converted to a JavaScript object (or array) and
 * a function renderComments is called to update the UI with these comments. If there's an error during this process,
 * it's caught and logged to the console.
 */
async function getComments() {
    try {
        // Perform a GET request to the specified URL
        const response = await fetch('https://getcomments-siywgi3smq-uc.a.run.app', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        // Parse the JSON response
        comments = await response.json()

        // Call a function to render these comments on the UI
        renderComments()

    } catch (e) {
        // Log any errors that occur during the fetch operation
        console.log(e)
    }
}

// This code runs once the page's DOM is fully loaded.
document.addEventListener("DOMContentLoaded", async function () {
    // Display all the comments on the page
    await getComments();

    // get the comment counter element
    const charCount = document.getElementById('charCount');


// Add an event listener to the comment input field
    commentField.addEventListener('input', function () {
        // Calculate the remaining characters by subtracting the length of the input from the maximum allowed characters
        remainingCharacters = MAX_COMMENT_CHARS - commentField.value.length;

        // Check if the remaining characters are less than or equal to zero
        if (remainingCharacters <= 0) {
            // If so, add a class to indicate the character limit has been exceeded
            charCount.classList.add('limit-exceeded');
            // Ensure that the remaining characters count doesn't go below zero
            remainingCharacters = 0;
        } else {
            // If the limit is not exceeded, remove the class indicating limit exceeded
            charCount.classList.remove('limit-exceeded');
        }

        // Update the text content of the character count element to show how many characters are remaining
        charCount.textContent = `${remainingCharacters} characters remaining`;
    });


    // Attach an event listener to the form to handle comment submissions.
    form.addEventListener('submit', postComment)
})
