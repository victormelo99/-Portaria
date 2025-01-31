import { Token } from './config.js';
import { API_URLS } from './config.js';

let pessoas = []; // Armazena a lista de pessoas carregadas

// Função para carregar pessoas das rotas de Funcionário, Visitante e Terceiro
async function carregarPessoas() {
    const token = Token();
    const rotas = [
        API_URLS.Funcionario, 
        API_URLS.Visitante, 
        API_URLS.Terceiro
    ];

    try {
        let todasPessoas = []; // Armazena todas as pessoas encontradas

        // Itera sobre as rotas para buscar pessoas
        for (let rota of rotas) {
            const response = await fetch(rota, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const pessoasEncontradas = await response.json();
                todasPessoas = todasPessoas.concat(pessoasEncontradas);
            } else {
                console.error(`Erro ao buscar pessoas na rota: ${rota}`);
            }
        }

        if (todasPessoas.length === 0) {
            throw new Error('Nenhuma pessoa encontrada em todas as rotas.');
        }

        pessoas = todasPessoas; // Atualiza a lista global de pessoas
        const selectPessoa = document.getElementById('pessoa');
        if (selectPessoa) {
            selectPessoa.innerHTML = '<option value="">Selecione uma pessoa</option>'; // Limpa o select
            pessoas.forEach(pessoa => {
                const option = document.createElement('option');
                option.value = pessoa.id;
                option.textContent = `${pessoa.nome} (${pessoa.cpf})`; // Exibe nome e CPF
                selectPessoa.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro crítico ao carregar pessoas:', error);
        alert('Não foi possível carregar a lista de pessoas. Tente novamente.');
    }
}

// Função para preencher a pessoa no select ao digitar o CPF
function preencherPessoaPorCPF() {
    const cpfInput = document.getElementById('cpf');
    const selectPessoa = document.getElementById('pessoa');

    if (cpfInput && selectPessoa) {
        const cpf = cpfInput.value;
        const pessoaEncontrada = pessoas.find(pessoa => pessoa.cpf === cpf);

        if (pessoaEncontrada) {
            selectPessoa.value = pessoaEncontrada.id; // Seleciona a pessoa no select
        } else {
            selectPessoa.value = '';
            alert('Nenhuma pessoa encontrada com este CPF.');
        }
    }
}

export async function enviarDados(botaoId) {
    const url = `${API_URLS.Veiculo}`;

    try {
        // Captura os valores dos campos do formulário
        const placa = document.getElementById('placa').value.toUpperCase();
        const modelo = document.getElementById('modelo').value.toUpperCase();
        const cor = document.getElementById('cor').value.toUpperCase();
        const tipoVeiculo = parseInt(document.getElementById('tipoVeiculo').value);
        const pessoaId = parseInt(document.getElementById('pessoa').value);
        const cpf = document.getElementById('cpf').value;

        // Validações dos campos
        const validacoes = [
            { condicao: !placa, mensagem: 'Placa é obrigatória' },
            { condicao: !modelo, mensagem: 'Modelo é obrigatório' },
            { condicao: !cor, mensagem: 'Cor é obrigatória' },
            { condicao: isNaN(tipoVeiculo), mensagem: 'Tipo de veículo inválido' },
            { condicao: isNaN(pessoaId) || pessoaId <= 0, mensagem: 'Pessoa não selecionada' },
            { condicao: !cpf || cpf.length !== 11, mensagem: 'CPF inválido' }
        ];

        // Verifica se há erros de validação
        const erroValidacao = validacoes.find(val => val.condicao);
        if (erroValidacao) {
            alert(erroValidacao.mensagem);
            return;
        }

        // Busca a pessoa selecionada na lista de pessoas
        const pessoaSelecionada = pessoas.find(pessoa => pessoa.id === pessoaId);

        if (!pessoaSelecionada) {
            alert('Pessoa selecionada não encontrada.');
            return;
        }

        const token = Token();
        const dados = {
            placa: placa,
            modelo: modelo,
            cor: cor,
            tipoVeiculo: tipoVeiculo,
            pessoaId: pessoaId,
            pessoa: {
                id: pessoaId,
                nome: pessoaSelecionada.nome, // Usa o nome da pessoa selecionada
                cpf: pessoaSelecionada.cpf // Usa o CPF da pessoa selecionada
            }
        };

        console.log('Dados enviados:', dados);

        // Envia a requisição para a API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            // Limpa os campos do formulário após o sucesso
            document.querySelectorAll('input').forEach(input => input.value = '');
            document.getElementById('pessoa').value = '';
            alert('Veículo cadastrado com sucesso!');
            
            // Fecha a janela se o botão for "Salvar e Sair"
            if (botaoId === 'salvarS') {
                window.close(); 
            }
        } else {
            // Trata erros da API
            const errorResponse = await response.json();
            console.error('Detalhes do erro:', errorResponse);
            
            const errorMessage = errorResponse.errors 
                ? Object.values(errorResponse.errors).flat().join(', ')
                : (errorResponse.message || 'Erro desconhecido ao cadastrar veículo');
            
            alert(`Erro: ${errorMessage}`);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        alert(`Erro ao processar a requisição: ${error.message}`);
    }
}

// Configura os eventos quando a página é carregada
document.addEventListener('DOMContentLoaded', function () {
    carregarPessoas(); // Carrega as pessoas ao iniciar

    // Configura o evento de input para o campo CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', preencherPessoaPorCPF);
    }

    // Configura o evento de clique para o botão "Salvar"
    const salvarButton = document.getElementById('salvar');
    if (salvarButton) {
        salvarButton.addEventListener('click', () => enviarDados('salvar'));
    }

    // Configura o evento de clique para o botão "Salvar e Sair"
    const salvarSButton = document.getElementById('salvarS');
    if (salvarSButton) {
        salvarSButton.addEventListener('click', () => enviarDados('salvarS'));
    }

    // Configura o evento de clique para o botão "Sair"
    const sairButton = document.getElementById('sair');
    if (sairButton) {
        sairButton.addEventListener('click', () => window.close());
    }
});