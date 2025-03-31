import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas,ocultar } from './utilidades.js';


let estadoAtual = {
    skip: 1,
    take: 10,
    ordenDesc: true,
    totalItems: 0,
    dadosCompletos: [], 
    termoPesquisa: "" 
};


async function buscarDados(pesquisa = "") {
    try {
        const url = pesquisa.trim() !== "" 
            ? `${API_URLS.Acesso}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`
            : `${API_URLS.Acesso}`;

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

function normalizarDados(acesso) {
    return {
        Id: acesso.id,
        NomePessoa: acesso.nomePessoa,
        CpfPessoa: acesso.cpfPessoa,
        NomeLocal: acesso.nomeLocal,
        ModeloVeiculo: acesso.modeloVeiculo,
        PlacaVeiculo: acesso.placaVeiculo,
        Autorizacao: acesso.autorizacao,
        HoraEntrada: acesso.horaEntrada,
        HoraSaida: acesso.horaSaida
    };
}

function formatarData(dataISO) {
    return dataISO 
        ? new Date(dataISO).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).replace(',', '') 
        : 'NÃO REGISTRADO';
}

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    try {

        if (pesquisa !== estadoAtual.termoPesquisa || estadoAtual.dadosCompletos.length === 0) {
            await buscarDados(pesquisa);
        }

        if (estadoAtual.ordenDesc) {
            estadoAtual.dadosCompletos.sort((a, b) => b.horaEntrada.localeCompare(a.horaEntrada));
        } else {
            estadoAtual.dadosCompletos.sort((a, b) => a.horaEntrada.localeCompare(b.horaEntrada));
        }

        const acessos = paginarDados(estadoAtual.dadosCompletos);
        
        acessos.forEach((acesso) => {
            const dadosNormalizados = normalizarDados(acesso);
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = dadosNormalizados.Id;
            const tdNome = document.createElement('td');
            tdNome.textContent = dadosNormalizados.NomePessoa;
            const tdCpf = document.createElement('td');
            tdCpf.textContent = dadosNormalizados.CpfPessoa;
            const tdLocal = document.createElement('td');
            tdLocal.textContent = dadosNormalizados.NomeLocal;
            const tdVeiculo = document.createElement('td');
            tdVeiculo.textContent = dadosNormalizados.ModeloVeiculo;
            const tdPlaca = document.createElement('td');
            tdPlaca.textContent = dadosNormalizados.PlacaVeiculo;
            const tdAutorizado = document.createElement('td');
            tdAutorizado.textContent = dadosNormalizados.Autorizacao;
            const tdHoraEntrada = document.createElement('td');
            tdHoraEntrada.textContent = formatarData(dadosNormalizados.HoraEntrada);
            const tdHoraSaida = document.createElement('td');
            tdHoraSaida.textContent = formatarData(dadosNormalizados.HoraSaida);

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCpf);
            tr.appendChild(tdLocal);
            tr.appendChild(tdVeiculo);
            tr.appendChild(tdPlaca);
            tr.appendChild(tdAutorizado);
            tr.appendChild(tdHoraEntrada);
            tr.appendChild(tdHoraSaida);

            tr.addEventListener('click', function () {
                selecionarLinha(this);
            });

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
    const token = Token();
    if (token) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarAcesso() {
    const idUsuario = localStorage.getItem('usuarioId');

    if (confirm('Tem certeza que deseja excluir este acesso?')) {
        try {
            const url = `${API_URLS.Acesso}/${idUsuario}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir o acesso`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Acesso excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            alert('Erro ao excluir o acesso. Por favor, tente novamente.');
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
        deletar: deletarAcesso,
        cadastrar: () => abrirlinks('CadastroAcesso.html'),
        alterar: () => abrirlinks('alterarAcesso.html')
    };

    Object.keys(acoes).forEach(id => 
        document.getElementById(id).addEventListener('click', acoes[id])
    );
});