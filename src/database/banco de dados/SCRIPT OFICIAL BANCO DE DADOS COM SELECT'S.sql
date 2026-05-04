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

CREATE TABLE Desempenho (
    idDesempenho INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    ataque FLOAT,
    bloqueio FLOAT,
    recepcao FLOAT,
    levantamento FLOAT,
    defesa FLOAT,
    saque FLOAT,
    posicao VARCHAR(50),
    score FLOAT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (fk_usuario) references usuario(id_usuario) );
    
-- -------------------------------

select * from usuario; -- SELECT SIMPLES

select * from comentario; -- SELECT SIMPLES
 
select * from desempenho; -- SELECT SIMPLES

-- -------------------------------
select 
    usuario.nome,
    count(Desempenho.idDesempenho) as total_jogos,
    avg(Desempenho.score) as media,
    max(Desempenho.score) as melhor_jogo
from usuario
join Desempenho
on usuario.id_usuario = Desempenho.fk_usuario
group by usuario.id_usuario; -- select mais profissional e completo

-- -------------------------------

select * from desempenho order by score desc limit 5; -- TOP 5

-- -------------------------------

select count(*) as total_registros from desempenho; -- TOTAL DE REGISTROS

-- -------------------------------

select fk_usuario, avg(score) as media_score from desempenho group by fk_usuario; -- MÉDIA (PROFESSOR NÃO GOSTA, MAS É UM ADICIONAL)






