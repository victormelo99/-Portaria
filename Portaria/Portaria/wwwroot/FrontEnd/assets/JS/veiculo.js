// veiculo.js
import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas, ocultar} from './utilidades.js';

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
            ? `${API_URLS.Veiculo}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`
            : `${API_URLS.Veiculo}`;

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

function tipoVeiculo(VeiculoNumero) {
    switch (VeiculoNumero) {
        case 0:
            return 'MOTO';
        case 1:
            return 'CARRO';
        case 2:
            return 'CAMINHÃO';
        default:
            return 'DESCONHECIDO';
    }
}

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    try {

        if (pesquisa !== estadoAtual.termoPesquisa || estadoAtual.dadosCompletos.length === 0) {
            await buscarDados(pesquisa);
        }

        if (estadoAtual.ordenDesc) {
            estadoAtual.dadosCompletos.sort((a, b) => b.modelo.localeCompare(a.modelo));
        } else {
            estadoAtual.dadosCompletos.sort((a, b) => a.modelo.localeCompare(b.modelo));
        }

        const veiculos = paginarDados(estadoAtual.dadosCompletos);

        veiculos.forEach((veiculo) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = veiculo.id;
            const tdModelo = document.createElement('td');
            tdModelo.textContent = veiculo.modelo;
            const tdPlaca = document.createElement('td');
            tdPlaca.textContent = veiculo.placa;
            const tdCor = document.createElement('td');
            tdCor.textContent = veiculo.cor;
            const tdTipoVeiculo = document.createElement('td');
            tdTipoVeiculo.textContent = tipoVeiculo(veiculo.tipoVeiculo);
            const tdCpf = document.createElement('td');
            tdCpf.textContent = veiculo.pessoa?.cpf || 'N/A';
            const tdNome = document.createElement('td');
            tdNome.textContent = veiculo.pessoa?.nome || 'N/A';

            tr.appendChild(tdId);
            tr.appendChild(tdModelo);
            tr.appendChild(tdPlaca);
            tr.appendChild(tdCor);
            tr.appendChild(tdTipoVeiculo);
            tr.appendChild(tdCpf);
            tr.appendChild(tdNome);

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
    if (Token()) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarVeiculo() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        try {
            const url = `${API_URLS.Veiculo}/${idUsuario}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir o veículo`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Veículo excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            alert('Erro ao excluir o veículo. Por favor, tente novamente.');
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
        deletar: deletarVeiculo,
        cadastrar: () => abrirlinks('CadastroVeiculo.html'),
        alterar: () => abrirlinks('AlterarVeiculo.html')
    };

    Object.keys(acoes).forEach(id => 
        document.getElementById(id).addEventListener('click', acoes[id])
    );
});