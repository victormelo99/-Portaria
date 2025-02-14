import { Token } from './config.js';
import { API_URLS } from './config.js';

export async function enviarDados(botaoTipo) {
    const url = `${API_URLS.Terceiro}`;

    try {
        let nome = document.getElementById('nome').value.toUpperCase();
        let cpf = document.getElementById('cpf').value.trim();
        let empresa = document.getElementById('empresa').value.toUpperCase();
        let tipoServico = document.getElementById('tipoServico').value.toUpperCase();
        let responsavel = document.getElementById('responsavel').value.toUpperCase();

        if (!nome || nome.length < 2 || nome.length > 50) return alert('Nome deve ter entre 2 e 50 caracteres.');
        if (!cpf || cpf.length !== 11) return alert('CPF inválido.');
        if (!empresa) return alert('Empresa é obrigatória.');
        if (!tipoServico) return alert('Tipo de serviço é obrigatório.');
        if (!responsavel) return alert('Responsável é obrigatório.');

        const dados = {
            nome: nome,
            cpf: cpf,
            empresa: empresa,
            tipoServico: tipoServico,
            responsavel: responsavel,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' +  Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            document.querySelectorAll('input').forEach(input => input.value = '');
            alert('Terceiro cadastrado com sucesso!');
            if (botaoTipo === 'salvarS') {
                window.close();
            }
        } else {
            throw new Error('Erro ao cadastrar o terceiro');
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