import { Token } from './config.js';
import { API_URLS } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const token = Token();
    const url = `${API_URLS.Funcionario}/${id}`;

    try {
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

        const funcionario = await response.json();

        document.getElementById('id').value = funcionario.id;
        document.getElementById('nome').value = funcionario.nome.toUpperCase();
        document.getElementById('cpf').value = funcionario.cpf.trim();
        document.getElementById('matricula').value = funcionario.matricula;
        document.getElementById('status').value = funcionario.status.toUpperCase();

        const formatarData = (data) => {
            if (!data) return '';
            const date = new Date(data);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        };

        document.getElementById('dataAdmissao').value = formatarData(funcionario.dataAdmissao);
        document.getElementById('dataDesligamento').value = formatarData(funcionario.dataDesligamento);

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function atualizarFuncionario() {
    const url = `${API_URLS.Funcionario}`;
    const token = Token();

    try {
        const id = document.getElementById('id').value;
        const nome = document.getElementById('nome').value.toUpperCase();
        const cpf = document.getElementById('cpf').value.trim();
        const matricula = document.getElementById('matricula').value.trim();
        const statusSelecionado = document.getElementById('status').value.toUpperCase();
        const dataAdmissao = document.getElementById('dataAdmissao').value;
        const dataDesligamento = document.getElementById('dataDesligamento').value;

        if (!id) return alert('ID do funcionário não encontrado.');
        if (!nome || nome.length < 2 || nome.length > 50) return alert('Nome deve ter entre 2 e 50 caracteres.');
        if (!cpf || cpf.length !== 11) return alert('CPF inválido.');

        const matriculaNum = parseInt(matricula);
        const mapearStatus = statusSelecionado === 'ATIVO' ? 0 : 1;

        const formatarData = (data) => {
            if (!data) return null; 
            const date = new Date(data);
            if (isNaN(date.getTime())) return null; 
        };

        const responseFuncionario = await fetch(`${API_URLS.Funcionario}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!responseFuncionario.ok) {
            throw new Error(`Erro ao obter dados do funcionário: ${responseFuncionario.status}, mensagem: ${await responseFuncionario.text()}`);
        }

        const funcionarioExistente = await responseFuncionario.json();

        const dados = {
            id: id,
            nome: nome,
            cpf: cpf,
            matricula: matriculaNum,
            dataAdmissao: formatarData(dataAdmissao) || funcionarioExistente.dataAdmissao,
            dataDesligamento: formatarData(dataDesligamento) || funcionarioExistente.dataDesligamento,
            status: mapearStatus
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}, mensagem: ${await response.text()}`);
        }

        alert('Funcionário atualizado com sucesso!');
        window.close();

    } catch (error) {
        alert('Erro ao atualizar o funcionário: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    preencherFormulario();

    document.getElementById('sair').addEventListener('click', function () {
        window.close();
    });
});

document.getElementById('Atualizar').addEventListener('click', atualizarFuncionario);