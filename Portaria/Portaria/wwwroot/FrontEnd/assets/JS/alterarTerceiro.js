import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const token = Token();
    const url = `${API_URLS.Terceiro}/${id}`;

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

        const terceiro = await response.json();

        document.getElementById('id').value = terceiro.id;
        document.getElementById('nome').value = terceiro.nome.toUpperCase();
        document.getElementById('cpf').value = terceiro.cpf;
        document.getElementById('empresa').value = terceiro.empresa;
        document.getElementById('tipoServico').value = terceiro.tipoServico;
        document.getElementById('responsavel').value = terceiro.responsavel;

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function atualizarTerceiro() {
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value.toUpperCase();
    const cpf = document.getElementById('cpf').value.toUpperCase();
    const empresa = document.getElementById('empresa').value.toUpperCase();
    const tipoServico = document.getElementById('tipoServico').value.toUpperCase();
    const responsavel = document.getElementById('responsavel').value.toUpperCase();


    const terceiroAtualizado = {
        id: id,
        nome: nome,
        cpf: cpf,
        empresa: empresa,
        tipoServico: tipoServico,
        responsavel: responsavel
    };

    const token = Token();
    const url = `${API_URLS.Terceiro}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(terceiroAtualizado),
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
        }

        alert('Terceiro atualizado com sucesso!');
        window.close();

    } catch (error) {
        console.error('Erro ao atualizar o terceiro:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherFormulario();

    document.getElementById('sair').addEventListener('click', function() {
        window.close();
    });
});

document.getElementById('atualizar').addEventListener('click', atualizarTerceiro);