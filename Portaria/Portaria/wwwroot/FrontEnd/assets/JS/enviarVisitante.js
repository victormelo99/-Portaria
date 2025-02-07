import { Token } from './config.js';
import { API_URLS } from './config.js';

async function enviarDados(nome, cpf, motivoVisita, pessoaVisitada, botaoId) {
    const url = `${API_URLS.Visitante}`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' +  Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, cpf, motivoVisita,pessoaVisitada}),
        });

        if (response.ok) {

            document.querySelectorAll('input').forEach(input => input.value = '');
            alert('Visitante incluído com sucesso!');

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
        let cpf = document.getElementById('cpf').value;
        let motivoVisita = document.getElementById('motivoVisita').value.toUpperCase();
        let pessoaVisitada = document.getElementById('pessoaVisitada').value.toUpperCase();

        enviarDados(nome, cpf, motivoVisita, pessoaVisitada, 'salvar');
    });

    document.getElementById('salvarS').addEventListener('click', function () {
        let nome = document.getElementById('nome').value.toUpperCase();
        let cpf = document.getElementById('cpf').value;
        let motivoVisita = document.getElementById('motivoVisita').value.toUpperCase();
        let pessoaVisitada = document.getElementById('pessoaVisitada').value.toUpperCase();

        enviarDados(nome, cpf,motivoVisita,pessoaVisitada, 'salvarS');
    });

    document.getElementById('sair').addEventListener('click', function () {
        window.close();
    });
});