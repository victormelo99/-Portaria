import { Token, API_URLS } from './config.js';

let pessoas = [];
let veiculos = [];
let locais = [];

async function carregarDados() {
    const rotasPessoas = [API_URLS.Funcionario, API_URLS.Visitante, API_URLS.Terceiro];
    const rotaVeiculos = API_URLS.Veiculo;
    const rotaLocais = API_URLS.Local;

    try {
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

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

async function preencherFormulario() {
    const id = localStorage.getItem('usuarioId');
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

        setFieldValue('id', dadosNormalizados.Id);
        setFieldValue('placa', dadosNormalizados.PlacaVeiculo);
        setFieldValue('autorizacao', dadosNormalizados.Autorizacao);
        setFieldValue('horaEntrada', dadosNormalizados.HoraEntrada);
        setFieldValue('horaSaida', dadosNormalizados.HoraSaida);
        setFieldValue('idVeiculo', dadosNormalizados.IdVeiculo);
        setFieldValue('IdPessoa', dadosNormalizados.IdPessoa);
        setFieldValue('localId', dadosNormalizados.LocalId);

        await carregarLocais();
        await carregarVeiculos(dadosNormalizados.IdVeiculo, dadosNormalizados.PlacaVeiculo);
        await carregarPessoaPorId(dadosNormalizados.IdPessoa);

        document.getElementById('local').value = dadosNormalizados.LocalId;

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

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

async function carregarVeiculos(veiculoId, placaSelecionada) {
    try {
        const veiculoSelect = document.getElementById('veiculo');
        veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';

        let veiculoSelecionado = null;
        const pessoaId = document.getElementById('IdPessoa').value;
        
        const veiculosDaPessoa = veiculos.filter(veiculo => veiculo.pessoaId === parseInt(pessoaId));

        if (veiculosDaPessoa.length === 0) {
            veiculoSelect.add(new Option('Nenhum veículo', 'nenhum'));
        } else {
            veiculosDaPessoa.forEach(veiculo => {
                const option = document.createElement('option');
                option.value = veiculo.id;
                option.text = `${veiculo.modelo} - ${veiculo.placa}`;
                veiculoSelect.add(option);

                if (veiculo.id === veiculoId || veiculo.placa === placaSelecionada) {
                    veiculoSelecionado = veiculo;
                }
            });
        }

        if (veiculoSelecionado) {
            document.getElementById('veiculoId').value = veiculoSelecionado.id;
            document.getElementById('placa').value = veiculoSelecionado.placa;
            veiculoSelect.value = veiculoSelecionado.id;
        }
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

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
    document.getElementById('IdPessoa').value = pessoa.id;

    const veiculosDaPessoa = veiculos.filter(v => v.pessoaId === pessoa.id);
    const veiculoSelect = document.getElementById('veiculo');
    const veiculoIdField = document.getElementById('veiculoId');
    const placaField = document.getElementById('placa');

    veiculoSelect.innerHTML = '<option value="">Selecione um veículo</option>';
    veiculoIdField.value = '';
    placaField.value = '';

    if (veiculosDaPessoa.length === 1) {
        const veiculo = veiculosDaPessoa[0];
        const option = new Option(veiculo.modelo, veiculo.id);
        veiculoSelect.add(option);
        veiculoSelect.value = veiculo.id;
        veiculoIdField.value = veiculo.id;
        placaField.value = veiculo.placa;
    } else if (veiculosDaPessoa.length > 1) {
        veiculosDaPessoa.forEach(veiculo => {
            const option = new Option(veiculo.modelo, veiculo.id);
            veiculoSelect.add(option);
        });
        veiculoIdField.value = '';
        placaField.value = '';
    } else {
        veiculoSelect.add(new Option('Nenhum veículo', 'nenhum'));
        veiculoIdField.value = '';
        placaField.value = '';
    }
}

async function pesquisar(campo, tipo) {
    let valor;
    let pessoa;

    if (tipo === 'nome') {
        valor = campo.value.trim().toUpperCase();
        pessoa = pessoas.find(p => p.nome.toUpperCase().includes(valor));
    } else if (tipo === 'cpf') {
        valor = campo.value.replace(/\D/g, '');
        pessoa = pessoas.find(p => p.cpf.replace(/\D/g, '') === valor);
    } else if (tipo === 'placa') {
        valor = campo.value.trim().toUpperCase();
        const veiculo = veiculos.find(v => v.placa.toUpperCase() === valor);
        if (veiculo) {
            pessoa = pessoas.find(p => p.id === veiculo.pessoaId);
            if (pessoa) {
                preencherCamposPessoa(pessoa);
                document.getElementById('veiculoId').value = veiculo.id;
                document.getElementById('placa').value = veiculo.placa;
                document.getElementById('veiculo').value = veiculo.id;
            } else {
                alert('Pessoa associada ao veículo não encontrada!');
            }
            return;
        }
    }

    if (pessoa) {
        preencherCamposPessoa(pessoa);
    } else {
        alert(tipo === 'placa' ? 'Veículo não encontrado!' : 'Pessoa não encontrada!');
    }
}

async function atualizarAcesso() {
    const id = document.getElementById('id').value;
    const pessoaId = parseInt(document.getElementById('IdPessoa').value);  
    const pessoaSelecionada = pessoas.find(pessoa => pessoa.id === pessoaId);
    const veiculoId = parseInt(document.getElementById('veiculoId').value) || null;  
    const veiculoSelecionado = veiculoId ? veiculos.find(veiculo => veiculo.id === veiculoId) : null;  
    const localId = parseInt(document.getElementById('localId').value);  
    const localSelecionado = locais.find(local => local.id === localId);
    const horaEntrada = document.getElementById('horaEntrada').value;
    const autorizacao = document.getElementById('autorizacao').value.toUpperCase();
    const horaSaida = document.getElementById('horaSaida').value || null;

    const acessoAtualizado = {
        id,
        pessoaId,
        pessoa: pessoaSelecionada,
        veiculoId: veiculoId || null,
        veiculo: veiculoSelecionado || null,
        localId,
        local: localSelecionado,
        horaEntrada,
        horaSaida,
        autorizacao
    };

    const url = `${API_URLS.Acesso}`;

    try {
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(acessoAtualizado),
        });

        alert('Acesso atualizado com sucesso!');
        window.close();
    } catch (error) {
        alert('Erro ao atualizar o acesso');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados().then(preencherFormulario);

    document.getElementById('veiculo').addEventListener('change', function () {
        const veiculoId = parseInt(this.value, 10);
        const veiculo = veiculos.find(v => v.id === veiculoId);

        if (veiculo) {
            document.getElementById('veiculoId').value = veiculo.id;
            document.getElementById('placa').value = veiculo.placa;
        } else {
            document.getElementById('veiculoId').value = '';
            document.getElementById('placa').value = '';
        }
    });

    document.getElementById('local').addEventListener('change', function () {
        document.getElementById('localId').value = this.value;
    });

    document.getElementById('pesquisarNome').addEventListener('click', () => pesquisar(document.getElementById('nome'), 'nome'));
    document.getElementById('pesquisarCpf').addEventListener('click', () => pesquisar(document.getElementById('cpf'), 'cpf'));
    document.getElementById('pesquisarPlaca').addEventListener('click', () => pesquisar(document.getElementById('placa'), 'placa'));
    document.getElementById('atualizar').addEventListener('click', atualizarAcesso);
    document.getElementById('sair').addEventListener('click', () => window.close());
});
