
# 🗨️ Comentários API

Uma API RESTful desenvolvida com **Spring Boot** para cadastro, listagem e gerenciamento de comentários. Agora integrada com a **IA Gemini da Google**, a API **analisa automaticamente** os comentários para garantir que apenas conteúdos apropriados sejam aceitos.

---

## 🔧 Tecnologias Utilizadas
* Java 17+
* Spring Boot
* Spring Web
* Spring Data JPA
* Bean Validation (`jakarta.validation`)
* PostgreSQL (produção)
* H2 Database (testes)
* Swagger/OpenAPI
* Maven
* **Google Gemini API (moderação de conteúdo)**

---

## 🗃️ Banco de Dados

A aplicação utiliza dois bancos, conforme o ambiente:

* **Produção:** PostgreSQL
* **Testes/Desenvolvimento local:** H2 (em memória)

As configurações estão nos arquivos `application-prod.properties` e `application-test.properties`.

---

## 📌 Endpoints Disponíveis

### ✅ `POST /comentarios`

Cria um novo comentário.

#### 🔸 Requisição (JSON)

```json
{
  "nomeUsuario": "João",
  "comentario": "Este é um comentário de teste"
}
```

#### 🔹 Resposta de sucesso (`201 Created`)

```json
{
  "id": 1,
  "comentario": "Este é um comentário de teste",
  "nomeUsuario": "João",
  "dataCriacao": "2025-05-24T14:30:00",
  "aprovado": true
}
```

#### ❗ Resposta de erro - Comentário ofensivo (`400 Bad Request`)

```json
{
  "erro": "Comentário considerado ofensivo e foi reprovado pela IA."
}
```

---

### 📄 `GET /comentarios`

Lista todos os comentários aprovados.

#### 🔹 Resposta (`200 OK`)

```json
[
  {
    "id": 1,
    "comentario": "Este é um comentário de teste",
    "nomeUsuario": "João",
    "dataCriacao": "2025-05-24T14:30:00",
    "aprovado": true
  }
]
```

---

### 📌 `GET /comentarios/{id}`

Retorna um comentário específico por ID.

#### 🔹 Resposta de sucesso (`200 OK`)

```json
{
  "id": 1,
  "comentario": "Este é um comentário de teste",
  "nomeUsuario": "João",
  "dataCriacao": "2025-05-24T14:30:00",
  "aprovado": true
}
```

#### ❗ Comentário não encontrado (`404 Not Found`)

```json
{
  "erro": "Comentário não encontrado com o id: 999"
}
```

---

## ⚠️ Tratamento de Erros

A API conta com um tratamento global de erros, que retorna mensagens claras e padronizadas:

| Erro                            | Status | Exemplo de resposta                                                      |
| ------------------------------- | ------ | ------------------------------------------------------------------------ |
| Comentário não encontrado       | 404    | `{ "erro": "Comentário não encontrado com o id: 10" }`                   |
| Campo obrigatório ausente       | 400    | `{ "comentario": "O comentário não pode estar em branco." }`             |
| Comentário ofensivo (IA Gemini) | 400    | `{ "erro": "Comentário considerado ofensivo e foi reprovado pela IA." }` |

---

## 🤖 Integração com Inteligência Artificial (ativa)

A API agora utiliza a **IA Gemini da Google** para **avaliar comentários automaticamente** antes do salvamento:

* Detecta linguagem ofensiva, spam ou conteúdo inapropriado.
* Rejeita automaticamente comentários inadequados.
* Exibe uma mensagem amigável ao usuário em caso de reprovação.
* Totalmente transparente para o usuário final.

---

## ▶️ Como Executar o Projeto

### 1. Clone o repositório:

```bash
git clone https://github.com/seuusuario/comentarios-api.git
```

### 2. Acesse o diretório:

```bash
cd comentarios-api
```

### 3. Execute em modo desenvolvimento/testes:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=test
```

### 4. Execute em produção (PostgreSQL):

Configure o `application-prod.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/comentarios
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.profiles.active=prod
```

> ℹ️ Para usar a IA Gemini, defina sua chave de API:

```properties
gemini.api.key=SUA_CHAVE_DA_GOOGLE
```

---

## 📚 Documentação Swagger

Acesse a documentação Swagger da API no navegador:

```
http://localhost:8080/swagger-ui.html
```

Ela permite testar os endpoints de forma interativa.

---

## 🔒 Próximas Funcionalidades

* 🔐 Autenticação e autorização com Spring Security + JWT
* ✅ Paginação e ordenação de comentários
* 📁 Upload de imagens com comentários

---

## 📝 Observações

* Comentários são agora moderados automaticamente pela IA Gemini.
* O código segue boas práticas com DTOs, validação, camada de service e tratamento global de exceções.
* Projeto em desenvolvimento ativo.

---

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).
