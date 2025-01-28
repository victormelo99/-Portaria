import { Token } from './config.js';  // Importa a função Token

export function abrirPagina(pagina) {
    const token = Token();

    if (token) {
        window.open(`/Frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        const mensagem = document.getElementById('mensagem');
        if (mensagem) {
            mensagem.innerText = 'Você precisa estar autenticado para acessar esta página!';
        }
    }
}

export function vincularEventosLinhas() {
    const linhas = document.querySelectorAll('#tbody tr');
    linhas.forEach((linha) => {
        linha.addEventListener('click', () => selecionarLinha(linha));
    });
}

export function selecionarLinha(linha) {
    const linhas = document.querySelectorAll('#tbody tr');
    const botaoAlterar = document.getElementById('alterar');
    const botaoDeletar = document.getElementById('deletar');

    linhas.forEach((tr) => tr.classList.remove('selecionado'));
    linha.classList.add('selecionado');

    const id = linha.cells[0].textContent.trim();
    localStorage.setItem('idUsuarioSelecionado', id);

    botaoAlterar.disabled = false;
    botaoDeletar.disabled = false;


    document.addEventListener('click', function fora(event) {

        const tabela = document.querySelector('.table');
        if (!tabela.contains(event.target)) {

            linhas.forEach((tr) => tr.classList.remove('selecionado'));
            botaoAlterar.disabled = true;
            botaoDeletar.disabled = true;
            document.removeEventListener('click', fora);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    vincularEventosLinhas();
});

