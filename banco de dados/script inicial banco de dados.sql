create database ProjetoIndividual;
use ProjetoIndividual;

create table usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100),
    data_cadastro datetime default current_timestamp
);

create table post (
    id_post INT PRIMARY KEY AUTO_INCREMENT,
    titulo varchar(150),
    conteudo varchar(100),
    data_postagem datetime default current_timestamp,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

create table comentario (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    conteudo varchar(100),
    data_comentario datetime default current_timestamp,
    fk_usuario INT,
    fk_post INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_post) REFERENCES post(id_post)
);

create table estatistica (
    id_estatistica INT PRIMARY KEY AUTO_INCREMENT,
    pontos INT,
    tentativas INT,
    erros INT,
    jogos INT,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);





