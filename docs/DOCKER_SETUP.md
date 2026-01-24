# Instruções para rodar o projeto com Docker

1. Instale Docker e Docker Compose em sua máquina.
2. Clone o repositório.
3. Copie o arquivo `.env.example` para `.env` e ajuste se necessário (isso vale para rodar localmente sem Docker).
4. Rode:

    docker compose up --build

5. O serviço estará disponível em http://localhost:3000

- O banco de dados PostgreSQL estará disponível em localhost:5432 (usuário: forum, senha: forum, banco: forum).
- O Prisma já está configurado para usar a variável de ambiente `DATABASE_URL`.
- No Docker, o `DATABASE_URL` é definido no `docker-compose.yml` apontando para o serviço `db`.
- As migrations rodam automaticamente na inicialização do serviço `api`.
- Para acessar o container da API:

    docker compose exec api sh

- Para resetar o banco (apaga dados) e subir novamente:

    docker compose down -v
    docker compose up --build
