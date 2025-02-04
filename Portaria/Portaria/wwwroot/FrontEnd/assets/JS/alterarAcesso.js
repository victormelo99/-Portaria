import { Token, API_URLS } from './config.js';

// Arrays para armazenar os dados carregados
let pessoas = [];
let veiculos = [];
let locais = [];

// Função para carregar todos os dados (pessoas, veículos e locais)
async function carregarDados() {
    const rotasPessoas = [API_URLS.Funcionario, API_URLS.Visitante, API_URLS.Terceiro];
    const rotaVeiculos = API_URLS.Veiculo;
    const rotaLocais = API_URLS.Local;

    try {
        // Carregar pessoas
        let todasPessoas = [];
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
        pessoas = todasPessoas;

        // Carregar veículos
        const responseVeiculos = await fetch(rotaVeiculos, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        if (responseVeiculos.ok) {
            veiculos = await responseVeiculos.json();
        }

        // Carregar locais
        const responseLocais = await fetch(rotaLocais, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        if (responseLocais.ok) {
            locais = await responseLocais.json();
        }

        console.log('Dados carregados com sucesso:', { pessoas, veiculos, locais });
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Função para preencher o formulário
async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${API_URLS.Acesso}/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json'
            },
        });

        const acesso = await response.json();

        const dadosNormalizados = {
            Id: acesso.id || '',
            NomeLocal: acesso.local?.nome || acesso.localNome || '',
            ModeloVeiculo: acesso.veiculo?.modelo || acesso.veiculoModelo || '',
            PlacaVeiculo: acesso.veiculo?.placa || acesso.veiculoPlaca || '',
            Autorizacao: acesso.autorizacao || '',
            HoraEntrada: acesso.horaEntrada || '',
            HoraSaida: acesso.horaSaida || '',
            IdPessoa: acesso.pessoaId || '',
            LocalId: acesso.localId || '',
            IdVeiculo: acesso.veiculoId || ''
        };

        const setFieldValue = (id, value) => {
            const field = document.getElementById(id);
            if (field) {
                field.value = value;
            }
        };

        // Preenche os campos do formulário com os dados do acesso
        setFieldValue('id', dadosNormalizados.Id);
        setFieldValue('placa', dadosNormalizados.PlacaVeiculo);
        setFieldValue('autorizacao', dadosNormalizados.Autorizacao);
        setFieldValue('horaEntrada', dadosNormalizados.HoraEntrada);
        setFieldValue('horaSaida', dadosNormalizados.HoraSaida);
        setFieldValue('idVeiculo', dadosNormalizados.IdVeiculo);
        setFieldValue('IdPessoa', dadosNormalizados.IdPessoa); // Campo IdPessoa direto
        setFieldValue('localId', dadosNormalizados.LocalId);

        // Carrega dados relacionados
        await carregarLocais();
        await carregarVeiculos(dadosNormalizados.IdVeiculo, dadosNormalizados.PlacaVeiculo);
        await carregarPessoaPorId(dadosNormalizados.IdPessoa);

        document.getElementById('local').value = dadosNormalizados.LocalId;

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

// Função para carregar locais
async function carregarLocais() {
    try {
        const localSelect = document.getElementById('local');
        localSelect.innerHTML = '<option value="">Selecione um local</option>';

        locais.forEach(local => {
            const option = document.createElement('option');
            option.value = local.id;
            option.text = local.nome;
            localSelect.add(option);
        });
    } catch (error) {
        console.error('Erro ao carregar locais:', error);
    }
}

// Função para carregar veículos
async function carregarVeiculos(veiculoId, placaSelecionada) {
    try {
        const veiculoSelect = document.getElementById('veiculo');
        veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';

        let veiculoSelecionado = null;

        veiculos.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.text = `${veiculo.modelo}`;
            veiculoSelect.add(option);

            if (veiculo.id === veiculoId || veiculo.placa === placaSelecionada) {
                veiculoSelecionado = veiculo;
            }
        });

        // Preenche os campos com os dados do veículo selecionado
        if (veiculoSelecionado) {
            document.getElementById('veiculoId').value = veiculoSelecionado.id;
            document.getElementById('placa').value = veiculoSelecionado.placa;
            veiculoSelect.value = veiculoSelecionado.id;
        }
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

// Função para carregar os dados de uma pessoa por ID
async function carregarPessoaPorId(idPessoa) {
    try {
        const pessoa = pessoas.find(p => p.id === idPessoa);

        if (pessoa) {
            document.getElementById('nome').value = pessoa.nome.toUpperCase();
            document.getElementById('cpf').value = pessoa.cpf;
        } else {
            console.warn('Pessoa não encontrada com o ID:', idPessoa);
        }
    } catch (error) {
        console.error('Erro ao carregar dados da pessoa:', error);
    }
}

function preencherCamposPessoa(pessoa) {
    document.getElementById('nome').value = pessoa.nome.toUpperCase();
    document.getElementById('cpf').value = pessoa.cpf;
    document.getElementById('IdPessoa').value = pessoa.id; // Atualiza diretamente o campo IdPessoa

    const veiculosDaPessoa = veiculos.filter(v => v.pessoaId === pessoa.id);
    const veiculoSelect = document.getElementById('veiculo');
    const veiculoIdField = document.getElementById('veiculoId');
    const placaField = document.getElementById('placa');

    // Limpa os campos de veículo
    veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';
    veiculoIdField.value = '';
    placaField.value = '';

    if (veiculosDaPessoa.length === 1) {
        // Se apenas um veículo, selecionar automaticamente
        const veiculo = veiculosDaPessoa[0];
        const option = new Option(veiculo.modelo, veiculo.id);
        veiculoSelect.add(option);
        veiculoSelect.value = veiculo.id;
        veiculoIdField.value = veiculo.id;
        placaField.value = veiculo.placa;
    } else if (veiculosDaPessoa.length > 1) {
        // Se múltiplos veículos, adicionar opções e limpar ID
        veiculosDaPessoa.forEach(veiculo => {
            const option = new Option(veiculo.modelo, veiculo.id);
            veiculoSelect.add(option);
        });
        veiculoIdField.value = '';
        placaField.value = '';
    } else {
        // Se nenhum veículo, limpar campos
        veiculoIdField.value = '';
        placaField.value = '';
    }
}

// Função para pesquisar por NOME
async function pesquisarPorNome() {
    const valor = document.getElementById('nome').value.trim().toUpperCase();
    const pessoa = pessoas.find(p => p.nome.toUpperCase().includes(valor));
    if (pessoa) preencherCamposPessoa(pessoa);
    else alert('Pessoa não encontrada!');
}

// Função para pesquisar por CPF
async function pesquisarPorCpf() {
    const valor = document.getElementById('cpf').value.replace(/\D/g, '');
    const pessoa = pessoas.find(p => p.cpf.replace(/\D/g, '') === valor);
    if (pessoa) preencherCamposPessoa(pessoa);
    else alert('Pessoa não encontrada!');
}

// Função para pesquisar por PLACA
async function pesquisarPorPlaca() {
    const valor = document.getElementById('placa').value.trim().toUpperCase();
    const veiculo = veiculos.find(v => v.placa.toUpperCase() === valor);

    if (veiculo) {
        const pessoa = pessoas.find(p => p.id === veiculo.pessoaId);
        if (pessoa) {
            preencherCamposPessoa(pessoa);
            document.getElementById('veiculoId').value = veiculo.id;
            document.getElementById('placa').value = veiculo.placa;
            document.getElementById('veiculo').value = veiculo.id;
        } else {
            alert('Pessoa associada ao veículo não encontrada!');
        }
    } else {
        alert('Veículo não encontrado!');
    }
}

// Função comum para preencher campos da pessoa encontrada
async function atualizarAcesso() {
    const idAcesso = document.getElementById('id').value;
    const url = `${API_URLS.Acesso}/${idAcesso}`;

    const dados = {
        horaEntrada: document.getElementById('horaEntrada').value,
        horaSaida: document.getElementById('horaSaida').value,
        autorizacao: document.getElementById('autorizacao').value,
        localId: document.getElementById('local').value,
        veiculoId: document.getElementById('veiculo').value,
        pessoaId: document.getElementById('IdPessoa').value
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert('Acesso atualizado!');
            window.close();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar acesso');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarDados().then(preencherFormulario);

    // Listener para mudança no dropdown de veículos
    document.getElementById('veiculo').addEventListener('change', function() {
        const veiculoId = parseInt(this.value, 10); // Converter para número
        const veiculo = veiculos.find(v => v.id === veiculoId);
        
        // Atualizar campos apenas se o veículo for encontrado
        if (veiculo) {
            document.getElementById('veiculoId').value = veiculo.id;
            document.getElementById('placa').value = veiculo.placa;
        } else {
            document.getElementById('veiculoId').value = '';
            document.getElementById('placa').value = '';
        }
    });

    // Listeners existentes...
    document.getElementById('pesquisarNome').addEventListener('click', pesquisarPorNome);
    document.getElementById('pesquisarCpf').addEventListener('click', pesquisarPorCpf);
    document.getElementById('pesquisarPlaca').addEventListener('click', pesquisarPorPlaca);
    document.getElementById('atualizar').addEventListener('click', atualizarAcesso);
    document.getElementById('sair').addEventListener('click', () => window.close());
});