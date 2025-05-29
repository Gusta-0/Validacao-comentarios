document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message'); // Elemento para exibir mensagens de erro
    const API_LOGIN_URL = 'http://localhost:8080/login/signin'; // <--- VERIFIQUE A PORTA DO SEU BACKEND!

    // --- FUNÇÕES DE AJUDA PARA GERENCIAMENTO DE AUTENTICAÇÃO ---

    // Armazena o token e informações do usuário no localStorage
    function setAuthData(token, username) {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_username', username);
        // Se sua API retornar o ID ou roles, você pode armazenar também:
        // localStorage.setItem('user_id', userId);
        // localStorage.setItem('user_roles', JSON.stringify(roles));
    }

    // Recupera o token JWT
    function getAuthToken() {
        return localStorage.getItem('jwt_token');
    }

    // Verifica se o usuário está logado (possui um token)
    function isLoggedIn() {
        return !!getAuthToken();
    }

    // Desloga o usuário, removendo o token e redirecionando para a tela de login
    function logout() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_username');
        // Remova quaisquer outros itens relacionados ao usuário
        console.log('Usuário deslogado. Redirecionando para a tela de login...');
        window.location.href = '/index.html'; // Redireciona para a tela de login (ou a URL da sua página de login)
    }

    // --- LÓGICA DE VERIFICAÇÃO INICIAL E REDIRECIONAMENTO ---
    // (Isso será executado quando a página de login carregar)

    if (isLoggedIn()) {
        // Se o usuário já estiver logado (tem um token), redireciona para a dashboard
        console.log('Token JWT encontrado. Redirecionando para a dashboard...');
        window.location.href = '/paginaInicial.html'; // Redireciona para sua página principal
    }

    // --- FUNÇÃO PARA EXIBIR MENSAGENS NO FRONT-END ---
    // Adaptação para usar as classes do CSS
    function showMessage(element, message, type = 'error') {
        element.textContent = message;
        element.className = 'error-message'; // Sempre inicia com a classe base
        if (type === 'success') {
            element.classList.add('success-message'); // Adicione uma classe para sucesso se quiser estilizar diferente
            element.classList.remove('error-message-visible'); // Remove a visibilidade de erro se for sucesso
        } else { // type === 'error'
            element.classList.add('error-message-visible'); // Classe para controlar a visibilidade
            element.classList.remove('success-message');
        }
        element.style.display = 'block'; // Garante que o elemento está visível
    }

    // Função para limpar mensagens
    function clearMessages(element) {
        element.textContent = '';
        element.style.display = 'none';
        element.className = 'error-message'; // Reseta para a classe base
    }


    // --- LÓGICA DO FORMULÁRIO DE LOGIN ---

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const username = usernameInput.value;
        const password = passwordInput.value;

        clearMessages(errorMessage); // Limpa mensagens anteriores

        // Validação básica de campos vazios
        if (!username || !password) {
            showMessage(errorMessage, 'Por favor, preencha todos os campos.', 'error');
            return;
        }

        try {
            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (response.ok) { // Status 200 OK
                const data = await response.json();
                const jwtToken = data.token;
                const loggedInUsername = data.username;

                setAuthData(jwtToken, loggedInUsername);

                // Use showMessage para uma mensagem de sucesso, que você pode estilizar ou não
                // showMessage(errorMessage, 'Login bem-sucedido! Bem-vindo(a), ' + loggedInUsername + '!', 'success');
                alert('Login bem-sucedido! Bem-vindo(a), ' + loggedInUsername + '!'); // Mantido o alert para feedback imediato

                console.log('Token JWT recebido:', jwtToken);

                // Redireciona o usuário para a dashboard ou página principal
                window.location.href = '/paginaInicial.html';

            } else {
                // Erros de autenticação (401 Unauthorized, 400 Bad Request, etc.)
                let errorDetails = 'Credenciais inválidas. Tente novamente.';
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    errorDetails = `Erro no login: ${response.status} ${response.statusText}`;
                }
                showMessage(errorMessage, errorDetails, 'error');
                console.error('Erro de login:', response.status, errorDetails);
            }
        } catch (error) {
            // Erros de rede ou outros problemas antes da resposta da API
            showMessage(errorMessage, 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', 'error');
            console.error('Erro na requisição de login:', error);
        }
    });

    // --- FUNÇÃO DE EXEMPLO PARA REQUISIÇÃO AUTENTICADA (USE EM OUTRAS PÁGINAS) ---
    // Esta função NÃO deve ser usada diretamente na tela de login.
    // Ela é um modelo de como fazer requisições para endpoints protegidos APÓS o login.
    async function fetchDataFromProtectedEndpoint(url) {
        const token = getAuthToken();
        if (!token) {
            logout(); // Redireciona para login
            return null;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else if (response.status === 401 || response.status === 403) {
                alert('Sua sessão expirou ou você não tem permissão. Faça login novamente.');
                logout();
                return null;
            } else {
                const errorData = await response.json();
                console.error('Erro ao buscar dados:', response.status, errorData);
                throw new Error(errorData.message || 'Erro ao buscar dados protegidos.');
            }
        } catch (error) {
            console.error('Erro de rede ou outra falha ao acessar recurso protegido:', error);
            throw error;
        }
    }
});