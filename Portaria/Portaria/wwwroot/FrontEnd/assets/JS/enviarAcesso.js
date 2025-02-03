import { Token } from './config.js';
import { API_URLS } from './config.js';

let pessoas = [];
let locais = [];
let veiculos = [];

async function carregarDados() {
    const rotasPessoas = [API_URLS.Funcionario, API_URLS.Visitante, API_URLS.Terceiro];
    const rotaVeiculos = API_URLS.Veiculo;
    const rotaLocais = API_URLS.Local;

    try {
        let todasPessoas = [];
        let todosVeiculos = [];
        let todosLocais = [];

        for (let rota of rotasPessoas) {
            const response = await fetch(rota, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const pessoasEncontradas = await response.json();
                todasPessoas = todasPessoas.concat(pessoasEncontradas);
            }
        }

        const responseVeiculos = await fetch(rotaVeiculos, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        if (responseVeiculos.ok) {
            todosVeiculos = await responseVeiculos.json();
        }

        const responseLocais = await fetch(rotaLocais, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        if (responseLocais.ok) {
            todosLocais = await responseLocais.json();
        }

        pessoas = todasPessoas;
        veiculos = todosVeiculos;
        locais = todosLocais;

        preencherLocaisSelecionados();
    } catch (error) {
        alert('Não foi possível carregar os dados. Tente novamente.');
    }
}

function preencherLocaisSelecionados() {
    const localSelecionado = document.getElementById('local');
    if (localSelecionado) {
        localSelecionado.innerHTML = '<option value="">Selecione um local</option>';
        locais.forEach(local => {
            const opcao = document.createElement('option');
            opcao.value = local.id;
            opcao.textContent = local.nome;
            localSelecionado.appendChild(opcao);
        });
    }
}

function formatarDataHora(data) {
    if (typeof data === 'string') {
        data = new Date(data);
    }

    if (data instanceof Date && !isNaN(data)) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        const segundo = String(data.getSeconds()).padStart(2, '0');  // Adicionando segundos

        return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
    } else {
        // Retorna um valor padrão ou uma string vazia caso a data seja inválida
        return '';
    }
}


function preencherPessoa(pessoa) {
    const cpfInput = document.getElementById('cpf');
    const nomeInput = document.getElementById('nome');
    const idPessoaInput = document.getElementById('IdPessoa');
    const placaInput = document.getElementById('placa');
    const veiculoSelect = document.getElementById('veiculo');
    const horaEntradaInput = document.getElementById('horaEntrada');

    const horaSaidaInput = document.getElementById('horaSaída');

    if (cpfInput) cpfInput.value = pessoa.cpf;
    if (nomeInput) nomeInput.value = pessoa.nome;
    if (idPessoaInput) idPessoaInput.value = pessoa.id;

    const veiculosPessoa = veiculos.filter(v => v.pessoaId === pessoa.id);

    veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';
    placaInput.value = '';

    if (veiculosPessoa.length > 0) {
        veiculosPessoa.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.placa;
            option.textContent = `${veiculo.modelo}`;
            veiculoSelect.appendChild(option);
        });

        if (veiculosPessoa.length === 1) {
            veiculoSelect.value = veiculosPessoa[0].placa;
            placaInput.value = veiculosPessoa[0].placa;
        }
    } else {
        const option = document.createElement('option');
        option.value = '----';
        option.textContent = '----';
        veiculoSelect.appendChild(option);
        veiculoSelect.value = null;
        placaInput.value = null;
    }

    if (horaEntradaInput && pessoa.horaEntrada) {
        const horaEntrada = new Date(pessoa.horaEntrada);
        horaEntradaInput.value = formatarDataHora(horaEntrada);
    } else {
        horaEntradaInput.value = '';
    }

    if (horaSaidaInput && pessoa.horaSaida) {
        const horaSaida = new Date(pessoa.horaSaida);
        horaSaidaInput.value = formatarDataHora(horaSaida);
    } else {
        horaSaidaInput.value = '';
    }
}

