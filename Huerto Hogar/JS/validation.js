document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DEL USUARIO SIMULADO ---
    const simulatedUser = {
        email: 'juan.perez@example.com',
        password: 'HuertoHogar_25!'
    };

    // --- FUNCIÓN HELPER REUTILIZABLE ---
    const setValidationStatus = (element, isValid, errorMessageElement, message) => {
        if (isValid) {
            element.classList.remove('input-error');
            element.classList.add('input-success');
            errorMessageElement.textContent = '';
        } else {
            element.classList.remove('input-success');
            element.classList.add('input-error');
            errorMessageElement.textContent = message;
        }
    };

    // --- LÓGICA PARA EL FORMULARIO DE REGISTRO ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');

        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');

        // Funciones de validación individuales que devuelven true o false
        const validateName = () => {
            const isValid = nameInput.value.trim().length >= 3;
            setValidationStatus(nameInput, isValid, nameError, isValid ? '' : 'El nombre debe tener al menos 3 caracteres.');
            return isValid;
        };

        const validateEmail = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(emailInput.value);
            setValidationStatus(emailInput, isValid, emailError, isValid ? '' : 'Por favor, ingresa un correo válido.');
            return isValid;
        };

        const validatePassword = () => {
            const pass = passwordInput.value;
            let isValid = true;
            let passErrorMessage = '';

            if (pass.length < 8 || pass.length > 50) {
                passErrorMessage = 'Debe tener entre 8 y 50 caracteres. ';
                isValid = false;
            } else if (!/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/[0-9]/.test(pass) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass)) {
                passErrorMessage = 'Debe incluir mayúscula, minúscula, número y caracter especial.';
                isValid = false;
            }
            
            setValidationStatus(passwordInput, isValid, passwordError, passErrorMessage);
            return isValid;
        };
        
        // Listeners al evento 'input' para validar en tiempo real (solo feedback visual)
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        passwordInput.addEventListener('input', validatePassword);

        // Listener para el envío final, este es el que bloquea si hay errores
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Siempre prevenimos el envío por defecto
            
            // Volvemos a ejecutar todas las validaciones para asegurar que todo esté correcto
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            
            // Solo si TODOS los campos son válidos, procedemos
            if (isNameValid && isEmailValid && isPasswordValid) {
                alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
                window.location.href = 'login.html';
            }
        });
    }

    // --- LÓGICA PARA EL FORMULARIO DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginError = document.getElementById('login-error');
        
        // Listener para el envío final
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredEmail = emailInput.value;
            const enteredPassword = passwordInput.value;

            if (enteredEmail === simulatedUser.email && enteredPassword === simulatedUser.password) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'perfil.html';
            } else {
                setValidationStatus(emailInput, false, loginError, '');
                setValidationStatus(passwordInput, false, loginError, 'Correo o contraseña incorrectos.');
            }
        });
    }
});