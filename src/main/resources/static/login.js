document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('error-message');

    const API_BASE_URL = 'http://localhost:8080';

    const PROTECTED_ENDPOINT = `${API_BASE_URL}/private`;

    const REDIRECT_ON_SUCCESS = 'paginaInicial.html';

    usernameInput.addEventListener('focus', () => {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    });

    passwordInput.addEventListener('focus', () => {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    });

    const showErrorMessage = (message) => {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    };

    const validateForm = (username, password) => {
        if (!username.trim()) {
            showErrorMessage('Por favor, digite seu nome de usuário.');
            usernameInput.focus();
            return false;
        }
        if (!password.trim()) {
            showErrorMessage('Por favor, digite sua senha.');
            passwordInput.focus();
            return false;
        }
        return true;
    };

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!validateForm(username, password)) {
            return;
        }

        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';

        try {
            const credentials = btoa(`${username}:${password}`);

            const response = await fetch(PROTECTED_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (response.ok) {
                console.log('Login bem-sucedido!');
                window.location.href = REDIRECT_ON_SUCCESS;
            } else if (response.status === 401) {
                showErrorMessage('Usuário ou senha inválidos. Tente novamente.');
                passwordInput.value = '';
            } else if (response.status === 403) {
                showErrorMessage('Você não tem permissão para acessar esta área.');
            } else {
                const errorData = await response.json();
                console.error('Erro no login:', response.status, errorData);
                showErrorMessage(`Ocorreu um erro ao fazer login: ${errorData.message || 'Erro desconhecido.'}`);
            }

        } catch (error) {
            console.error('Erro de rede ou ao processar a requisição:', error);
            showErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
        }
    });
});