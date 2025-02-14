import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${API_URLS.Visitante}/${id}`;

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
        const visitante = await response.json();

        document.getElementById('id').value = visitante.id;
        document.getElementById('nome').value = visitante.nome.toUpperCase();
        document.getElementById('cpf').value = visitante.cpf;
        document.getElementById('motivoVisita').value = visitante.motivoVisita.toUpperCase();
        document.getElementById('pessoaVisitada').value = visitante.pessoaVisitada.toUpperCase();

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function atualizarVisitante() {
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value.toUpperCase();
    const cpf = document.getElementById('cpf').value.toUpperCase();
    const motivoVisita = document.getElementById('motivoVisita').value.toUpperCase();
    const pessoaVisitada = document.getElementById('pessoaVisitada').value.toUpperCase();

    if (!nome || nome.length < 2 || nome.length > 50) return alert('Campo Nome é obrigatório e deve ter entre 2 e 50 caracteres.');
    if (!cpf || cpf.length !== 11) return alert('CPF inválido.');

    const localAtualizado = {
        id: id,
        nome: nome,
        cpf: cpf,
        motivoVisita: motivoVisita,
        pessoaVisitada: pessoaVisitada
    };

    const url = `${API_URLS.Visitante}`;

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

        alert('Dados do visitante atualizado com sucesso!');
        window.close();

    } catch (error) {
        console.error('Erro ao atualizar o visitante:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherFormulario();

    document.getElementById('atualizar').addEventListener('click', atualizarVisitante);

    document.getElementById('sair').addEventListener('click', function() {
        window.close();
    });
});

