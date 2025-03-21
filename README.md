# Nome do Projeto
Case Tech
## Visão Geral
Case tech. Desenvolvido para gerenciamento de processos

## Tecnologias
- React.js
- Mermaid
- Vite

## Setup
1. Clone o repositório:
https://github.com/RaulReezende/Case-front

2. Instale as dependências:
npm install

3. Rode o servidor:

## Endpoint principais
- **GET /Home**: Retorna as páginas.
- **GET /NotFound**: Quando entrar em uma rota que não existe.

- **GET /Departamentos**: Busca todos os departamento cadastrados.
- **POST /Departamentos**: Insere um departamento.
- **PUT /Departamentos**: Atualiza um departamento.
- **DELETE /Departamentos**: Deleta um departamento.

- **GET /Processos/:DepartamentoId**: Busca todos os processos cadastrados do departamento.
- **POST /form/:departamentoId/:processoId?**: Insere um departamento e atualiza.
- **DELETE /Process/:Id**: Deleta um departamento.

- **GET /Equipes**: Busca todos as equipes cadastrados.
- **POST /Equipes/add**: Insere uma equipes.
- **PUT /Equipes/editar/:id**: Atualiza um departamento.

- **GET /responsaveis**: Busca todos os resposáveis.
- **POST /responsaveis/add**: Insere um responsável.
- **PUT /responsaveis/editar/:id**: Atualiza um departamento.