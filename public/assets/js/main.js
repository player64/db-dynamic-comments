// Get document selectors
const form = document.getElementById('commentForm')
const nameField = form.querySelector('input[name=username]')
const commentField = form.querySelector("textarea[name=comment]")
const commentsWrapper = document.getElementById('comments')
const errors = document.querySelector('.errors')

// initialise comment array with some comments
let comments = [
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

async function submitComment(data) {
    try {
        const response = await fetch('https://postcomment-siywgi3smq-uc.a.run.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const responseJson = await response.json()
            if ('data' in responseJson) {
                // Push comment to the array of comments
                comments.push(responseJson.data)

                // render comments
                renderComments()
            }
        }
    } catch (e) {
        const errorJson = await e.json()
        console.log(errorJson)
    }
}

// This function handles the posting of a user comment.
async function postComment(event) {
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
    comment = comment.trim()

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


    await submitComment({
        name: name,
        comment: comment
    })
}

// This function renders comments on the page.
function renderComments() {
    // Clear any existing comments from the display.
    commentsWrapper.textContent = ''

    // Loop through each comment in the comments array.
    comments.reverse().forEach((comment) => {
        // Create a new div to hold the entire comment.
        const div = document.createElement("div");
        div.classList.add('comment');  // Add a CSS class for styling.


        // create date
        const dateElement = document.createElement('time');

        const date = new Date(comment.timestamp['_seconds'] * 1000);

        console.log(comment.timestamp['_seconds'])

        dateElement.classList.add('comment__date');
        dateElement.innerHTML = 'Posted at:' + date.toLocaleString('en-IE', {timeZone: 'Europe/Dublin'});
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

// This function displays an error message on the page.
function addError(msg) {
    // Create a new div for the comment name,  add a CSS class for styling, fill with actual comment and append to the parent
    const errorDiv = document.createElement('div')
    errorDiv.classList.add('error')
    errorDiv.innerHTML = msg
    errors.appendChild(errorDiv)
}


// https://postcomment-siywgi3smq-uc.a.run.app
// Function URL (getComments(us-central1)): https://getcomments-siywgi3smq-uc.a.run.app


async function getComments() {
    try {
        const response = await fetch('https://getcomments-siywgi3smq-uc.a.run.app', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        comments = await response.json()
        renderComments()

    } catch (e) {
        console.log(e)
    }
}

// This code runs once the page's DOM is fully loaded.
document.addEventListener("DOMContentLoaded", async function () {
    // Display all the comments on the page.
    //
    await getComments();


    const charCount = document.getElementById('charCount');
    const maxChars = 280;

    commentField.addEventListener('input', function () {
        let remaining = maxChars - commentField.value.length;


        if (remaining <= 0) {
            charCount.classList.add('limit-exceeded');
            remaining = 0
        } else {
            charCount.classList.remove('limit-exceeded');

        }

        charCount.textContent = `${remaining} characters remaining`;
    });

    // Attach an event listener to the form to handle comment submissions.
    form.addEventListener('submit', postComment)
})
