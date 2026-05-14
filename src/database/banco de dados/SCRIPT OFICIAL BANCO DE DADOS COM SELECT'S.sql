drop database ProjetoIndividual;
create database ProjetoIndividual;
use ProjetoIndividual;

create table usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
alter table usuario
add column cpf char(11) unique not null;

create table post (
    id_post INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    data_postagem DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

create table comentario (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    conteudo TEXT NOT NULL,
    data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT NOT NULL,
    fk_post INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_post) REFERENCES post(id_post)
);

create table respostaComentario (
    id_resposta INT AUTO_INCREMENT,
    conteudo VARCHAR(300) NOT NULL,
    dtResposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fkComentario INT NOT NULL,
    fkUsuario INT NOT NULL,

    PRIMARY KEY (id_resposta, fkComentario),

    FOREIGN KEY (fkComentario)
        REFERENCES comentario(id_comentario),

    FOREIGN KEY (fkUsuario)
        REFERENCES usuario(id_usuario)
);
create table curtidas_post (
    fkUsuario INT,
    fkPost INT,
    dtCurtida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (fkUsuario, fkPost),

    FOREIGN KEY (fkUsuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (fkPost)
        REFERENCES post(id_post)
);

create table desempenho (
    idDesempenho INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    ataque FLOAT,
    bloqueio FLOAT,
    recepcao FLOAT,
    levantamento FLOAT,
    defesa FLOAT,
    saque FLOAT,
    posicao VARCHAR(50),
    score FLOAT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario)
);

 -- SÓ SELECT SIMPLES : 
 
select * from usuario;

select * from post;

select * from comentario;

select * from respostaComentario;

select * from curtidas_post;

select * from desempenho;

-- ------------------------------

-- Estatísticas de desempenho : 

select 
    usuario.nome,
    count(desempenho.idDesempenho) as total_jogos,
    round(avg(desempenho.score), 2) as media,
    max(desempenho.score) as melhor_jogo,
    min(desempenho.score) as pior_jogo
from usuario
join desempenho
on usuario.id_usuario = desempenho.fk_usuario
group by usuario.id_usuario;

-- ------------------------------

-- Top 5 melhores scores : 

select 
    usuario.nome,
    desempenho.score,
    desempenho.posicao,
    desempenho.data_registro
from desempenho
join usuario
on usuario.id_usuario = desempenho.fk_usuario
order by desempenho.score desc
limit 5;

-- ------------------------------

-- Total de registros : 

select count(*) as total_registros
from desempenho;

-- ------------------------------

-- Média de score por usuário : 

select 
    fk_usuario,
    round(avg(score), 2) as media_score
from desempenho
group by fk_usuario;

-- -----------------------------

-- Total de curtidas por post : 

select
    post.id_post,
    post.titulo,
    count(curtidas_post.fkPost) as total_curtidas
from post
left join curtidas_post
on post.id_post = curtidas_post.fkPost
group by post.id_post;

-- -----------------------------

-- Total de comentários por usuário : 

select
    usuario.nome,
    count(comentario.id_comentario) as total_comentarios
from usuario
left join comentario
on usuario.id_usuario = comentario.fk_usuario
group by usuario.id_usuario;

-- -----------------------------

-- Ranking Geral : 

create view vw_ranking_geral as
select
    usuario.nome,
    desempenho.posicao,
    round(avg(desempenho.score),2) as media_score,
    max(desempenho.score) as melhor_score,
    count(desempenho.idDesempenho) as total_partidas
from usuario
join desempenho
on usuario.id_usuario = desempenho.fk_usuario
group by usuario.id_usuario
order by media_score desc;

select * from vw_ranking_geral;
-- ------------------------------

-- Fórum como todo : 

create view vw_forum as
select
    post.id_post,
    post.titulo,
    post.conteudo,
    usuario.nome as autor,
    post.data_postagem,
    count(distinct comentario.id_comentario) as total_comentarios,
    count(distinct curtidas_post.fkUsuario) as total_curtidas
from post
join usuario
on usuario.id_usuario = post.fk_usuario
left join comentario
on comentario.fk_post = post.id_post
left join curtidas_post
on curtidas_post.fkPost = post.id_post
group by post.id_post;

select * from vw_forum;

-- --------------------------------