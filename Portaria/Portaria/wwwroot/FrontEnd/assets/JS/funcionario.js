import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas, ocultar } from './utilidades.js';

let currentState = {
    skip: 1,
    take: 5,
    ordenDesc: false,
    totalItems: 0,
    dadosCompletos: [], 
    termoPesquisa: "" 
};

function status(status) {
    switch (status) {
        case 1:
            return 'ATIVO';
        case 0:
            return 'INATIVO';
        default:
            return 'desconhecido';
    }
}

async function buscarDados(pesquisa = "") {
    try {
        const url = pesquisa.trim() !== "" 
            ? `${API_URLS.Funcionario}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`
            : `${API_URLS.Funcionario}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}`);
        }

        const data = await response.json();
        currentState.dadosCompletos = data;
        currentState.totalItems = data.length;
        currentState.termoPesquisa = pesquisa;

        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
    }
}

function paginarDados(dados) {
    const inicio = (currentState.skip - 1) * currentState.take;
    const fim = inicio + currentState.take;
    return dados.slice(inicio, fim);
}

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    try {
        if (pesquisa !== currentState.termoPesquisa || currentState.dadosCompletos.length === 0) {
            await buscarDados(pesquisa);
        }

        if (currentState.ordenDesc) {
            currentState.dadosCompletos.sort((a, b) => b.nome.localeCompare(a.nome));
        } else {
            currentState.dadosCompletos.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        const dadosPaginados = paginarDados(currentState.dadosCompletos);
        
        dadosPaginados.forEach((funcionario) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = funcionario.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = funcionario.nome;
            const tdCpf = document.createElement('td');
            tdCpf.textContent = funcionario.cpf;
            const tdMatricula = document.createElement('td');
            tdMatricula.textContent = funcionario.matricula;
            const tdStatus = document.createElement('td');
            tdStatus.textContent = status(funcionario.status);
            const tdDataAdmissao = document.createElement('td');
            tdDataAdmissao.textContent = new Date(funcionario.dataAdmissao).toLocaleDateString();
            const tdDataDesligamento = document.createElement('td');
            tdDataDesligamento.textContent = funcionario.dataDesligamento ? new Date(funcionario.dataDesligamento).toLocaleDateString() : '';

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCpf);
            tr.appendChild(tdMatricula);
            tr.appendChild(tdStatus);
            tr.appendChild(tdDataAdmissao);
            tr.appendChild(tdDataDesligamento);

            tr.addEventListener('click', function () { selecionarLinha(this); });

            tbody.appendChild(tr);
        });

        vincularEventosLinhas();
        updatePaginationButtons();

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(currentState.totalItems / currentState.take);
    const currentPage = currentState.skip;

    document.getElementById('anterior').disabled = currentPage <= 1;
    document.getElementById('proximo').disabled = currentPage >= totalPages;
    document.getElementById('ultimaPaginaBefore').disabled = currentPage <= 1;
    document.getElementById('ultimaPaginaNext').disabled = currentPage >= totalPages;
}

function setupPaginationHandlers() {
    document.getElementById('anterior').addEventListener('click', () => {
        if (currentState.skip > 1) {
            currentState.skip--;
            preencherTabela(currentState.termoPesquisa);
        }
    });

    document.getElementById('proximo').addEventListener('click', () => {
        const totalPages = Math.ceil(currentState.totalItems / currentState.take);
        if (currentState.skip < totalPages) {
            currentState.skip++;
            preencherTabela(currentState.termoPesquisa);
        }
    });

    document.getElementById('ultimaPaginaBefore').addEventListener('click', () => {
        currentState.skip = 1;
        preencherTabela(currentState.termoPesquisa);
    });

    document.getElementById('ultimaPaginaNext').addEventListener('click', () => {
        currentState.skip = Math.ceil(currentState.totalItems / currentState.take);
        preencherTabela(currentState.termoPesquisa);
    });
}

export function abrirlinks(pagina) {
    if (Token()) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarFuncionario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        try {
            const url = `${API_URLS.Funcionario}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir funcionário`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Funcionário excluído com sucesso!');
            localStorage.removeItem('idUsuarioSelecionado');
            
            currentState.skip = 1;
            currentState.dadosCompletos = []; // Força uma nova busca
            preencherTabela(currentState.termoPesquisa);

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir o funcionário. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const usuarioId = localStorage.getItem('usuarioId');
    ocultar(usuarioId);

    preencherTabela();
    setupPaginationHandlers();

    document.getElementById('Pesquisar').addEventListener('click', function () {
        currentState.skip = 1;
        const pesquisa = document.getElementById('text').value;
        preencherTabela(pesquisa);
    });

    document.getElementById('deletar').addEventListener('click', function () {
        deletarFuncionario();
    });

    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinks('CadastroFuncionario.html');
    });

    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinks('alterarFuncionario.html');
    });
});