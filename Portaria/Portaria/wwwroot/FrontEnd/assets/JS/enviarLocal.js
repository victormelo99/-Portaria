import { API_URLS, Token } from './config.js';

export async function enviarDados(botaoId) {
    const url = `${API_URLS.Local}`;

    try {
        let nome = document.getElementById('nome').value.toUpperCase();
        let descricao = document.getElementById('descricao').value.toUpperCase();

        if (!nome || nome.length < 2 || nome.length > 50) return alert('Campo Nome é obrigatório e deve ter entre 2 e 50 caracteres.');


        const dados = {
            nome: nome,
            descricao: descricao || ''
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
            document.querySelectorAll('input').forEach(input => input.value = '');  // Limpando os campos
            alert('Local criado com sucesso!');
            if (botaoId === 'salvarS') {
                window.close();
            }
        } else {
            throw new Error('Erro ao cadastrar o local');
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
