// sessão
function validarSessao() { // Função pra verificar se o usuário está logado
    var email = sessionStorage.EMAIL_USUARIO; // Pega o email salvo na sessão do navegador
    var nome = sessionStorage.NOME_USUARIO; // Pega o nome salvo na sessão

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) { // Verifica se existem dados na sessão
        b_usuario.innerHTML = nome; // Mostra o nome do usuário na tela
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() { // Função para sair da conta (logout)
    sessionStorage.clear(); // Remove todos os dados salvos na sessão
    window.location = "../login.html";
}


function aguardar() { // Função para mostrar um indicador de carregamento
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex"; // Torna a div visível
}

function finalizarAguardar(texto) { // Função para esconder o loading e mostrar erro
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login"); // Busca a div de erros
    if (texto) { // Verifica se foi passado algum texto
        divErrosLogin.style.display = "flex"; // Mostra a div de erro
        divErrosLogin.innerHTML = texto; // Exibe a mensagem de erro
    }
}

