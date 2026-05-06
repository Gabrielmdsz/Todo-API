# Todo API

API simples para gerenciar tarefas usando Node.js, Express, Prisma e PostgreSQL.

## Visão geral

Este projeto oferece endpoints REST para criar, listar e apagar todos (`todos`). Ele usa:

- `Express` para servidor HTTP
- `Prisma` como ORM para PostgreSQL
- `Docker Compose` para executar o banco de dados PostgreSQL localmente
- `tsx` para rodar TypeScript diretamente em desenvolvimento

## Pré-requisitos

- Node.js 18+ instalado
- npm instalado
- Docker e Docker Compose instalados para rodar o banco de dados local

## Instalação

1. Clone o repositório

```bash
git clone <repo-url> todo-api
cd todo-api
```

2. Instale as dependências

```bash
npm install
```

3. Crie o arquivo de ambiente

```bash
cp .env.example .env
```

4. Atualize `.env` com a URL correta do banco de dados

A variável esperada é:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5434/<dbname>"
```

> No projeto, o banco PostgreSQL é exposto na porta `5434` do host porque o `docker-compose.yml` mapeia o container PostgreSQL padrão `5432` para `5434` no host.

## `.env.example`

O arquivo `.env.example` contém o formato esperado para o arquivo de configuração de ambiente:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>"
```

Substitua:

- `<user>`: usuário do banco de dados
- `<password>`: senha do banco
- `<dbname>`: nome do banco de dados

Se você usar o Docker Compose local fornecido, a porta do host deve ser `5434` em vez de `5432`.

## Docker Compose

O `docker-compose.yml` define um serviço PostgreSQL:

```yaml
services:
  ecomerce-db:
    image: postgres:15
    container_name: todo-api
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: prisma
    ports:
      - "5434:5432"
```

- `5432` é a porta padrão do PostgreSQL dentro do container
- `5434` é a porta exposta no host local

Isso significa que, a partir da sua máquina, você deve se conectar usando `localhost:5434`.

## Inicializando o banco de dados com Docker

1. Inicie o container PostgreSQL:

```bash
docker compose up -d
```

2. Verifique a conexão com a variável `DATABASE_URL` em `.env`

3. Rode as migrations do Prisma se necessário:

```bash
npx prisma migrate deploy
```

ou, em ambiente de desenvolvimento:

```bash
npx prisma migrate dev
```

## Scripts úteis

- `npm run dev` - executa o servidor em modo de desenvolvimento com `tsx watch src/server.ts`

## Uso

Execute o servidor:

```bash
npm run dev
```

A API irá iniciar em `http://localhost:3000`.

### Endpoints

- `POST /todos`
  - Cria uma nova tarefa.
  - Corpo JSON esperado:

```json
{
  "text": "Minha tarefa",
  "completed": false
}
```

- `GET /todos`
  - Lista todas as tarefas.

- `DELETE /todos/:id`
  - Remove a tarefa com o ID informado.

## Observações importantes

- A porta do serviço Express está fixa em `3000` no código.
- O Docker mapeia `5434` no host para `5432` no container para permitir rodar PostgreSQL local sem conflito com outras instâncias.
- Garanta que o `DATABASE_URL` do `.env` use a mesma porta que o Docker Compose expõe.

## Estrutura do projeto

- `src/server.ts` - entrada do servidor e rotas
- `src/types.ts` - tipos TypeScript da API
- `prisma/schema.prisma` - modelo de dados do Prisma
- `docker-compose.yml` - configuração do PostgreSQL local
- `.env.example` - exemplo de variáveis de ambiente

## Contribuição

Sinta-se à vontade para abrir issues ou contribuir com melhorias no código e na documentação.
