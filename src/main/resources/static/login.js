document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('error-message');

    // Oculta mensagem de erro ao focar nos campos
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            errorMessageDiv.textContent = '';
            errorMessageDiv.style.display = 'none';
        });
    });

    // Validação dos campos
    const validarFormulario = (usuario, senha) => {
        if (!usuario.trim()) {
            errorMessageDiv.textContent = 'Por favor, digite seu nome de usuário.';
            errorMessageDiv.style.display = 'block';
            usernameInput.focus();
            return false;
        }

        if (!senha.trim()) {
            errorMessageDiv.textContent = 'Por favor, digite sua senha.';
            errorMessageDiv.style.display = 'block';
            passwordInput.focus();
            return false;
        }

        return true;
    };

    // Tratamento da submissão
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usuario = usernameInput.value;
        const senha = passwordInput.value;

        if (validarFormulario(usuario, senha)) {
            // Simula sucesso e redireciona
            window.location.href = 'paginaInicial.html';
        }
    });
});
