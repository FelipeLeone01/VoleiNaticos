function cor(valor){
    if(valor >= 70){
        return "verde";
    } else if(valor >= 50){
        return "amarelo";
    } else {
        return "vermelho";
    }
}

function descobrirPosicao(dados){

    let ataque = dados.ataque;
    let recepcao = dados.recepcao;

    if(recepcao > 80){
        return "Líbero";
    }

    if(ataque > 80){
        return "Oposto";
    }

    if(ataque > 70 && recepcao > 60){
        return "Ponteiro";
    }

    return "Jogador em desenvolvimento";
}

function gerarDashboard(){

    let kpis = document.getElementById("kpis");
    let barras = document.getElementById("barras");

    kpis.innerHTML = "";
    barras.innerHTML = "<h2>Desempenho por Fundamento</h2>";

    let dados = [
        ["Ataque", ataqueA.value, ataqueT.value],
        ["Bloqueio", bloqueioA.value, bloqueioT.value],
        ["Recepção", recepcaoA.value, recepcaoT.value]
    ];

    let resumo = {};

    for(let i = 0; i < dados.length; i++){

        let nome = dados[i][0];
        let acertos = Number(dados[i][1]);
        let tentativas = Number(dados[i][2]);

        if(tentativas == 0) continue;

        let eficiencia = (acertos / tentativas) * 100;
        let classe = cor(eficiencia);

        resumo[nome.toLowerCase()] = eficiencia;

        kpis.innerHTML += `
            <div class="kpi ${classe}">
                <h3>${nome}</h3>
                <h1>${eficiencia.toFixed(1)}%</h1>
            </div>
        `;

        barras.innerHTML += `
            <div class="barra ${classe}" style="width:${eficiencia}%;">
                ${nome} - ${eficiencia.toFixed(1)}%
            </div>
        `;

        fetch("/dashboard", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        ataque: resumo.ataque || 0,
        recepcao: resumo.recepção || 0
    })
})
.then(res => res.json())
.then(data => {
    console.log("Backend:", data);
});
    }

    // posição do jogador
    let posicao = descobrirPosicao({
        ataque: resumo.ataque || 0,
        recepcao: resumo.recepção || 0
    });

    kpis.innerHTML += `
        <div class="kpi" style="background: black;">
            <h3>Posição ideal</h3>
            <h1>${posicao}</h1>
        </div>
    `;
}

