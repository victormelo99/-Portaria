import { Token, API_URLS } from './config.js';

// Função para verificar se a senha foi redefinida
async function verificarSenhaResetada() {
    const token = Token();
    const usuarioId = localStorage.getItem('idUsuarioSelecionado');

    console.log('ID do usuário armazenado:', usuarioId); // Verifica se o ID está disponível

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

        // Preenche automaticamente os campos de ID, Login e Cargo
        document.getElementById('id').value = usuario.id;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('usuario').value = usuario.login;
        document.getElementById('cargo').value = usuario.cargo;

        if (usuario.senhaResetada) {
            // Se a senha já foi redefinida, redireciona para a página de redefinir senha
            if (window.location.pathname !== '/frontend/assets/HTML/resetSenha.html') {
                window.location.href = '/frontend/assets/HTML/resetSenha.html';
            }
        }

    } catch (error) {
        console.error('Erro ao verificar a senha redefinida:', error);
    }
}

// Função para atualizar a senha
async function atualizarSenha() {
    const token = Token();
    const usuarioId = document.getElementById('id').value;  
    const nome = document.getElementById('nome').value;
    const login = document.getElementById('usuario').value;
    const cargo = document.getElementById('cargo').value;
    const senha = document.getElementById('password').value;
    const confirmarSenha = document.getElementById('ConfirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem. Tente novamente.');
        return;
    }

    const usuarioAtualizado = {
        Id: usuarioId,    
        Nome: nome,      // 🔹 Adicionando Nome
        Login: login,    // 🔹 Adicionando Login
        Cargo: cargo,    // 🔹 Adicionando Cargo
        Senha: senha,    
        SenhaResetada: true 
    };

    try {
        const response = await fetch(API_URLS.Usuario, {  
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioAtualizado),
        });

        if (response.ok) {
            alert('Senha atualizada com sucesso!');
        } else {
            const errorText = await response.text();
            alert(`Erro: ${errorText}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
    }
}


document.addEventListener('DOMContentLoaded', verificarSenhaResetada);
document.getElementById('Atualizar').addEventListener('click', atualizarSenha);