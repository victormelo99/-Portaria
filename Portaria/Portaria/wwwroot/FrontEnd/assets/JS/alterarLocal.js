import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');

    if (!id) {
        alert('Nenhum local selecionado!');
        return;
    }

    const token = Token();
    const url = `${API_URLS.Local}/${id}`;

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

        const local = await response.json();

        document.getElementById('id').value = local.id;
        document.getElementById('nome').value = local.nome.toUpperCase();
        document.getElementById('descricao').value = local.descricao.toUpperCase();

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function atualizarLocal() {
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value.toUpperCase();
    const descricao = document.getElementById('descricao').value.toUpperCase();

    const localAtualizado = {
        id: id,
        nome: nome,
        descricao: descricao
    };

    const token = Token();
    const url = `${API_URLS.Local}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(localAtualizado),
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
        }

        alert('Local atualizado com sucesso!');
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

document.getElementById('atualizar').addEventListener('click', atualizarLocal);