document.getElementById('veiculo').addEventListener('change', function () {
    const placaInput = document.getElementById('placa');
    const veiculoSelecionado = this.value;

    if (veiculoSelecionado) {
        const veiculoEncontrado = veiculos.find(v => v.placa.toUpperCase().trim() === veiculoSelecionado.toUpperCase().trim());
        if (veiculoEncontrado) {
            placaInput.value = veiculoEncontrado.placa;
        }
    } else {
        placaInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    document.getElementById('pesquisarCpf').addEventListener('click', () => buscarDados('cpf'));
    document.getElementById('pesquisarNome').addEventListener('click', () => buscarDados('nome'));
    document.getElementById('pesquisarPlaca').addEventListener('click', () => buscarDados('placa'));
});

function buscarDados(campo) {
    let input = document.getElementById(campo);
    let inputValue = input.value.trim();

    if (!inputValue) {
        alert(`Por favor, preencha o campo ${campo}.`);
        return;
    }

    if (campo === 'placa') {
        inputValue = inputValue.toUpperCase().trim();
    } else if (campo === 'cpf') {
        inputValue = inputValue.replace(/\D/g, '');
    } else {
        inputValue = inputValue.toLowerCase();
    }

    let resultado;

    switch (campo) {
        case 'cpf':
            resultado = pessoas.find(p => p.cpf.replace(/\D/g, '') === inputValue);
            break;
        case 'nome':
            resultado = pessoas.find(p => p.nome.toLowerCase().includes(inputValue));
            break;
        case 'placa':
            resultado = veiculos.find(v => v.placa.toUpperCase().trim() === inputValue);
            break;
        default:
            alert('Campo inválido.');
            return;
    }

    if (resultado) {
        if (campo === 'placa') {
            const veiculoSelect = document.getElementById('veiculo');
            const placaInput = document.getElementById('placa');

            veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';

            const option = document.createElement('option');
            option.value = resultado.placa;
            option.textContent = `${resultado.modelo}`;
            veiculoSelect.appendChild(option);

            veiculoSelect.value = resultado.placa;
            placaInput.value = resultado.placa;

            if (resultado.pessoaId) {
                const pessoaAssociada = pessoas.find(p => p.id === resultado.pessoaId);
                if (pessoaAssociada) {
                    document.getElementById('cpf').value = pessoaAssociada.cpf;
                    document.getElementById('nome').value = pessoaAssociada.nome;
                }
            } else {
                alert('Veículo não possui pessoa associada.');
            }
        } else {
            preencherPessoa(resultado);
        }
    } else {
        alert(`Nenhum resultado encontrado para ${campo}.`);
    }
} 


export async function enviarDados(botaoId) {
    const url = `${API_URLS.Acesso}`;

    try {
        const [nomeInput, cpfInput, localInput, placaInput, idPessoaInput, horaEntradaInput, horaSaidaInput, autorizacaoInput] =
            ['nome', 'cpf', 'local', 'placa', 'IdPessoa', 'horaEntrada', 'horaSaida', 'autorizacao']
                .map(id => document.getElementById(id));

        if ([nomeInput, cpfInput, localInput, placaInput, idPessoaInput, horaEntradaInput, horaSaidaInput, autorizacaoInput].some(el => !el)) {
            console.error('Um ou mais elementos do formulário não foram encontrados.');
            return;
        }

        const nome = nomeInput.value.toUpperCase();
        const cpf = cpfInput.value;
        const localId = parseInt(localInput.value);
        const localSelecionado = locais.find(local => local.id === localId);
        const placa = placaInput.value;
        const veiculoSelecionado = veiculos.find(veiculo => veiculo.placa === placa) || null;
        const pessoaId = parseInt(idPessoaInput.value);
        const pessoaSelecionada = pessoas.find(pessoa => pessoa.id == pessoaId) || null;
        const horaEntrada = formatarDataHora(new Date(horaEntradaInput.value));
        const horaSaida = formatarDataHora(new Date(horaSaidaInput.value)) || null;
        const autorizacao = autorizacaoInput.value.toUpperCase() || '';

        if (placa === '----') {
            placaInput.value = null;  
        }

        // Construção do objeto de dados
        const dados = {
            nome,
            cpf,
            horaEntrada,
            horaSaida,
            localId,
            local: localSelecionado,
            pessoaId,
            pessoa: pessoaSelecionada,
            autorizacao
        };

        // Verifica se existe um veículo selecionado e atribui o veiculoId
        if (placaInput.value && veiculoSelecionado) {
            dados.veiculoId = veiculoSelecionado.id;
            dados.placa = placa;
            dados.veiculo = veiculoSelecionado;
        } else {
            dados.veiculoId = null; 
            dados.placa = null;
        }

        console.log('Dados a serem enviados:', dados);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            console.log('Requisição bem-sucedida!');
            document.querySelectorAll('input').forEach(input => input.value = '');
            idPessoaInput.value = '';
            alert('Acesso cadastrado com sucesso!');

            if (botaoId === 'salvarS') { window.close(); }
        } else {
            const errorData = await response.json();
            console.error('Erro na resposta:', errorData);
            alert(`Erro ao processar a requisição: ${errorData.title}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert(`Erro ao processar a requisição: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cpf')?.addEventListener('input', buscarDados);
    ['salvar', 'salvarS'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => enviarDados(id));
    });
    document.getElementById('sair')?.addEventListener('click', () => window.close());
});
