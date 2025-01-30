import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';

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

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Funcionario}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Funcionario}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
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

        const funcionarios = await response.json();
        
        funcionarios.forEach((funcionario) => {
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

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherTabela(); 
});

// Função para abrir links de usuário
export function abrirlinks(pagina) {
    const token = Token();  
    if (token) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarFuncionario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        try {
            const token = Token();
            const url = `${API_URLS.Funcionario}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,  
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
            });

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir o funcionário. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Pesquisar').addEventListener('click', function () {
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

