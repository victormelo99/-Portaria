    import { Token } from './config.js';
    import { API_URLS } from './config.js';

    let pessoas = []; 

    async function carregarPessoas() {
        const token = Token();
        const rotas = [
            API_URLS.Funcionario, 
            API_URLS.Visitante, 
            API_URLS.Terceiro
        ];

        try {
            let todasPessoas = []; 

            for (let rota of rotas) {
                console.log(`Buscando pessoas na rota: ${rota}`); 
                const response = await fetch(rota, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const pessoasEncontradas = await response.json();
                    console.log(`Pessoas encontradas na rota ${rota}:`, pessoasEncontradas);
                    todasPessoas = todasPessoas.concat(pessoasEncontradas);
                }
            }

            if (todasPessoas.length === 0) {
                throw new Error('Nenhuma pessoa encontrada em todas as rotas.');
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
        const cpfInput = document.getElementById('cpf');
        const selectPessoa = document.getElementById('pessoa');
        const idPessoaInput = document.getElementById('IdPessoa');
    
        if (cpfInput && selectPessoa && idPessoaInput) {
            const cpf = cpfInput.value.replace(/\D/g, '');
            console.log(`CPF digitado: ${cpf}`);
    
            if (cpf.length === 11) {
                const pessoaEncontrada = pessoas.find(pessoa => pessoa.cpf === cpf);
    
                if (pessoaEncontrada) {
                    selectPessoa.value = pessoaEncontrada.id;
                    idPessoaInput.value = pessoaEncontrada.id;
                    console.log('Pessoa encontrada:', pessoaEncontrada); 
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
    }

    export async function enviarDados(botaoId) {
        const url = `${API_URLS.Veiculo}`;

        try {
            const placa = document.getElementById('placa').value.toUpperCase();
            const modelo = document.getElementById('modelo').value.toUpperCase();
            const cor = document.getElementById('cor').value.toUpperCase();
            const tipoVeiculo = parseInt(document.getElementById('tipoVeiculo').value);
            const pessoaId = parseInt(document.getElementById('pessoa').value);

            const pessoaSelecionada = pessoas.find(pessoa => pessoa.id === pessoaId);

            const token = Token();
            const dados = {
                placa: placa,
                modelo: modelo,
                cor: cor,
                tipoVeiculo: tipoVeiculo,
                pessoaId: pessoaId,
                pessoa: pessoaSelecionada 
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (response.ok) {
                document.querySelectorAll('input').forEach(input => input.value = '');
                document.getElementById('pessoa').value = '';
                alert('Veículo cadastrado com sucesso!');
                
                if (botaoId === 'salvarS') {
                    window.close(); 
                }
            } 
        } catch (error) {
            alert(`Erro ao processar a requisição: ${error.message}`);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        carregarPessoas();
        
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', preencherPessoaPorCPF);
        }

        const salvarButton = document.getElementById('salvar');
        if (salvarButton) {
            salvarButton.addEventListener('click', () => enviarDados('salvar'));
        }

        const salvarSButton = document.getElementById('salvarS');
        if (salvarSButton) {
            salvarSButton.addEventListener('click', () => enviarDados('salvarS'));
        }

        const sairButton = document.getElementById('sair');
        if (sairButton) {
            sairButton.addEventListener('click', () => window.close());
        }
    });