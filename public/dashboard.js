    // Função responsável por definir a cor do KPI
function cor(valor){

    if(valor >= 70){
        return "verde";

    } else if(valor >= 50){
        return "amarelo";

    } else {
        return "vermelho";
    }
}

    // Função responsável por descobrir a posição ideal do jogador
function descobrirPosicao(dados){

    let ataque = dados.ataque;
    let bloqueio = dados.bloqueio;
    let recepcao = dados.recepcao;
    let levantamento = dados.levantamento;
    let defesa = dados.defesa;

        // Regra para Líbero
    if(recepcao > 75 && defesa > 70 && ataque < 60){
        return "Líbero";
    }

        // Regra para Levantador
    if(levantamento > 75){
        return "Levantador";
    }

        // Regra para Central
    if(bloqueio > 75 && ataque > 60){
        return "Central";
    }

        // Regra para Oposto
    if(ataque > 80){
        return "Oposto";
    }

        // Regra para Ponteiro
    if(ataque > 70 && recepcao > 60){
        return "Ponteiro";
    }

        // Caso não encontre posição ideal
    return "Jogador em desenvolvimento";
}

    // Função principal responsável por gerar toda dashboard
function gerarDashboard(){

        // Validação de login
    if(sessionStorage.ID_USUARIO == null){
        alert("Faça login para salvar desempenho");
        return;
    }

        // Pegando containers da dashboard
    let kpis = document.getElementById("kpis");
    let barras = document.getElementById("barras");

        // Limpando conteúdo anterior
    kpis.innerHTML = "";
    barras.innerHTML = "<h2>Desempenho por Fundamento</h2>";

        // Array com todos os fundamentos
    let dados = [

        ["Ataque", ataqueA.value, ataqueT.value],
        ["Bloqueio", bloqueioA.value, bloqueioT.value],
        ["Recepção", recepcaoA.value, recepcaoT.value],
        ["Levantamento", levantamentoA.value, levantamentoT.value],
        ["Defesa", defesaA.value, defesaT.value],
        ["Saque", saqueA.value, saqueT.value]
    ];

        // Objeto que vai armazenar os resultados
    let resumo = {};

        // Loop responsável por calcular todas eficiências
    for(let i = 0; i < dados.length; i++){

        let nome = dados[i][0];
        let acertos = Number(dados[i][1]);
        let tentativas = Number(dados[i][2]);

            // Validação dos números digitados
        if(!isNaN(acertos) && !isNaN(tentativas) && tentativas > 0){

                // Cálculo de eficiência
            let eficiencia = (acertos / tentativas) * 100;

                // Descobrindo a cor do KPI
            let classe = cor(eficiencia);

                // Salvando no objeto resumo
            resumo[nome.toLowerCase()] = eficiencia;

                // Gerando KPI
            kpis.innerHTML += `

                <div class="kpi ${classe}">
                    <h3>${nome}</h3>
                    <h1>${eficiencia.toFixed(1)}%</h1>
                </div>
            `;

                // Gerando barra de desempenho
            barras.innerHTML += `

                <div class="barra ${classe}" style="width:${eficiencia}%;">
                    ${nome} - ${eficiencia.toFixed(1)}%
                </div>
            `;
        }
    }

        // Descobrindo posição do jogador
    let posicao = descobrirPosicao({

        ataque: resumo.ataque || 0,
        bloqueio: resumo.bloqueio || 0,
        recepcao: resumo.recepção || 0,
        levantamento: resumo.levantamento || 0,
        defesa: resumo.defesa || 0
    });

        // Cálculo do score final
    let scoreFinal = (

        (resumo.ataque || 0) +
        (resumo.bloqueio || 0) +
        (resumo.recepção || 0) +
        (resumo.levantamento || 0) +
        (resumo.defesa || 0) +
        (resumo.saque || 0)

    ) / 6;

        // KPI da posição ideal
    kpis.innerHTML += `

        <div class="kpi" style="background:black;">
            <h3>Posição ideal</h3>
            <h1>${posicao}</h1>
        </div>
    `;

        // Envio dos dados para o backend
    fetch("/dashboard/salvar", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            idUsuario: sessionStorage.ID_USUARIO,

            ataque: resumo.ataque || 0,
            bloqueio: resumo.bloqueio || 0,
            recepcao: resumo.recepção || 0,
            levantamento: resumo.levantamento || 0,
            defesa: resumo.defesa || 0,
            saque: resumo.saque || 0,

            posicao: posicao,
            score: scoreFinal
        })
    })

    .then(function(resposta){

        return resposta.json();
    })

    .then(function(data){

            // Mostrando retorno do backend
        console.log("Dados salvos:", data);
    })

    .catch(function(erro){

            // Caso aconteça algum erro
        console.log("Erro ao salvar:", erro);
    });
}