# Desafio Microsserviços Escaláveis

Projeto desenvolvido como parte da disciplina "Desafio Microsserviços Escaláveis" da Faculdade de Tecnologia Rocketseat, por Eduardo Montandon. O objetivo é demonstrar a construção, integração e observabilidade de microsserviços escaláveis utilizando tecnologias modernas de mercado.

## Tecnologias Utilizadas

| Tecnologia  | Descrição                                                 |
| ----------- | ----------------------------------------------------------- |
| Node.js     | Plataforma para execução do JavaScript no backend         |
| TypeScript  | Superset do JavaScript com tipagem estática                |
| Docker      | Contêinerização dos serviços e bancos de dados          |
| PostgreSQL  | Banco de dados relacional utilizado pelos microsserviços   |
| RabbitMQ    | Broker de mensagens para comunicação assíncrona          |
| Drizzle ORM | Mapeamento objeto-relacional para Node.js                   |
| Pulumi      | Infraestrutura como código para deploy na AWS Fargate      |
| Grafana     | Observabilidade, logging estruturado e tracing distribuído |
| Kong        | API Gateway para gerenciamento de rotas                     |

## Estrutura do Projeto

```
desafio-microsservicos-escalaveis-rocketseat/
├── app-invoices/         # Microsserviço de faturas
│   ├── src/
│   │   ├── broker/       # Integração RabbitMQ
│   │   ├── database/     # Conexão e schema do banco
│   │   └── http/         # Servidor HTTP
│   ├── Dockerfile
│   └── docker-compose.yaml
├── app-orders/           # Microsserviço de pedidos
│   ├── src/
│   │   ├── broker/       # Integração RabbitMQ
│   │   ├── database/     # Conexão e schema do banco
│   │   ├── http/         # Servidor HTTP
│   │   └── tracer/       # Observabilidade
│   ├── Dockerfile
│   └── docker-compose.yaml
├── contracts/            # Contratos de mensagens
├── docker/               # Infraestrutura de containers (Kong, scripts)
├── infra/                # Infraestrutura como código (Pulumi)
└── docker-compose.yml    # Orquestração dos microsserviços
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18.x
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Pulumi](https://www.pulumi.com/) (opcional para deploy)
- [AWS CLI](https://aws.amazon.com/cli/) (opcional para deploy)

## Configuração e Setup

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/1montandon/desafio-microsservicos-escalaveis-rocketseat.git
   cd desafio-microsservicos-escalaveis-rocketseat
   ```
2. **Instale as dependências:**

   ```bash
   cd app-invoices
   npm install
   cd ../app-orders
   npm install
   cd ..
   ```
3. **Configure variáveis de ambiente:**

   - Crie arquivos `.env` em `app-invoices/` e `app-orders/` conforme necessário.
4. **Suba os serviços com Docker Compose:**

   ```bash
   docker-compose up --build
   ```
5. **(Opcional) Deploy na AWS Fargate:**

   ```bash
   cd infra
   pulumi up
   ```

## Principais Endpoints

### Microsserviço de Pedidos (`app-orders`)

| Método | Endpoint        | Descrição            |
| ------- | --------------- | ---------------------- |
| POST    | `/orders`     | Cria um novo pedido    |
| GET     | `/orders/:id` | Consulta pedido por ID |
| GET     | `/orders`     | Lista todos os pedidos |

### Microsserviço de Faturas (`app-invoices`)

| Método | Endpoint          | Descrição            |
| ------- | ----------------- | ---------------------- |
| POST    | `/invoices`     | Cria uma nova fatura   |
| GET     | `/invoices/:id` | Consulta fatura por ID |
| GET     | `/invoices`     | Lista todas as faturas |

### Comunicação Assíncrona

- Eventos de criação de pedidos são publicados no RabbitMQ e consumidos pelo microsserviço de faturas para replicação e consistência eventual.

## Observabilidade

- Logging estruturado e tracing distribuído com Grafana.
- Tracing implementado em `app-orders/src/tracer/tracer.ts`.

## Licença

Este projeto é de uso acadêmico e segue as diretrizes da Rocketseat. Para contribuições, abra um Pull Request ou entre em contato com o autor.

---

Projeto desenvolvido por Eduardo Montandon para a Faculdade de Tecnologia Rocketseat.
