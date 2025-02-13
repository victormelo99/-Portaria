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

        const funcionario = paginarDados(estadoAtual.dadosCompletos);
        
        funcionario.forEach((funcionario) => {
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
            
            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            })

        } catch (error) {
            alert('Erro ao excluir o funcionário. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ocultar(localStorage.getItem('usuarioId'));
    preencherTabela();
    configuracoesPaginacao();

    const acoes = {
        Pesquisar: () => {
            estadoAtual.skip = 1;
            preencherTabela(document.getElementById('text').value);
        },
        deletar: deletarFuncionario,
        cadastrar: () => abrirlinks('CadastroFuncionario.html'),
        alterar: () => abrirlinks('alterarFuncionario.html')
    };

    Object.entries(acoes).forEach(([id, acoes]) => 
        document.getElementById(id).addEventListener('click', acoes)
    );
});
