import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';


async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Local}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Local}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
    }

    try {
        const token = Token();

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

        vincularEventosLinhas();

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    preencherTabela();
});

//AREA FUNÇÃO PARA ABRIR CAMINHOS DENTRO DO LOCAL

export function abrirlinks(pagina) {
    const token = Token();
    if (token) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarLocal() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            const token = Token();
            const url = `${API_URLS.Local}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir o local`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Local excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            alert('Erro ao excluir o local. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('Pesquisar').addEventListener('click', function () {
        const pesquisa = document.getElementById('text').value;
        preencherTabela(pesquisa);
    });

    document.getElementById('deletar').addEventListener('click', function () {
        deletarLocal();
    });

    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinks('CadastroLocal.html');
    });

    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinks('alterarLocal.html');
    });
});
