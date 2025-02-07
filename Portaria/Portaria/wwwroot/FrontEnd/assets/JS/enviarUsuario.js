import { Token } from './config.js';
import { API_URLS } from './config.js';

export async function enviarDados(nome, login, cargo, senha, botaoId) {
    const url = `${API_URLS.Usuario}`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' +  Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, login, cargo, senha }),
        });

        if (response.ok) {
            document.querySelectorAll('input').forEach(input => input.value = '');
            alert('Usuário criado com sucesso!');
            if (botaoId === 'salvarS') {
                window.close();
            }
        }
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('salvar').addEventListener('click', function () {
        let nome = document.getElementById('nome').value.toUpperCase();
        let login = document.getElementById('login').value;
        let cargo = document.getElementById('cargo').value.toUpperCase();
        let senha = document.getElementById('senha').value;

        enviarDados(nome, login, cargo, senha, 'salvar');
    });

    document.getElementById('salvarS').addEventListener('click', function () {
        let nome = document.getElementById('nome').value.toUpperCase();
        let login = document.getElementById('login').value;
        let cargo = document.getElementById('cargo').value.toUpperCase();
        let senha = document.getElementById('senha').value;

        enviarDados(nome, login, cargo, senha, 'salvarS');
    });

    document.getElementById('sair').addEventListener('click', function () {
        window.close();
    });
});

