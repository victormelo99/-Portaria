import { Token } from './config.js';
import { API_URLS } from './config.js';
import { selecionarLinha, vincularEventosLinhas } from './utilidades.js';


function tipoVeiculo(VeiculoNumero) {
    switch (VeiculoNumero) {
        case 0:
            return 'MOTO';
        case 1:
            return 'CARRO';
        case 2:
            return 'CAMINHÃO';
        default:
            return 'DESCONHECIDO';
    }
}

async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Veiculo}`;

    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Veiculo}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
    }

    try {
        const token = Token();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
          }

        const veiculos = await response.json();

        veiculos.forEach((veiculo) => {
            const tr = document.createElement('tr');
        
            const tdId = document.createElement('td');
            tdId.textContent = veiculo.id;
            const tdPlaca = document.createElement('td');
            tdPlaca.textContent = veiculo.placa;
            const tdModelo = document.createElement('td');
            tdModelo.textContent = veiculo.modelo; 
            const tdCor = document.createElement('td');
            tdCor.textContent = veiculo.cor;
            const tdTipoVeiculo = document.createElement('td');
            tdTipoVeiculo.textContent = tipoVeiculo (veiculo.tipoVeiculo); 
            const tdCpf = document.createElement('td');
            tdCpf.textContent = veiculo.pessoa?.cpf || 'N/A';
            const tdNome = document.createElement('td');
            tdNome.textContent = veiculo.pessoa?.nome || 'N/A';
            const tdIdPessoa = document.createElement('td');
            tdIdPessoa.textContent = veiculo.pessoa?.idPessoa || 'N/A';

            tr.appendChild(tdId);
            tr.appendChild(tdPlaca);
            tr.appendChild(tdModelo);
            tr.appendChild(tdCor);
            tr.appendChild(tdTipoVeiculo);
            tr.appendChild(tdTipoVeiculo);
            tr.appendChild(tdCpf);
            tr.appendChild(tdNome);
            tr.appendChild(tdIdPessoa);
        
            tr.addEventListener('click', function () { selecionarLinha(this); });
        
            tbody.appendChild(tr);
        });
        vincularEventosLinhas();
        console.log('Dados recebidos:', veiculos);
    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    preencherTabela(); 
});

export function abrirlinks(pagina) {
    const token = Token();  
    if (token) {
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        alert('Você precisa estar autenticado para acessar esta página!');
    }
}

async function deletarVeiculo() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        try {
            const token = Token();
            const url = `${API_URLS.Veiculo}/${idUsuario}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,  
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir o local`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Veículo excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            alert('Erro ao excluir o veículo. Por favor, tente novamente.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Pesquisar').addEventListener('click', function () {
        const pesquisa = document.getElementById('text').value;
        preencherTabela(pesquisa);
    });

    document.getElementById('deletar').addEventListener('click', function () {
        deletarVeiculo();
    });

    // Evento clique botão cadastrar
    document.getElementById('cadastrar').addEventListener('click', function () {
        abrirlinks('CadastroVeiculo.html');
    });

    // Evento clique botão alterar
    document.getElementById('alterar').addEventListener('click', function () {
        abrirlinks('AlterarVeiculo.html');
    });
});
