import { API_URLS, Token } from './config.js';

export async function enviarDados(botaoId) {
    const url = `${API_URLS.Funcionario}`;

    try {
        let nome = document.getElementById('nome').value.toUpperCase();
        let cpf = document.getElementById('cpf').value.trim();
        let matricula = document.getElementById('matricula').value.trim();
        let status = document.getElementById('status').value.toUpperCase();
        let dataAdmissao = document.getElementById('dataAdmissao').value;
        let dataDesligamento = document.getElementById('dataDesligamento').value || '0001-01-01';

        if (!nome || nome.length < 2 || nome.length > 50) return alert('Campo Nome é obrigatório e deve ter entre 2 e 50 caracteres.');
        if (!cpf || cpf.length !== 11) return alert('CPF inválido.');
        if (!matricula) return alert('O campo matricula é obrigatória.');
        if (!dataAdmissao) return alert('Data de admissão é obrigatória.');

        const matriculaNum = parseInt(matricula);
        const mapearStatus = status === 'ATIVO' ? 1 : 0; 

        const dados = {
            nome: nome,
            cpf: cpf,
            matricula: matriculaNum,
            dataAdmissao: new Date(dataAdmissao).toISOString(),
            dataDesligamento: new Date(dataDesligamento).toISOString(),
            status: mapearStatus
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Token(),
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

document.addEventListener('DOMContentLoaded', () => {
    ['salvar', 'salvarS'].forEach(id => 
        document.getElementById(id)?.addEventListener('click', () => enviarDados(id))
    );

    document.getElementById('sair')?.addEventListener('click', () => window.close());
});