# Sistema de Receituário Digital

Uma API para processar uploads de arquivos CSV com dados de prescrições médicas. O sistema valida, armazena e disponibiliza os dados através de endpoints REST.

---

## Tecnologias

- **Node.js**: `v20+`
- **NestJS**: Framework para construção da API.
- **Mongoose**: Mapeamento de objetos para o MongoDB.
- **Bull**: Gerenciador de filas de jobs para processamento assíncrono.
- **MongoDB**: Banco de dados NoSQL.
- **Redis**: Usado pelo Bull como back-end para a fila de jobs.
- **Multer**: Middleware para lidar com o upload de arquivos.
- **`csv-parse`**: Biblioteca para processar arquivos CSV.

---

## Instalação

### Pré-requisitos

Certifique-se de ter o **Docker** e o **Docker Compose** instalados.

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Czpla/test-mevo
    cd test-mevo
    ```

2.  **Suba os contêineres de banco de dados:**
    Este comando inicia os serviços do **MongoDB** e **Redis** usando o Docker Compose.

    ```bash
    docker compose up -d
    ```

3.  **Instale as dependências do Node.js:**

    ```bash
    npm install
    ```

4.  **Inicie a aplicação:**
    O projeto será iniciado no modo de desenvolvimento, com `hot-reload`.

    ```bash
    npm run start:dev
    ```

A aplicação estará rodando em `http://localhost:3000`.

---

## Endpoints

### 1. Upload e Processamento de CSV

Inicia o processamento de um arquivo CSV de prescrições médicas.

- **`POST /api/prescriptions/upload`**
- **Payload:** `multipart/form-data`
  - `file`: O arquivo CSV a ser processado.
- **Resposta `201 Created`:**

  ```json
  {
    "upload_id": "89b9d3b4-1a9c-4e7a-9f5b-1c5c9e2b1d6f",
    "status": "processing",
    "total_records": null,
    "processed_records": 0,
    "valid_records": 0,
    "errors": []
  }
  ```

### 2. Status do Processamento

Consulta o status de um job de processamento de CSV usando o `upload_id` retornado pelo endpoint de upload.

- **`GET /api/prescriptions/upload/:id`**
- **Parâmetro:** `:id` (o `upload_id` do job)
- **Resposta `200 OK` (exemplo):**

  ```json
  {
    "upload_id": "89b9d3b4-1a9c-4e7a-9f5b-1c5c9e2b1d6f",
    "status": "completed",
    "total_records": 180,
    "processed_records": 180,
    "valid_records": 140,
    "errors": [
      {
        "line": 68,
        "field": "date",
        "message": "Invalid date or future date.",
        "value": "2026-06-03"
      }
    ]
  }
  ```

- **Resposta `404 Not Found`:** Se o `id` não for encontrado.

---

## Configuração

As configurações de banco de dados (`DATABASE_URI`) são carregadas a partir de um arquivo `.env` na raiz do projeto.

Exemplo de arquivo `.env`:

```ini
DATABASE_URI=mongodb://localhost/digital-prescriptions
```
