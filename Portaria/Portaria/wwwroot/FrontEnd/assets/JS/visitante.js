import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Visitante}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Visitante}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
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

        const visitante = await response.json();
        
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

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherTabela(); 
});


export function abrirlinks(pagina) {
    const token = Token();  
    if (token) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarVisitante() {
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

    // Evento clique botão deletar
    document.getElementById('deletar').addEventListener('click', function () {
        deletarVisitante();
    });

    // Evento clique botão cadastrar
    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinks('CadastroVisitante.html');
    });

    // Evento clique botão alterar
    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinks('alterarVisitante.html');
    });
});

