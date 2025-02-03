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
        localSelecionado.innerHTML = '<option value="">Selecione um local</option>' + 
            locais.map(local => `<option value="${local.id}">${local.nome}</option>`).join('');
    }
}

function formatarDataHora(data) {
    data = new Date(data);
    return isNaN(data) ? '' : data.toISOString().slice(0, 19);
}


function preencherPessoa(pessoa) {
    const ids = ['cpf', 'nome', 'IdPessoa', 'placa', 'veiculo', 'horaEntrada', 'horaSaída'];
    const [cpfInput, nomeInput, idPessoaInput, placaInput, veiculoSelect, horaEntradaInput, horaSaidaInput] =
        ids.map(id => document.getElementById(id));

    if (cpfInput) cpfInput.value = pessoa.cpf;
    if (nomeInput) nomeInput.value = pessoa.nome;
    if (idPessoaInput) idPessoaInput.value = pessoa.id;

    const veiculosPessoa = veiculos.filter(v => v.pessoaId === pessoa.id);
    veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';
    placaInput.value = '';

    if (veiculosPessoa.length) {
        veiculosPessoa.forEach(v => {
            veiculoSelect.appendChild(new Option(v.modelo, v.placa));
        });
        if (veiculosPessoa.length === 1) {
            veiculoSelect.value = placaInput.value = veiculosPessoa[0].placa;
        }
    } else {
        veiculoSelect.appendChild(new Option('----', '----'));
        veiculoSelect.value = placaInput.value = '----';
    }

    if (horaEntradaInput) horaEntradaInput.value = pessoa.horaEntrada ? formatarDataHora(new Date(pessoa.horaEntrada)) : '';
    if (horaSaidaInput) horaSaidaInput.value = pessoa.horaSaida ? formatarDataHora(new Date(pessoa.horaSaida)) : '';
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
        placaInput.value = null;
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
    if (!inputValue) return alert(`Por favor, preencha o campo ${campo}.`);

    inputValue = campo === 'placa' ? inputValue.toUpperCase() :
                 campo === 'cpf' ? inputValue.replace(/\D/g, '') :
                 inputValue.toLowerCase();

    const resultado = campo === 'cpf' ? pessoas.find(p => p.cpf.replace(/\D/g, '') === inputValue) :
                      campo === 'nome' ? pessoas.find(p => p.nome.toLowerCase().includes(inputValue)) :
                      campo === 'placa' ? veiculos.find(v => v.placa.toUpperCase() === inputValue) : null;

    if (!resultado) return alert(`Nenhum resultado encontrado para ${campo}.`);

    if (campo === 'placa') {
        const veiculoSelect = document.getElementById('veiculo');
        const placaInput = document.getElementById('placa');

        veiculoSelect.innerHTML = `<option value="${resultado.placa}">${resultado.modelo}</option>`;
        veiculoSelect.value = placaInput.value = resultado.placa;

        const pessoaAssociada = pessoas.find(p => p.id === resultado.pessoaId);
        if (pessoaAssociada) {
            document.getElementById('cpf').value = pessoaAssociada.cpf;
            document.getElementById('nome').value = pessoaAssociada.nome;
        } else {
            alert('Veículo não possui pessoa associada.');
        }
    } else {
        preencherPessoa(resultado);
    }
}


export async function enviarDados(botaoId) {
    try {
        const url = `${API_URLS.Acesso}`;
        const inputs = ['nome', 'cpf', 'local', 'placa', 'IdPessoa', 'horaEntrada', 'horaSaida', 'autorizacao']
            .map(id => document.getElementById(id));
        
        const [nomeInput, cpfInput, localInput, placaInput, idPessoaInput, horaEntradaInput, horaSaidaInput, autorizacaoInput] = inputs;
        const localId = parseInt(localInput.value);
        const pessoaId = parseInt(idPessoaInput.value);
        const placa = placaInput.value === '----' ? null : placaInput.value;

        const dados = {
            nome: nomeInput.value.toUpperCase(),
            cpf: cpfInput.value,
            horaEntrada: formatarDataHora(new Date(horaEntradaInput.value)),
            horaSaida: horaSaidaInput.value ? formatarDataHora(new Date(horaSaidaInput.value)) : null,
            localId,
            local: locais.find(l => l.id === localId),
            pessoaId,
            pessoa: pessoas.find(p => p.id == pessoaId),
            autorizacao: autorizacaoInput.value.toUpperCase() || '',
            veiculoId: placa ? (veiculos.find(v => v.placa === placa) || {}).id : null,
            placa,
            veiculo: placa ? veiculos.find(v => v.placa === placa) : null
        };


        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + Token(), 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!response.ok) throw new Error((await response.json()).title);

        document.querySelectorAll('input').forEach(input => input.value = '');
        idPessoaInput.value = '';
        alert('Acesso cadastrado com sucesso!');

        if (botaoId === 'salvarS') window.close();
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cpf')?.addEventListener('input', buscarDados);
    ['salvar', 'salvarS'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => enviarDados(id));
    });
    document.getElementById('sair')?.addEventListener('click', () => window.close());
});
