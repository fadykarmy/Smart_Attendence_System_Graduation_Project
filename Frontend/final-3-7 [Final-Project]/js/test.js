function togglePasswordVisibility(passwordFieldId, toggleIconId) {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

function highlightEmptyFields() {
    let isValid = true;
    const fields = [
        { id: 'validationCustom01', label: 'First name' },
        { id: 'validationCustom02', label: 'Last name' },
        { id: 'validationCustom03', label: 'User name' },
        { id: 'validationCustomEmail', label: 'Email' },
        { id: 'validationCustom04', label: 'Password' },
        { id: 'validationCustom05', label: 'Confirm Password' }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        let label = document.querySelector(`label[for='${field.id}']`);

        if (field.id === 'validationCustomEmail') {
            label = document.querySelector(`label[for='validationCustomEmail']`);
        } else if (field.id === 'validationCustom04' || field.id === 'validationCustom05') {
            label = document.querySelector(`label[for='${field.id}']`);
        }

        if (input.value.trim() === '') {
            input.classList.add('is-invalid');
            label.style.color = '#d32f2f';
            label.style.fontWeight = 'bold';
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            label.style.color = '';
            label.style.fontWeight = '';
        }
    });

    // Password and Confirm Password validation
    const passwordField = document.getElementById('validationCustom04');
    const confirmPasswordField = document.getElementById('validationCustom05');
    const togglePasswordIcon = document.getElementById('togglePassword');
    const toggleConfirmPasswordIcon = document.getElementById('toggleConfirmPassword');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Validate Password
    if (!passwordRegex.test(passwordField.value)) {
        passwordField.classList.add('is-invalid');
        togglePasswordIcon.classList.add('invalid'); // Add class to change color
        isValid = false;
    } else {
        passwordField.classList.remove('is-invalid');
        togglePasswordIcon.classList.remove('invalid'); // Remove class to reset color
    }

    // Validate Confirm Password
    if (confirmPasswordField.value !== passwordField.value) {
        confirmPasswordField.classList.add('is-invalid');
        toggleConfirmPasswordIcon.classList.add('invalid'); // Add class to change color
        isValid = false;
    } else {
        confirmPasswordField.classList.remove('is-invalid');
        toggleConfirmPasswordIcon.classList.remove('invalid'); // Remove class to reset color
    }

    return isValid;
}

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Form data collection and validation
    const formData = {
        firstName: document.getElementById('validationCustom01').value,
        lastName: document.getElementById('validationCustom02').value,
        username: document.getElementById('validationCustom03').value,
        email: document.getElementById('validationCustomEmail').value,
        password: document.getElementById('validationCustom04').value,
        confirmPassword: document.getElementById('validationCustom05').value
    };

    if (!highlightEmptyFields()) {
        return;
    }

    // Regular expressions for additional validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    // Validate Password with regex
    if (!passwordRegex.test(formData.password)) {
        document.getElementById('validationCustom04').classList.add('is-invalid');
        return;
    } else {
        document.getElementById('validationCustom04').classList.remove('is-invalid');
    }

    // Confirm Password match
    if (formData.password !== formData.confirmPassword) {
        document.getElementById('validationCustom05').classList.add('is-invalid');
        document.getElementById('toggleConfirmPassword').classList.add('invalid'); // Add class to change color of eye icon
        document.getElementById('validationCustom05').nextElementSibling.innerHTML = 'Passwords do not match.'; // Display error message
        return;
    } else {
        document.getElementById('validationCustom05').classList.remove('is-invalid');
        document.getElementById('toggleConfirmPassword').classList.remove('invalid'); // Remove class to reset color of eye icon
        document.getElementById('validationCustom05').nextElementSibling.innerHTML = ''; // Clear error message
    }

    // Validate Email with regex
    if (!emailRegex.test(formData.email)) {
        document.getElementById('validationCustomEmail').classList.add('is-invalid');
        return;
    } else {
        document.getElementById('validationCustomEmail').classList.remove('is-invalid');
    }

    // Validate Username with regex
    if (!usernameRegex.test(formData.username)) {
        document.getElementById('validationCustom03').classList.add('is-invalid');
        return;
    } else {
        document.getElementById('validationCustom03').classList.remove('is-invalid');
    }

    try {
        // Send form data to backend API for registration
        const response = await fetch('http://yasmeenkhaledtest.runasp.net/api/Auth/SignUpProfessor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = 'log_in.html';
        } else {
            console.error('HTTP Error:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});