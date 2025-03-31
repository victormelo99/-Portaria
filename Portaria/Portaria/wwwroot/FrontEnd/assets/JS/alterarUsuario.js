import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {

    const id = localStorage.getItem('usuarioId');
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
    const url = `${API_URLS.Usuario}/alterar-dados`;

    try {
        const id = document.getElementById('id').value;
        let nome = document.getElementById('nome').value.toUpperCase();
        let cargo = document.getElementById('cargo').value.toUpperCase();
        let login = document.getElementById('login').value;
        let senha = document.getElementById('senha').value;
        let confirmarSenha = document.getElementById('confirmarSenha').value;

        if (!nome ||  nome.length > 30) return alert('Campo Nome é obrigatório e  não pode ter mais do que 30 caracteres.');
        if (!login || login.length > 30) return alert('Campo Login é obrigatório e  não pode ter mais do que 30 caracteres.');
        if (!cargo || cargo.length > 30) return alert('Campo Cargo é obrigatório');
        if (senha !== confirmarSenha) return alert('As senhas não coincidem!');
        if (!senha || senha.length < 8 || senha.length > 16) return alert('"O campo Senha não pode ter mais do que 16 e menos que 8 caracteres');

        const usuarioAtualizado = {
            id: id,
            nome: nome,
            login: login,
            senha: senha,
            cargo: cargo,
            senhaResetada: true
        };

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
        alert('Erro ao atualizar o usuário: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherFormulario();

    document.getElementById('Atualizar').addEventListener('click', atualizarUsuario);

    document.getElementById('sair').addEventListener('click', function() {
        window.close();
    });
});

