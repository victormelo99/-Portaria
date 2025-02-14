import { Token } from './config.js';
import { API_URLS } from './config.js';

export async function enviarDados(botaoId) {
    const url = `${API_URLS.Visitante}`;

    try {
        let nome = document.getElementById('nome').value.toUpperCase();
        let cpf = document.getElementById('cpf').value.trim();
        let motivoVisita = document.getElementById('motivoVisita').value.toUpperCase();
        let pessoaVisitada = document.getElementById('pessoaVisitada').value.toUpperCase();

        if (!nome || nome.length < 2 || nome.length > 50) return alert('Campo Nome é obrigatório e deve ter entre 2 e 50 caracteres.');
        if (!cpf || cpf.length !== 11) return alert('CPF inválido.');
        
        const dados = { nome, cpf, motivoVisita, pessoaVisitada };

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
            alert('Visitante incluído com sucesso!');

            if (botaoId === 'salvarS') {
                window.close();
            }
        } else {
            throw new Error('Erro ao cadastrar o visitante');
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