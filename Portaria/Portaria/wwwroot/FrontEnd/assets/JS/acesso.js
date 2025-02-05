import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';

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

    let url = `${API_URLS.Acesso}`;
    if (pesquisa.trim() !== "") { url = `${API_URLS.Acesso}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;}

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        const acessos = await response.json();
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
    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
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
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

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

document.addEventListener('DOMContentLoaded', function () {
    preencherTabela();

    document.getElementById('Pesquisar').addEventListener('click', function () {
        const pesquisa = document.getElementById('text').value;
        preencherTabela(pesquisa);
    });

    document.getElementById('deletar').addEventListener('click', function () {
        deletarAcesso();
    });

    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinks('CadastroAcesso.html');
    });

    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinks('AlterarAcesso.html');
    });
});