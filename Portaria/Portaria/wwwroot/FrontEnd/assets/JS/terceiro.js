import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas, ocultar } from './utilidades.js';

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Terceiro}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Terceiro}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
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

        const terceiro = await response.json();

        terceiro.forEach((terceiro) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = terceiro.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = terceiro.nome;
            const tdCpf = document.createElement('td');
            tdCpf.textContent = terceiro.cpf;
            const tdEmpresa = document.createElement('td');
            tdEmpresa.textContent = terceiro.empresa;
            const tdTipoServico = document.createElement('td');
            tdTipoServico.textContent = terceiro.tipoServico;
            const tdResponsavel = document.createElement('td');
            tdResponsavel.textContent = terceiro.responsavel;


            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCpf);
            tr.appendChild(tdEmpresa);
            tr.appendChild(tdTipoServico);
            tr.appendChild(tdResponsavel);

            tr.addEventListener('click', function () { selecionarLinha(this); });

            tbody.appendChild(tr);
        });

        vincularEventosLinhas();

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

export function abrirlinks(pagina) {
    if (Token()) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarTerceiro() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este terceiro?')) {
        try {
 
            const url = `${API_URLS.Terceiro}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir terceiro`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');

            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Terceiro excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            alert('Erro ao excluir o Terceiro. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const usuarioId = localStorage.getItem('usuarioId'); 
    ocultar(usuarioId);

    preencherTabela();

    document.getElementById('Pesquisar').addEventListener('click', function () {
        const pesquisa = document.getElementById('text').value;
        preencherTabela(pesquisa);
    });

    document.getElementById('deletar').addEventListener('click', function () {
        deletarTerceiro();
    });

    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinks('CadastroTerceiro.html');
    });

    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinks('alterarTerceiro.html');
    });
});

