import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas, ocultar } from './utilidades.js';

let estadoAtual = {
    skip: 1,
    take: 10,
    ordenDesc: false,
    totalItems: 0,
    dadosCompletos: [], 
    termoPesquisa: "" 
};

async function buscarDados(pesquisa = "") {
    try {
        const url = pesquisa.trim() !== "" 
            ? `${API_URLS.Visitante}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`
            : `${API_URLS.Visitante}`;

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

        estadoAtual.dadosCompletos = data;
        estadoAtual.totalItems = data.length;
        estadoAtual.termoPesquisa = pesquisa;

        return data;

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function paginarDados(dados) {
    const inicio = (estadoAtual.skip - 1) * estadoAtual.take;
    const fim = inicio + estadoAtual.take;
    return dados.slice(inicio, fim);
}

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    try {

        if (pesquisa !== estadoAtual.termoPesquisa || estadoAtual.dadosCompletos.length === 0) {
            await buscarDados(pesquisa);
        }

        if (estadoAtual.ordenDesc) {
            estadoAtual.dadosCompletos.sort((a, b) => b.nome.localeCompare(a.nome));
        } else {
            estadoAtual.dadosCompletos.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        const visitante = paginarDados(estadoAtual.dadosCompletos);
        
        visitante.forEach((visitante) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = visitante.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = visitante.nome;
            const tdCpf = document.createElement('td');
            tdCpf.textContent = visitante.cpf;
            const tdMotivoVisita = document.createElement('td');
            tdMotivoVisita.textContent = visitante.motivoVisita;
            const tdPessoaVisitada = document.createElement('td');
            tdPessoaVisitada.textContent = visitante.pessoaVisitada;

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCpf);
            tr.appendChild(tdMotivoVisita);
            tr.appendChild(tdPessoaVisitada);

            tr.addEventListener('click', function () { selecionarLinha(this); });

            tbody.appendChild(tr);
        });

        vincularEventosLinhas();
        atualizarTabelaPorBotao();

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

function atualizarTabelaPorBotao() {
    const totalPaginas = Math.ceil(estadoAtual.totalItems / estadoAtual.take);
    const paginaAtual = estadoAtual.skip;

    document.getElementById('anterior').disabled = paginaAtual <= 1;
    document.getElementById('proximo').disabled = paginaAtual >= totalPaginas;
    document.getElementById('ultimaPaginaBefore').disabled = paginaAtual <= 1;
    document.getElementById('ultimaPaginaNext').disabled = paginaAtual >= totalPaginas;
}

function configuracoesPaginacao() {
    const acoes = {
        anterior: () => estadoAtual.skip > 1 && estadoAtual.skip--,
        proximo: () => estadoAtual.skip < Math.ceil(estadoAtual.totalItems / estadoAtual.take) && estadoAtual.skip++,
        ultimaPaginaBefore: () => estadoAtual.skip = 1,
        ultimaPaginaNext: () => estadoAtual.skip = Math.ceil(estadoAtual.totalItems / estadoAtual.take),
    };

    Object.keys(acoes).forEach(id => 
        document.getElementById(id).addEventListener('click', () => {
            acoes[id]();
            preencherTabela(estadoAtual.termoPesquisa);
        })
    );
}

export function abrirlinks(pagina) {
    if (Token()) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarVisitante() {
    const idUsuario = localStorage.getItem('usuarioId');

    if (confirm('Tem certeza que deseja excluir este Visitante?')) {
        try {

            const url = `${API_URLS.Visitante}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),  
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir visitante`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Visitante excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            alert('Erro ao excluir o funcionário. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ocultar(localStorage.getItem('usuarioCargo'));
    preencherTabela();
    configuracoesPaginacao();

    const acoes = {
        Pesquisar: () => {
            estadoAtual.skip = 1;
            preencherTabela(document.getElementById('text').value);
        },
        deletar: deletarVisitante,
        cadastrar: () => abrirlinks('CadastroVisitante.html'),
        alterar: () => abrirlinks('alterarVisitante.html')
    };

    Object.keys(acoes).forEach(id => 
        document.getElementById(id).addEventListener('click', acoes[id])
    );
});

