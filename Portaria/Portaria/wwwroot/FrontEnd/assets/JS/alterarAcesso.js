import { Token, API_URLS } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${API_URLS.Acesso}/${id}`;

    // Função para carregar locais
    async function carregarLocais() {
        try {
            const response = await fetch(API_URLS.Local, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                },
            });

            const locais = await response.json();
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
            const response = await fetch(API_URLS.Veiculo, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                },
            });

            const veiculos = await response.json();
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
        let urlPessoa = '';
        const tipos = ['Funcionario', 'Visitante', 'Terceiro'];

        for (const tipo of tipos) {
            try {
                const response = await fetch(`${API_URLS[tipo]}/${idPessoa}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + Token(),
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    urlPessoa = `${API_URLS[tipo]}/${idPessoa}`;
                    break;
                }
            } catch (error) {
                console.warn(`Erro ao verificar rota ${tipo}:`, error);
            }
        }

        try {
            const response = await fetch(urlPessoa, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                },
            });

            const pessoa = await response.json();

            document.getElementById('nome').value = pessoa.nome.toUpperCase();
            document.getElementById('cpf').value = pessoa.cpf;
        } catch (error) {
            console.error('Erro ao carregar dados da pessoa:', error);
        }
    }

    // Função para preencher os campos do formulário
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
        setFieldValue('local', dadosNormalizados.NomeLocal);
        setFieldValue('autorizacao', dadosNormalizados.Autorizacao);
        setFieldValue('horaEntrada', dadosNormalizados.HoraEntrada);
        setFieldValue('horaSaida', dadosNormalizados.HoraSaida);
        setFieldValue('idVeiculo', dadosNormalizados.IdVeiculo);

        document.getElementById('IdPessoa').value = dadosNormalizados.IdPessoa;
        setFieldValue('localId', dadosNormalizados.LocalId);

        // Carrega locais, veículos e pessoa
        await carregarLocais();
        await carregarVeiculos(dadosNormalizados.IdVeiculo, dadosNormalizados.PlacaVeiculo);
        await carregarPessoaPorId(dadosNormalizados.IdPessoa);

        // Define o local selecionado
        const localSelect = document.getElementById('local');
        localSelect.value = dadosNormalizados.LocalId;

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function pesquisarPorCpfOuNome() {
    const valorPesquisa = document.getElementById('pesquisa').value.trim();

    if (!valorPesquisa) {
        alert('Digite um CPF ou nome para pesquisar.');
        return;
    }

    const tipos = ['Funcionario', 'Visitante', 'Terceiro'];  // Tipos que você vai buscar
    let pessoaEncontrada = null;

    try {
        for (const tipo of tipos) {
            const response = await fetch(`${API_URLS[tipo]}/buscar?query=${valorPesquisa}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const dados = await response.json();
                if (dados && dados.id) {
                    pessoaEncontrada = dados;
                    break; // Se encontrar o dado, sai do loop
                }
            }
        }

        if (pessoaEncontrada) {
            // Armazena o ID encontrado e preenche o formulário
            localStorage.setItem('idUsuarioSelecionado', pessoaEncontrada.id);
            preencherFormulario();
        } else {
            alert('Nenhum dado encontrado para o CPF ou nome informado.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Tente novamente.');
    }
}

// Adiciona evento de pesquisa ao campo
document.addEventListener('DOMContentLoaded', () => {
    preencherFormulario();

    // Evento de pesquisa
    document.getElementById('pesquisarNome')?.addEventListener('click', pesquisarPorCpfOuNome);

    // Eventos de sair e atualizar
    document.getElementById('sair')?.addEventListener('click', () => window.close());
    document.getElementById('atualizar')?.addEventListener('click', atualizarAcesso);
});
