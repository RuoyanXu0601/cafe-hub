document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submissionForm');
    form.addEventListener('submit', handleSubmit);
});

function handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();

    if (name && email && message) {
        alert(`Thanks, ${name}! We have received your message.`);
        // Reset after submission
        event.target.reset();
    } else {
        alert('Please fill in all fields.');
    }
}
