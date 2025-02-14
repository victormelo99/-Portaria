import { API_URLS, Token } from './config.js';

export async function enviarDados(botaoId) {
    const url = `${API_URLS.Usuario}`;

    try {
        let nome = document.getElementById('nome').value.toUpperCase();
        let login = document.getElementById('login').value;
        let cargo = document.getElementById('cargo').value.toUpperCase();
        let senha = document.getElementById('senha').value;
        let confirmarSenha = document.getElementById('confirmarSenha').value;

        if (!nome || nome.length > 30) return alert('Campo nome é obrigatório e não pode ter mais do que 30 caracteres.');
        if (!login || login.length > 30) return alert('Campo Login é obrigatório e não pode ter mais do que 30 caracteres.');
        if (!cargo || cargo.length < 2) return alert('Cargo é obrigatório.');
        if (!senha || senha.length < 8 || senha.length > 16) return alert('Senha é obrigatória e deve estar entre 8 e 16 caracteres.');
        if (senha !== confirmarSenha) return alert('As senhas não coincidem.');

        const dados = {
            nome: nome,
            login: login,
            cargo: cargo,
            senha: senha,
            senhaResetada: true
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            document.querySelectorAll('input').forEach(input => input.value = '');
            alert('Usuário criado com sucesso!');
            if (botaoId === 'salvarS') {
                window.close();
            }
        } else {
            throw new Error('Erro ao cadastrar o usuário');
        }
    } catch (error) {
        alert('Erro ao processar a requisição: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ['salvar', 'salvarS'].forEach(id =>
        document.getElementById(id)?.addEventListener('click', () => enviarDados(id))
    );

    document.getElementById('sair')?.addEventListener('click', () => window.close());
});
