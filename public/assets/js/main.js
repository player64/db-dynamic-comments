// Get document selectors
const form = document.getElementById('commentForm')
const nameField = form.querySelector('input[name=username]')
const commentField = form.querySelector("textarea[name=comment]")
const commentsWrapper = document.getElementById('comments')
const errors = document.querySelector('.errors')

// initialise comment array with some comments
const comments = [
    {
        name: '@alexa',
        comment: "It's a great website, layout is user-friendly, and the resources available are top-notch. Highly recommended for everyone!"
    },
    {
        name: "@sean",
        comment: "Everything is so accessible, and the regular updates keep everything relevant."
    },
    {
        name: "@elaine",
        comment: "Kudos to the team for such a comprehensive platform!"
    }
]

// This function handles the posting of a user comment.
function postComment(event) {
    // prevent the default form action
    event.preventDefault()

    // Clear out previous errors
    errors.innerHTML = ''

    // Variable to keep track if the form has any validation errors.
    let formHasErrors = false

    // Initialise name with value from name field
    let name = nameField.value
    // remove all whitespaces and replace all @ symbols to keep the same username convention
    name = name.trim().replaceAll('@', '')


    // check if the name is empty and if so display the error
    if (name === '') {
        addError("The username field cannot be empty.")
        formHasErrors = true
    }

    // check the name after conversion to lower case contains the prohibited word hacker if so display the error
    if (name.toLowerCase().match(/hacker/g)) {
        addError("Mr. Hacker please don't hack our website. The comment cannot be added use a different username.")
        formHasErrors = true
    }

    // initialise comment with value from comment field
    let comment = commentField.value

    // remove any white spaces
    comment =  comment.trim()

    // check if the comment is empty and if so display the error
    if (comment === '') {
        addError("The comment field cannot be empty.")
        formHasErrors = true
    }

    // Check if the form contains errors if so stop the function execution
    if (formHasErrors) return

    // Clear the form fields
    nameField.value = ''
    commentField.value = ''

    // Push comment to the array of comments
    comments.push({
        name: '@' + name,
        comment: comment
    })

    // Display all the comments on the page.
    renderComments()

    // Output the current state of comments to the console
    console.log(comments)
}

// This function renders comments on the page.
function renderComments() {
    // Clear any existing comments from the display.
    commentsWrapper.textContent = ''

    // Loop through each comment in the comments array.
    comments.forEach((comment) => {
        // Create a new div to hold the entire comment.
        const div = document.createElement("div");
        div.classList.add('comment');  // Add a CSS class for styling.

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

// This function displays an error message on the page.
function addError(msg) {
    // Create a new div for the comment name,  add a CSS class for styling, fill with actual comment and append to the parent
    const errorDiv = document.createElement('div')
    errorDiv.classList.add('error')
    errorDiv.innerHTML = msg
    errors.appendChild(errorDiv)
}

// This code runs once the page's DOM is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
    // Display all the comments on the page.
    renderComments()

    // Attach an event listener to the form to handle comment submissions.
    form.addEventListener('submit', postComment)
})
