import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {

    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${API_URLS.Usuario}/${id}`;

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

        const usuario = await response.json();

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
        senha: senha,
        senhaResetada: true 
    };

    const url = `${API_URLS.Usuario}/alterar-dados`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Token(),
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