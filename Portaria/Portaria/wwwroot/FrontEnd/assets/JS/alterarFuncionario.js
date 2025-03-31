import { API_URLS, Token } from './config.js';

async function preencherFormulario() {
    const id = localStorage.getItem('usuarioId');
    const url = `${API_URLS.Funcionario}/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
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
        document.getElementById('status').value = funcionario.status === 1 ? 'ATIVO' : 'iNATIVO';
        document.getElementById('dataAdmissao').value = funcionario.dataAdmissao ? new Date(funcionario.dataAdmissao).toISOString().split('T')[0] : '';
        document.getElementById('dataDesligamento').value = funcionario.dataDesligamento ? new Date(funcionario.dataDesligamento).toISOString().split('T')[0] : '';

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}

async function atualizarFuncionario() {
    const url = `${API_URLS.Funcionario}`;

    try {
        const id = document.getElementById('id').value;
        let nome = document.getElementById('nome').value.toUpperCase();
        let cpf = document.getElementById('cpf').value.trim();
        let matricula = document.getElementById('matricula').value.trim();
        let statusSelecionado = document.getElementById('status').value.toUpperCase();
        let dataAdmissao = document.getElementById('dataAdmissao').value;
        let dataDesligamento = document.getElementById('dataDesligamento').value;
        
        if (!nome || nome.length < 2 || nome.length > 50) return alert('Campo Nome é obrigatório e deve ter entre 2 e 50 caracteres.');
        if (!cpf || cpf.length !== 11) return alert('CPF inválido.');
        if (!matricula) return alert('O campo matricula é obrigatória.');
        if (!dataAdmissao) return alert('Data de admissão é obrigatória.');

        const matriculaNum = parseInt(matricula);
        const mapearStatus = statusSelecionado === 'ATIVO' ? 1 : 0;

        dataAdmissao = new Date(dataAdmissao).toISOString();         
        dataDesligamento = dataDesligamento ? new Date(dataDesligamento).toISOString() : null;

        const dados = {
            id: id,
            nome: nome,
            cpf: cpf,
            matricula: matriculaNum,
            dataAdmissao: dataAdmissao,
            dataDesligamento: dataDesligamento,
            status: mapearStatus
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Token(),
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

    document.getElementById('Atualizar').addEventListener('click', atualizarFuncionario);

    document.getElementById('sair').addEventListener('click', function () {
        window.close();
    });
});
