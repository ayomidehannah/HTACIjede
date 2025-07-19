document.addEventListener('DOMContentLoaded', function () {
// Select form fields
const nameInput = document.querySelector('name.js, input[placeholder="Your Name"]');
const emailInput = document.querySelector('email.js , input[placeholder="Your Email"]');
const subjectInput = document.querySelector('input[placeholder="Subject"]');
const messageInput = document.querySelector('textarea[placeholder="Your Message"]');
// Make sure the button selector matches your HTML, e.g. id="sendBtn"
const sendBtn = document.querySelector('button.js, button[placeholder="Send Message"]');

if (!nameInput || !emailInput || !subjectInput || !messageInput || !sendBtn) {
    console.error('One or more form elements not found. Please check your HTML.');
    return;
}

// Create a feedback element
let feedback = document.createElement('div');
feedback.style.marginTop = '15px';
feedback.style.display = 'none';
feedback.className = 'alert';
sendBtn.parentNode.appendChild(feedback);

sendBtn.addEventListener('click', function (e) {
    e.preventDefault();
    // Simple validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
        feedback.textContent = 'Please fill in all fields.';
        feedback.className = 'alert alert-danger';
        feedback.style.display = 'block';
        return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.className = 'alert alert-danger';
        feedback.style.display = 'block';
        return;
    }

    // Disable button and show loading
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    // Simulate API call (replace with real API when backend is ready)
    setTimeout(function () {
        feedback.textContent = 'Your message has been sent! We will get back to you soon.';
        feedback.className = 'alert alert-success';
        feedback.style.display = 'block';
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
        // Optionally clear fields
        nameInput.value = '';
        emailInput.value = '';
        subjectInput.value = '';
        messageInput.value = '';
    }, 1500);

    // Replace setTimeout with this fetch call
    // Uncomment the following code when you have a backend API ready
    
    // fetch('https://your-backend-api/contact', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         name: nameInput.value,
    //         email: emailInput.value,
    //         subject: subjectInput.value,
    //         message: messageInput.value
    //     })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     feedback.textContent = 'Your message has been sent! We will get back to you soon.';
    //     feedback.className = 'alert alert-success';
    //     feedback.style.display = 'block';
    //     sendBtn.disabled = false;
    //     sendBtn.textContent = 'Send Message';
    //     nameInput.value = '';
    //     emailInput.value = '';
    //     subjectInput.value = '';
    //     messageInput.value = '';
    // })
    // .catch(error => {
    //     feedback.textContent = 'There was an error sending your message. Please try again later.';
    //     feedback.className = 'alert alert-danger';
    //     feedback.style.display = 'block';
    //     sendBtn.disabled = false;
    //     sendBtn.textContent = 'Send Message';
    // });
});
});