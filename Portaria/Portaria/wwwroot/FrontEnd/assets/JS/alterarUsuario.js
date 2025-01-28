import { Token } from './config.js';  // Importa a função Token
import { API_URLS } from './config.js';

// Função para preencher os campos do formulário com os dados do usuário
async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');

    if (!id) {
        alert('Nenhum usuário selecionado!');
        return;
    }

    const token = Token();
    const url = `${API_URLS.Usuario}/${id}`;

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

        // Preenche os campos do formulário com os dados do usuário
        document.getElementById('id').value = usuario.id;
        document.getElementById('nome').value = usuario.nome.toUpperCase();
        document.getElementById('cargo').value = usuario.cargo.toUpperCase();
        document.getElementById('login').value = usuario.login;
        document.getElementById('senha').value = usuario.senha;
        document.getElementById('confirmarSenha').value = usuario.senha;

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

// Função para atualizar o usuário
async function atualizarUsuario() {
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value.toUpperCase();
    const cargo = document.getElementById('cargo').value.toUpperCase();
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const usuarioAtualizado = {
        id: id,
        nome: nome,
        cargo: cargo,
        login: login,
        senha: senha
    };

    const token = Token();
    const url = `${API_URLS.Usuario}`;

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

        alert('Usuário atualizado com sucesso!');
        window.close();

    } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherFormulario();

    document.getElementById('sair').addEventListener('click', function() {
        window.close();
    });
});

document.getElementById('Atualizar').addEventListener('click', atualizarUsuario);