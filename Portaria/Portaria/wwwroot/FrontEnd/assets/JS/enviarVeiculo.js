import { Token } from './config.js';
import { API_URLS } from './config.js';

let pessoas = [];

async function carregarPessoas() {
    const rotas = [API_URLS.Funcionario, API_URLS.Visitante, API_URLS.Terceiro];

    try {
        let todasPessoas = [];

        for (let rota of rotas) {
            const response = await fetch(rota, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' +  Token(),
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const pessoasEncontradas = await response.json();
                todasPessoas = todasPessoas.concat(pessoasEncontradas);
            }
        }

        pessoas = todasPessoas;
        const selectPessoa = document.getElementById('pessoa');
        if (selectPessoa) {
            selectPessoa.innerHTML = '<option value="">Selecione uma pessoa</option>';
            pessoas.forEach(pessoa => {
                const option = document.createElement('option');
                option.value = pessoa.id;
                option.textContent = `${pessoa.nome}`;
                selectPessoa.appendChild(option);
            });
        }
    } catch (error) {
        alert('Não foi possível carregar a lista de pessoas. Tente novamente.');
    }
}

function preencherPessoaPorCPF() {
    const cpf = document.getElementById('cpf')?.value;
    const selecionarPessoa = document.getElementById('pessoa');
    const idPessoaInput = document.getElementById('IdPessoa');

    if (cpf?.length === 11) {
        const pessoa = pessoas.find(p => p.cpf === cpf);
        if (pessoa) {
            selecionarPessoa.value = pessoa.id;
            idPessoaInput.value = pessoa.id;
        } else {
            selecionarPessoa.value = '';
            idPessoaInput.value = '';
            alert('Nenhuma pessoa encontrada com este CPF.');
        }
    } else {
        selecionarPessoa.value = '';
        idPessoaInput.value = '';
    }
}
export async function enviarDados(botaoId) {
    const url = `${API_URLS.Veiculo}`;

    try {
        const placa = document.getElementById('placa').value.toUpperCase();
        const modelo = document.getElementById('modelo').value.toUpperCase();
        const cor = document.getElementById('cor').value.toUpperCase();
        const tipoVeiculo = parseInt(document.getElementById('tipoVeiculo').value);
        const dataRegistro = new Date().toISOString();
        const pessoaId = parseInt(document.getElementById('pessoa').value);
        const pessoaSelecionada = pessoas.find(pessoa => pessoa.id === pessoaId);

        const dados = {
            placa: placa,
            modelo: modelo,
            cor: cor,
            tipoVeiculo: tipoVeiculo,
            dataRegistro: dataRegistro,
            pessoaId: pessoaId,
            pessoa: pessoaSelecionada
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
            document.getElementById('pessoa').value = '';
            alert('Veículo cadastrado com sucesso!');

            if (botaoId === 'salvarS') { window.close(); }
        }
    } catch (error) {
        alert(`Erro ao processar a requisição: ${error.message}`);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
    document.getElementById('cpf')?.addEventListener('input', preencherPessoaPorCPF);
    ['salvar', 'salvarS'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => enviarDados(id));
    });
    document.getElementById('sair')?.addEventListener('click', () => window.close());
});