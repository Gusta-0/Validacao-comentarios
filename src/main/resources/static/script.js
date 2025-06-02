const API_COMENTARIOS_URL = "http://localhost:8080/comentarios";

document.getElementById("comentarioForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const comentarioTexto = document.getElementById("comentario").value;

    if (!comentarioTexto.trim()) {
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-warning">Por favor, digite um comentário.</div>
        `;
        return;
    }

    try {
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-info">Enviando comentário para validação e salvamento...</div>
        `;

        // Requisição POST para enviar um novo comentário
        // Aqui, as credenciais precisam ser incluídas SE o endpoint de POST também for protegido.
        // Se o endpoint de POST for público (permitAll), então credentials: 'include' não é estritamente necessário para o POST,
        // mas não faz mal deixá-lo para consistência ou se ele também exigir sessão.
        const response = await fetch(API_COMENTARIOS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeUsuario, comentario: comentarioTexto }),
            credentials: 'include' // <<< ADICIONE AQUI TAMBÉM SE SEU POST FOR PROTEGIDO!
        });

        if (!response.ok) {
            const erroMensagem = await response.text();
            throw new Error(erroMensagem || "Erro ao enviar comentário.");
        }

        const data = await response.json();
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-success">Comentário enviado com sucesso! ID: ${data.id}</div>
        `;
        document.getElementById("nomeUsuario").value = '';
        document.getElementById("comentario").value = '';
        carregarComentarios(); // Recarrega os comentários após o envio
    } catch (error) {
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-danger">Erro: ${error.message}</div>
        `;
        console.error("Erro completo:", error);
    }
});


async function carregarComentarios() {
    try {
        // >>>>> AQUI É ONDE VOCÊ PRECISA ADICIONAR credentials: 'include' <<<<<
        const response = await fetch(API_COMENTARIOS_URL, {
            method: 'GET', // Método padrão para fetch é GET, mas é bom ser explícito
            credentials: 'include' // ESSENCIAL para enviar o cookie de sessão!
        });

        if (!response.ok) {
            // Se o login foi bem-sucedido mas a sessão expirou ou houve logout,
            // ou se o usuário não está autenticado e tenta acessar diretamente
            if (response.status === 401 || response.status === 403) {
                console.error("Não autorizado ou proibido ao carregar comentários. Redirecionando para login.");
                window.location.href = 'login.html'; // Redireciona para a página de login
                return; // Impede a continuação da função
            }
            throw new Error(`Erro ao carregar comentários: ${response.status} ${response.statusText}`);
        }
        const comentarios = await response.json();

        const comentariosContainer = document.getElementById('comentariosAprovados');
        comentariosContainer.innerHTML = '';

        if (comentarios.length === 0) {
            comentariosContainer.innerHTML = `
                <div class="col-12 text-center py-4">
                    <p class="text-muted">Ainda não há comentários aprovados. Seja o primeiro a comentar!</p>
                </div>
            `;
            return;
        }

        comentarios.forEach(comentario => {
            const dataFormatada = comentario.criadoEm
                ? new Date(
                    comentario.criadoEm[0],
                    comentario.criadoEm[1] - 1,
                    comentario.criadoEm[2],
                    comentario.criadoEm[3],
                    comentario.criadoEm[4],
                    comentario.criadoEm[5]
                ).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : "Data não disponível";

            const colDiv = document.createElement('div');
            colDiv.className = 'col';

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card comment-card h-100 shadow-sm';

            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.className = 'card-body';

            const authorEl = document.createElement('h5');
            authorEl.className = 'card-subtitle mb-2 comment-author';
            authorEl.textContent = comentario.nomeUsuario;

            const textEl = document.createElement('p');
            textEl.className = 'card-text comment-text';
            textEl.textContent = comentario.comentario;

            const dateEl = document.createElement('p');
            dateEl.className = 'card-text text-end';
            const smallDateEl = document.createElement('small');
            smallDateEl.className = 'text-muted comment-date';
            smallDateEl.textContent = dataFormatada;
            dateEl.appendChild(smallDateEl);

            cardBodyDiv.appendChild(authorEl);
            cardBodyDiv.appendChild(textEl);
            cardBodyDiv.appendChild(dateEl);
            cardDiv.appendChild(cardBodyDiv);
            colDiv.appendChild(cardDiv);

            comentariosContainer.appendChild(colDiv);
        });

        // Opcional: Ainda preenche a tabela oculta se houver alguma lógica que dependa disso
        const tabela = document.querySelector("#tabelaComentarios tbody");
        if (tabela) { // Verifica se a tabela existe
            tabela.innerHTML = comentarios.map(comentario => {
                const dataFormatadaTabela = comentario.criadoEm
                    ? new Date(
                        comentario.criadoEm[0],
                        comentario.criadoEm[1] - 1,
                        comentario.criadoEm[2],
                        comentario.criadoEm[3],
                        comentario.criadoEm[4],
                        comentario.criadoEm[5]
                    ).toLocaleString()
                    : "Data não disponível";

                return `
                    <tr>
                        <td>${comentario.id}</td>
                        <td>${comentario.nomeUsuario}</td>
                        <td>${comentario.comentario}</td>
                        <td>${dataFormatadaTabela}</td>
                    </tr>
                `;
            }).join("");
        }


    } catch (error) {
        console.error("Erro ao carregar comentários:", error);
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-danger">Erro ao carregar comentários: ${error.message}</div>
        `;
    }
}

// Carrega os comentários ao iniciar a página (se a página atual for aquela que exibe os comentários e exige login)
// Se você está redirecionando do login.html para outra página (ex: dashboard.html)
// que tem essa função carregarComentarios, esta linha está correta para essa nova página.
document.addEventListener('DOMContentLoaded', carregarComentarios);