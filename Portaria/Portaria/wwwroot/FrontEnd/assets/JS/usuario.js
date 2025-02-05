import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';


async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Usuario}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Usuario}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
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

        const usuarios = await response.json();
        
        usuarios.forEach((usuario) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = usuario.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = usuario.nome;
            const tdCargo = document.createElement('td');
            tdCargo.textContent = usuario.cargo;
            const tdLogin = document.createElement('td');
            tdLogin.textContent = usuario.login;

            const tdSenha = document.createElement('td');
            tdSenha.textContent = '******';

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCargo);
            tr.appendChild(tdLogin);
            tr.appendChild(tdSenha);

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

export function abrirlinksUsuario(pagina) {
    const token = Token();  
    if (token) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarUsuario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            const token = Token();
            const url = `${API_URLS.Usuario}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,  
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir usuário`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Usuário excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir usuário. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Pesquisar').addEventListener('click', function () {
        const pesquisa = document.getElementById('text').value;
        preencherTabela(pesquisa);
    });

    document.getElementById('deletar').addEventListener('click', function () {
        deletarUsuario();
    });

    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinksUsuario('CadastroUsuario.html');
    });

    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinksUsuario('AlterarUsuario.html');
    });
});

