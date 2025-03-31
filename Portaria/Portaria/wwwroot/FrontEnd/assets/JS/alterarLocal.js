import { API_URLS, Token } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('usuarioId');
    const url = `${API_URLS.Local}/${id}`;

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

    if (!nome || nome.length < 2 || nome.length > 50) return alert('Campo Nome é obrigatório e deve ter entre 2 e 50 caracteres.');


    const localAtualizado = {
        id: id,
        nome: nome,
        descricao: descricao
    };

    const url = `${API_URLS.Local}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Token(),
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

    document.getElementById('atualizar').addEventListener('click', atualizarLocal);

    document.getElementById('sair').addEventListener('click', function() {
        window.close();
    });
});

