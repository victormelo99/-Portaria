import { API_URLS, Token } from './config.js';

let pessoas = [];

async function carregarPessoas() {
    if (pessoas.length > 0) return;

    const rotas = [API_URLS.Funcionario, API_URLS.Visitante, API_URLS.Terceiro];

    try {
        let todasAsPessoas = [];

        for (const rota of rotas) {
            const response = await fetch(rota, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + Token(), 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const dados = await response.json();
                todasAsPessoas = todasAsPessoas.concat(dados);
            }
        }

        pessoas = todasAsPessoas;

    } catch (error) {
        console.error("Erro ao carregar as pessoas:", error);
    }
}

async function preencherFormulario() {
    const id = localStorage.getItem('usuarioId');

    await carregarPessoas();

    const url = `${API_URLS.Veiculo}/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + Token(), 'Content-Type': 'application/json' },
        });

        const veiculo = await response.json();

        document.getElementById('id').value = veiculo.id;
        document.getElementById('placa').value = veiculo.placa.toUpperCase();
        document.getElementById('modelo').value = veiculo.modelo.toUpperCase();
        document.getElementById('cor').value = veiculo.cor;
        document.getElementById('tipoVeiculo').value = veiculo.tipoVeiculo;
        document.getElementById('dataRegistro').value = veiculo.dataRegistro;
        document.getElementById('IdPessoa').value = veiculo.pessoaId;
        
        const pessoaSelecionada = document.getElementById('pessoa');
        pessoaSelecionada.innerHTML = '<option value="">Selecione uma pessoa</option>';

        pessoas.forEach(pessoa => {
            const option = document.createElement('option');
            option.value = pessoa.id;
            option.textContent = pessoa.nome;
            pessoaSelecionada.appendChild(option);
        });

        const pessoaEncontrada = pessoas.find(pessoa => pessoa.id == veiculo.pessoaId);
        if (pessoaEncontrada) {
            document.getElementById('cpf').value = pessoaEncontrada.cpf || '';
            pessoaSelecionada.value = pessoaEncontrada.id;
        }

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function atualizarVeiculo() {
    const id = document.getElementById('id').value;
    const placa = document.getElementById('placa').value.toUpperCase();
    const modelo = document.getElementById('modelo').value.toUpperCase();
    const cor = document.getElementById('cor').value.toUpperCase();
    const tipoVeiculo = parseInt(document.getElementById('tipoVeiculo').value);
    const dataRegistro = new Date().toISOString();
    const pessoaId = parseInt(document.getElementById('pessoa').value);
    const pessoaSelecionada = pessoas.find(pessoa => pessoa.id === pessoaId);

    if (!placa || placa.length < 2 || placa.length > 50) return alert('O campo Placa é obrigatório e deve ter entre 2 e 50 caracteres.');
    if (!modelo || modelo.length < 2 || modelo.length > 30) return alert('O campo Modelo é obrigatório e deve ter entre 2 e 30 caracteres.');
    if (!cor || cor.length < 2 || cor.length > 20) return alert('O campo Cor é obrigatório e deve ter entre 2 e 20 caracteres.');

    const veiculoAtualizado = {
        id,
        placa,
        modelo,
        cor,
        tipoVeiculo,
        dataRegistro,
        pessoaId,
        pessoa: pessoaSelecionada
    };

    const url = `${API_URLS.Veiculo}`;

    try {
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' +  Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(veiculoAtualizado),
        });


        alert('Veículo atualizado com sucesso!');
        window.close();

    } catch (error) {
        console.error('Erro ao atualizar o veículo:', error);
    }
}

function preencherPessoaPorCPF() {
    const cpf = document.getElementById('cpf')?.value.replace(/\D/g, '');
    const selectPessoa = document.getElementById('pessoa');
    const idPessoaInput = document.getElementById('IdPessoa');

    if (cpf?.length === 11) {
        const pessoaEncontrada = pessoas.find(pessoa => pessoa.cpf === cpf);
        if (pessoaEncontrada) {
            selectPessoa.value = pessoaEncontrada.id;
            idPessoaInput.value = pessoaEncontrada.id;
        } else {
            selectPessoa.value = '';
            idPessoaInput.value = '';
            alert('Nenhuma pessoa encontrada com este CPF.');
        }
    } else {
        selectPessoa.value = '';
        idPessoaInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    preencherFormulario();
    
    document.getElementById('sair')?.addEventListener('click', () => window.close());
    
    ['atualizar'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', atualizarVeiculo);
    });

    document.getElementById('cpf')?.addEventListener('input', preencherPessoaPorCPF);
});
