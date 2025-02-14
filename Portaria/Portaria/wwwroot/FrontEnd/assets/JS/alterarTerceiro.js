import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${API_URLS.Terceiro}/${id}`;

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

    if (!nome || nome.length < 2 || nome.length > 50) return alert('Nome deve ter entre 2 e 50 caracteres.');
    if (!cpf || cpf.length !== 11) return alert('CPF inválido.');
    if (!empresa) return alert('Empresa é obrigatória.');
    if (!tipoServico) return alert('Tipo de serviço é obrigatório.');
    if (!responsavel) return alert('Responsável é obrigatório.');

    const terceiroAtualizado = {
        id: id,
        nome: nome,
        cpf: cpf,
        empresa: empresa,
        tipoServico: tipoServico,
        responsavel: responsavel
    };

    const url = `${API_URLS.Terceiro}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' +  Token(),
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

    document.getElementById('atualizar').addEventListener('click', atualizarTerceiro);

    document.getElementById('sair').addEventListener('click', function() {
        window.close();
    });
});