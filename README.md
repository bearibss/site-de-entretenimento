# 🎧 Resenhas de Álbuns
## Sobre o projeto

O Resenhas de Álbuns é uma aplicação web desenvolvida para amantes da música que desejam descobrir álbuns, compartilhar opiniões e conhecer diferentes perspectivas sobre obras musicais.

A plataforma permite explorar um catálogo de álbuns, consultar informações sobre artistas e lançamentos, publicar resenhas e avaliar obras musicais. A aplicação integra uma API externa para obter informações dos álbuns e utiliza um banco de dados para armazenar os usuários, as obras e as resenhas publicadas.

### Funcionalidades
**- Catálogo de álbuns:** navegação por álbuns musicais disponíveis na plataforma.
**- Busca de álbuns:** pesquisa de obras pelo título ou nome do artista.
**- Detalhes dos álbuns:** visualização de informações como título, artista, capa e data de lançamento.
**- Cadastro de usuários:** criação de contas para acessar as funcionalidades da plataforma.
**- Publicação de resenhas:** criação de resenhas com título, texto e nota.
**- Visualização de resenhas:** leitura das opiniões publicadas pelos usuários.
**- Edição de resenhas:** atualização do conteúdo das próprias publicações.
**- Exclusão de resenhas:** remoção das próprias publicações.
**- Avaliação de álbuns:** atribuição de notas às obras musicais.
**- Página inicial:** acesso às principais áreas da plataforma e às resenhas disponíveis.
### Tecnologias utilizadas
**Frontend:** interface e interação com os usuários.
**Backend:** processamento das requisições, validação dos dados e regras de negócio.
**PostgreSQL:** banco de dados relacional.
**iTunes Search API:** consulta de informações sobre álbuns musicais.
Banco de dados

A aplicação utiliza um banco de dados relacional organizado em três tabelas principais:

### Usuários (usuarios)

Armazena as informações dos usuários cadastrados, incluindo identificador, nome, e-mail e hash da senha.

### Álbuns (albuns)

Armazena os dados necessários para identificar e exibir os álbuns, incluindo identificador interno, identificador externo da API, título, artista, URL da capa e data de lançamento.

### Resenhas (reviews)

Armazena as resenhas publicadas, incluindo identificador, título, texto, nota, data de publicação e referências ao álbum e ao usuário responsável.

As tabelas são relacionadas por chaves estrangeiras, permitindo associar cada resenha ao álbum correspondente e ao usuário que a publicou.

### Como funciona
O usuário acessa o catálogo e pesquisa um álbum.
A aplicação consulta a API externa e apresenta os resultados disponíveis.
O usuário seleciona uma obra para consultar seus detalhes e as resenhas existentes.
O usuário cadastrado pode publicar uma resenha e atribuir uma nota ao álbum.
A aplicação registra os dados necessários no banco de dados e associa a resenha ao usuário e à obra.
As resenhas ficam disponíveis para consulta, e seus autores podem editar ou excluir as próprias publicações.

Quando um álbum ainda não está registrado no banco de dados, a aplicação pode cadastrá-lo automaticamente ao ser necessário para uma resenha, evitando registros duplicados.

### Segurança e integridade dos dados
As senhas são armazenadas em formato de hash, nunca em texto puro.
Os dados são validados antes de serem persistidos.
As chaves estrangeiras garantem a integridade dos relacionamentos.
As operações de edição e exclusão de resenhas respeitam as permissões dos usuários.
As credenciais de acesso ao banco de dados são mantidas em variáveis de ambiente, quando aplicável.
Objetivo do projeto

O projeto tem como objetivo oferecer um espaço para a descoberta musical e o compartilhamento de opiniões sobre álbuns, além de aplicar conhecimentos de desenvolvimento web, integração com APIs, modelagem de bancos de dados relacionais e operações CRUD.

Desenvolvido como uma aplicação web voltada à comunidade de ouvintes e apreciadores de música.