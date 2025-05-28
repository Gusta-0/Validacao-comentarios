// URL da API para gerenciar comentários (onde você salva/carrega)
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

        const response = await fetch(API_COMENTARIOS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeUsuario, comentario: comentarioTexto })
        });

        if (!response.ok) {
            // Se o backend retornou um erro (ex: 400 por comentário ofensivo)
            const erroMensagem = await response.text(); // Assume que o ControllerAdvice retorna texto puro
            throw new Error(erroMensagem || "Erro ao enviar comentário.");
        }

        const data = await response.json();
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-success">Comentário enviado com sucesso! ID: ${data.id}</div>
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

// A função carregarComentarios() permanece a mesma
async function carregarComentarios() {
    try {
        const response = await fetch(API_COMENTARIOS_URL);
        if (!response.ok) {
            throw new Error(`Erro ao carregar comentários: ${response.statusText}`);
        }
        const comentarios = await response.json();

        const tabela = document.querySelector("#tabelaComentarios tbody");
        tabela.innerHTML = comentarios.map(comentario => {
            const dataFormatada = comentario.criadoEm
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
                    <td>${dataFormatada}</td>
                </tr>
            `;
        }).join("");
    } catch (error) {
        console.error("Erro ao carregar comentários:", error);
        document.getElementById("mensagem").innerHTML = `
            <div class="alert alert-danger">Erro ao carregar comentários: ${error.message}</div>
        `;
    }
}

carregarComentarios();



//
//
//document.getElementById("comentarioForm").addEventListener("submit", async (e) => {
//    e.preventDefault();
//    
//    const nomeUsuario = document.getElementById("nomeUsuario").value;
//    const comentario = document.getElementById("comentario").value;
//    
//    try {
//        const response = await fetch(API_URL, {
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify({ nomeUsuario, comentario })
//        });
//
//        if (!response.ok) {
//            const erro = await response.json();
//            throw new Error(erro.erro || "Erro ao enviar comentário");
//        }
//
//        const data = await response.json();
//        document.getElementById("mensagem").innerHTML = `
//            <div class="alert alert-success">Comentário enviado com sucesso! ID: ${data.id}</div>
//        `;
//        carregarComentarios();
//    } catch (error) {
//        document.getElementById("mensagem").innerHTML = `
//            <div class="alert alert-danger">${error.message}</div>
//        `;
//    }
//});
//
//async function carregarComentarios() {
//    try {
//        const response = await fetch(API_URL);
//        const comentarios = await response.json();
//
//        console.log("Dados recebidos:", comentarios); 
//
//        const tabela = document.querySelector("#tabelaComentarios tbody");
//        tabela.innerHTML = comentarios.map(comentario => {
//
//            const dataFormatada = comentario.criadoEm 
//                ? new Date(...comentario.criadoEm.slice(0, 6)).toLocaleString()
//                : "Data não disponível";
//
//            return `
//                <tr>
//                    <td>${comentario.id}</td>
//                    <td>${comentario.nomeUsuario}</td>
//                    <td>${comentario.comentario}</td>
//                    <td>${dataFormatada}</td>
//                </tr>
//            `;
//        }).join("");
//    } catch (error) {
//        console.error("Erro ao carregar comentários:", error);
//    }
//}
//
//
//// carregarComentarios();