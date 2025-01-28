// areaCadastro.js
import { abrirPagina } from './utilidades.js';

document.addEventListener('DOMContentLoaded', function () {
    // Captura botões de área de cadastro
    const botoes = document.querySelectorAll('.botaoAreaCadastro');
    
    // Adiciona botão
    botoes.forEach((botao) => {
        botao.addEventListener('click', function() {
            const pagina = this.getAttribute('data-pagina') + '.html'; 
            abrirPagina(pagina);
        });
    });

    // Captura links do submenu
    const linksSubmenu = document.querySelectorAll('.submenu a');

    // Adiciona um evento de clique em submenu
    linksSubmenu.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault()

            const pagina = this.getAttribute('data-pagina');
            mudarPagina(pagina);
        });
    });

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
            default:
                console.error('Página não encontrada');
                return;
        }
        window.open(url, '_blank');
    }
});