import { Token } from './config.js';
import { API_URLS } from './config.js';

async function enviarDados(nome, descricao, botaoId) {
    const url = `${API_URLS.Local}`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' +  Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, descricao }),
        });

        if (response.ok) {

            document.querySelectorAll('input').forEach(input => input.value = '');
            alert('Local criado com sucesso!');

            if (botaoId === 'salvarS') {
                fecharAba();
            }
        }
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
    }
};

function fecharAba() {
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('salvar').addEventListener('click', function () {
        let nome = document.getElementById('nome').value.toUpperCase();
        let descricao = document.getElementById('descricao').value.toUpperCase();

        enviarDados(nome, descricao, 'salvar');
    });

    document.getElementById('salvarS').addEventListener('click', function () {
        let nome = document.getElementById('nome').value.toUpperCase();
        let descricao = document.getElementById('descricao').value.toUpperCase();

        enviarDados(nome, descricao, 'salvarS');
    });

    document.getElementById('sair').addEventListener('click', function () {
        window.close();
    });
});