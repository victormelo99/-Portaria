console.log('areaCadastro.js carregado');

import {ocultar,abrirPagina} from './utilidades.js';

export function inicializarAreaCadastro() {
    const botoes = document.querySelectorAll('.botaoAreaCadastro');
    
    botoes.forEach((botao) => {
        botao.addEventListener('click', function () {
            const pagina = this.getAttribute('data-pagina') + '.html';
            abrirPagina(pagina);
        });
    });
    
    const linksSubmenu = document.querySelectorAll('.submenu a');
    
    linksSubmenu.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const pagina = this.getAttribute('data-pagina');
            mudarPagina(pagina);
        });
    });
}

function mudarPagina(pagina) {
    let url;
    
    switch (pagina) {
        case 'Funcionario':
            url = 'funcionario.html';
            break;
        case 'Visitante':
            url = 'visitante.html';
            break;
        case 'Terceiro':
            url = 'terceiro.html';
            break;
        case 'Veiculo':
            url = 'veiculo.html';
            break;
        case 'Acesso':
            url = 'acesso.html';
            break;
        default:
            console.error('Página não encontrada');
            return;
    }
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function () {
    inicializarAreaCadastro();
    const usuarioId = localStorage.getItem('usuarioId');     
        ocultar(usuarioId);

});