//AREA LOCAL

async function preencherTabelaLocal(pesquisa = "") {
    const tbody = document.getElementById('tbodyLocal');
    tbody.innerHTML = '';

    let url = `${API_URLS.Local}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Local}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
          }

        const locais = await response.json();

        locais.forEach((local) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = local.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = local.nome;
            const tdDescricao = document.createElement('td');
            tdDescricao.textContent = local.descricao;

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdDescricao);

            tr.addEventListener('click', function () { selecionarLinha(this); });

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

//AREA FUNÇÃO PARA ABRIR CAMINHOS DENTRO DO LOCAL

function abrirlinksLocal(pagina) {
    return window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
}

//FUNCIONAMENTO BOTÃO CADASTRAR AREA LOCAL

const opcoesLocal = document.getElementById('opcoesLocal');

opcoesLocal.addEventListener('click', (evento) => {
    if (evento.target.id === 'salvarLocal' || evento.target.id === 'salvarSLocal') {
        const nome = document.getElementById('nomeLocal').value.toUpperCase();
        const descricao = document.getElementById('descricao').value.toUpperCase();

        enviarDadosLocal(nome, descricao,evento.target.id);
    } else if (evento.target.id === 'sair') {
        fecharAba();
    }
});

async function enviarDadosLocal(nome,descricao, botaoId) {
    const url = `${API_URLS.Local}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, descricao }),
        });

        if (response.ok) {
            
            document.querySelectorAll('input').forEach(input => input.value = '');
            alert('Local criado com sucesso!');

            if (botaoId === 'salvarSLocal') {
                fecharAba();
            }
        } else {
            console.error('Erro ao salvar os dados do local:', response.status);
        }
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
    }
};

const sairLocal = document.getElementById('sair');

sairLocal.addEventListener('click', fecharAba);

function fecharAba() {
    window.close();
}