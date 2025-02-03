import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Acesso}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Acesso}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
    }

    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
        }

        const acessos = await response.json();

        function formatarData(dataISO) {
            if (!dataISO) return 'NÃO REGISTRADO';
            const data = new Date(dataISO);
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(',', '');
        }


        acessos.forEach((acesso) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = acesso.id;

            const tdNome = document.createElement('td');
            tdNome.textContent = acesso.pessoa?.nome;

            const tdCpf = document.createElement('td');
            tdCpf.textContent = acesso.pessoa.cpf;

            const tdLocal = document.createElement('td');
            tdLocal.textContent = acesso.local?.nome;

            const tdVeiculo = document.createElement('td');
            tdVeiculo.textContent = acesso.veiculo?.modelo;

            const tdPlaca = document.createElement('td');
            tdPlaca.textContent = acesso.veiculo?.placa;

            const tdAutorizado = document.createElement('td');
            tdAutorizado.textContent = acesso.autorizacao;

            const tdHoraEntrada = document.createElement('td');
            tdHoraEntrada.textContent = formatarData(acesso.horaEntrada)
            
            const tdHoraSaida = document.createElement('td');
            tdHoraSaida.textContent = formatarData(acesso.horaSaida);

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