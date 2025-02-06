import { Token, API_URLS } from './config.js';

async function verificarSenhaResetada() {
    const token = Token();
    const usuarioId = localStorage.getItem('idUsuarioSelecionado');

    console.log('ID do usuário armazenado:', usuarioId); 

    if (!usuarioId) {
        console.error('Nenhum ID de usuário encontrado.');
        alert('Erro: ID de usuário não encontrado. Verifique o login.');
        return;
    }

    const url = `${API_URLS.Usuario}/${usuarioId}`;
    console.log('Buscando usuário na API:', url);

    try {
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

        const usuario = await response.json();
        console.log('Dados do usuário:', usuario);

        document.getElementById('id').value = usuario.id;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('login').value = usuario.login;
        document.getElementById('cargo').value = usuario.cargo;

        if (usuario.senhaResetada) {
            if (window.location.pathname !== '/frontend/assets/HTML/resetSenha.html') {
                window.location.href = '/frontend/assets/HTML/resetSenha.html';
            }
        }

    } catch (error) {
        console.error('Erro ao verificar a senha redefinida:', error);
    }
}

// Função para atualizar a senha
async function resetarSenha() {
    const id = document.getElementById('id').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const nome = document.getElementById('nome').value;
    const login = document.getElementById('login').value; 
    const cargo = document.getElementById('cargo').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const usuarioAtualizado = {
        id: id,
        nome: nome,
        login: login,
        cargo: cargo,
        senha: senha,
        senhaResetada: false
    };

    const token = Token();
    const url = `${API_URLS.Usuario}/resetar-senha`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioAtualizado),
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
        }

        alert('Senha resetada com sucesso!');
        window.location.href = "../../index.html";

    } catch (error) {
        console.error('Erro ao resetar a senha:', error);
    }
}


document.addEventListener('DOMContentLoaded', verificarSenhaResetada);
document.getElementById('Atualizar').addEventListener('click', resetarSenha);