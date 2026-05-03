var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';


require("dotenv").config({ path: caminho_env }); // Carrega as variáveis de ambiente do arquivo escolhido



var express = require("express"); // Importa o framework Express para criar o servidor
var cors = require("cors"); // Importa o middleware para permitir requisições externas
var path = require("path"); // Importa módulo para lidar com caminhos de arquivos
var database = require("./src/database/config"); // Importa configuração do banco de dados
var PORTA_APP = process.env.APP_PORT; // Pega a porta do servidor 
var HOST_APP = process.env.APP_HOST; // Pega o host do servidor 

var app = express(); // Cria a aplicação Express


app.use(express.json()); // Permite receber JSON no corpo das requisições
app.use(express.urlencoded({ extended: false })); // Permite receber dados de formulários
app.use(express.static(path.join(__dirname, "public"))); // Define pasta pública para arquivos estáticos
app.use(cors()); // Libera acesso de outras origens (frontend, por exemplo)

app.post("/curtir", function (req, res) { // Rota para curtir ou descurtir um post
    const { idPost, idUsuario } = req.body; // Recebe dados da requisição

    const verificar = `
        SELECT * FROM curtida 
        WHERE fk_usuario = ${idUsuario} AND fk_post = ${idPost};
    `; // Verifica se o usuário já curtiu o post

    database.executar(verificar).then(resultado => {

        if (resultado.length > 0) { // Se já existe curtida

            const remover = `
                DELETE FROM curtida 
                WHERE fk_usuario = ${idUsuario} AND fk_post = ${idPost};
            `; // Remove curtida

            database.executar(remover).then(() => {
                res.json({ curtido: false }); // Retorna que o post não está mais curtido
            });

        } else {

            const inserir = `
                INSERT INTO curtida (fk_usuario, fk_post)
                VALUES (${idUsuario}, ${idPost});
            `; //Inserir curtida

            database.executar(inserir).then(() => {
                res.json({ curtido: true });
            });
        }

    });
});

app.get("/posts", async function (req, res) { // Rota para buscar todos os posts
    try {
        const posts = await database.executar(`
            SELECT * FROM post ORDER BY id_post DESC;
        `);

        for (let post of posts) {
            const comentarios = await database.executar(`
                SELECT id_comentario, conteudo, fk_usuario FROM comentario 
                WHERE fk_post = ${post.id_post};
            `);// Busca todos os posts ordenados do mais recente


           post.comentarios = comentarios; // Envia objeto completo (id, texto e dono)
        }

        res.json(posts); // Retorna lista de posts com comentários

    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao buscar posts");
    }
});


app.post("/publicar", function (req, res) { // Rota para criar um novo post
    const { titulo, conteudo, idUsuario } = req.body; // Recebe dados da requisição

    const tituloSafe = titulo ? titulo.replace(/'/g, "''") : "Sem título";
    const conteudoSafe = conteudo.replace(/'/g, "''");

    const query = `
        INSERT INTO post (titulo, conteudo, fk_usuario)
        VALUES ('${tituloSafe}', '${conteudoSafe}', ${idUsuario});
    `; // Inserir post

    console.log("SQL:", query); 
    database.executar(query)
        .then(() => {
            res.sendStatus(200); // Retorna sucesso
        })
        .catch(erro => {
            console.log("ERRO REAL:", erro);
            res.status(500).send("Erro ao publicar"); // Retorna erro
        });
});


app.get("/likes/:idPost", function (req, res) { // Rota para contar likes de um post
    const idPost = req.params.idPost; // Pega id do post da URL

    const query = `
        SELECT COUNT(*) as total 
        FROM curtida 
        WHERE fk_post = ${idPost};
    `; // Contar curtidas

    database.executar(query).then(resultado => {
        res.json(resultado[0]); // Retorna total de curtidas
    });
});

app.post("/comentar", function (req, res) { // Rota para comentar em um post
    const { conteudo, idUsuario, idPost } = req.body; // Recebe dados do corpo
const conteudoSafe = conteudo.replace(/'/g, "''"); // Trata aspas no comentário

    const query = `
        INSERT INTO comentario (conteudo, fk_usuario, fk_post)
       VALUES ('${conteudoSafe}', ${idUsuario}, ${idPost});
    `; // Inserir comentário

    database.executar(query)
        .then(() => res.sendStatus(200)) // Retorna sucesso
        .catch(erro => {
            console.log(erro);
            res.status(500).send("Erro ao comentar"); // Retorna erro
        });
});

app.post("/excluirComentario", function (req, res) { // Rota para excluir comentário
    const { idComentario, idUsuario } = req.body; // Recebe id do comentário e usuário

    const query = `
        DELETE FROM comentario 
        WHERE id_comentario = ${idComentario} AND fk_usuario = ${idUsuario};
    `; // Remove o comentário apenas se for do próprio usuário

    database.executar(query)
        .then(() => res.sendStatus(200)) // Retorna sucesso
        .catch(erro => {
            console.log(erro);
            res.status(500).send("Erro ao excluir comentário"); // Retorna erro
        });
});

app.post("/dashboard", function(req, res){

    const { ataque, recepcao } = req.body;

    let posicao = "Indefinido";

    if(recepcao > 80){
        posicao = "Líbero";
    } else if(ataque > 80){
        posicao = "Oposto";
    } else if(ataque > 70){
        posicao = "Ponteiro";
    }

    res.json({ posicao });
});

var usuarioRouter = require("./src/routes/usuarios"); // Importa rotas de usuários




app.use("/usuarios", usuarioRouter); // Define prefixo /usuarios para rotas de usuário

app.listen(PORTA_APP, function () { // Inicia servidor do web-data-viz
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});