import { Token } from './config.js';
import { API_URLS } from './config.js';

export async function enviarDados(botaoId) {
    const url = `${API_URLS.Funcionario}`;

    try {
        let nome = document.getElementById('nome').value.toUpperCase();
        let cpf = document.getElementById('cpf').value.trim();
        let matricula = document.getElementById('matricula').value.trim();
        let status = document.getElementById('status').value.toUpperCase();
        let dataAdmissao = document.getElementById('dataAdmissao').value;
        let dataDesligamento = document.getElementById('dataDesligamento').value;

        const token = Token();

        if (!nome || nome.length < 2 || nome.length > 50) return alert('Nome deve ter entre 2 e 50 caracteres.');
        if (!cpf || cpf.length !== 11) return alert('CPF inválido.');
        if (!dataAdmissao) return alert('Data de admissão é obrigatória.');

        const matriculaNum = parseInt(matricula);

        const mapearStatus = status === 'ATIVO' ? 1 : 0; 

        const formatarData = (data) => {
            if (!data) {
                return new Date('0001-01-01T00:00:00').toISOString();
            }
            const date = new Date(data);
            if (isNaN(date.getTime())) {
                return new Date('0001-01-01T00:00:00').toISOString();
            }
            return date.toISOString();
        };

        const dados = {
            nome: nome,
            cpf: cpf,
            matricula: matriculaNum,
            dataAdmissao: formatarData(dataAdmissao),
            dataDesligamento: formatarData(dataDesligamento),
            status: mapearStatus
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
            const statusElement = document.getElementById('status');
            if (statusElement) statusElement.value = '';
            
            alert('Funcionário cadastrado com sucesso!');
            if (botaoId === 'salvarS') {
                window.close();
            }
        } else {
            throw new Error('Erro ao cadastrar o funcionário');
        }
    } catch (error) {
        alert('Erro ao processar a requisição: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('salvar').addEventListener('click', function () {
        enviarDados('salvar');
    });

    document.getElementById('salvarS').addEventListener('click', function () {
        enviarDados('salvarS');
    });

    document.getElementById('sair').addEventListener('click', function () {
        window.close();
    });
});