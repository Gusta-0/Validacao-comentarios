const API_COMENTARIOS_URL = "http://localhost:8080/comentarios";

// 🟢 Trava de tecla inválida
function bloquearTeclasInvalidas(event) {
    const tecla = event.key;
    const teclaValida =
        /^[A-Za-zÀ-ÿ\s]$/.test(tecla) || // letras e espaço
        ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(tecla); // controle

    if (!teclaValida) {
        event.preventDefault();
    }
}

// 🟢 Filtro ao digitar/colar
function filtrarCaracteresPermitidos(input) {
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
}

// 🟢 Aplica eventos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById("nomeUsuario");

    if (nomeInput) {
        nomeInput.addEventListener("keydown", bloquearTeclasInvalidas);
        nomeInput.addEventListener("input", function () {
            filtrarCaracteresPermitidos(this);
        });
    }

    carregarComentarios();
});

// 🟡 Envio do formulário
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
            <div class="alert alert-info">Verificando...</div>
        `;

        const response = await fetch(API_COMENTARIOS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeUsuario, comentario: comentarioTexto }),
            credentials: 'include'
        });

        if (!response.ok) {
            const responseBody = await response.text();
            let erroMensagem = "Erro ao enviar comentário.";
            try {
                const erroJson = JSON.parse(responseBody);
                erroMensagem = erroJson.mensagem || erroJson.erro || erroMensagem;
            } catch {
                if (responseBody) erroMensagem = responseBody;
            }
            throw { message: erroMensagem };
        }

        const data = await response.json();
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-success">Comentário enviado com sucesso!</div>
        `;
        document.getElementById("nomeUsuario").value = '';
        document.getElementById("comentario").value = '';
        carregarComentarios();
    } catch (error) {
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-danger">Erro: ${error.message}</div>
        `;
        console.error("Erro completo:", error);
    }
});

async function carregarComentarios() {
    try {
        const response = await fetch(API_COMENTARIOS_URL, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.error("Não autorizado ou proibido ao carregar comentários. Redirecionando para login.");
                window.location.href = 'login.html';
                return;
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

        const tabela = document.querySelector("#tabelaComentarios tbody");
        if (tabela) {
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
        const mensagemErroLimpa = error?.message || error;
        document.getElementById("mensagem").innerHTML = `
        <div class="alert alert-danger">${mensagemErroLimpa}</div>
    `;
        console.error("Erro completo:", error);
    }

}
