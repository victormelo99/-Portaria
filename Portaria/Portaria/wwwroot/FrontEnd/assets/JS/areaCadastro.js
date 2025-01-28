// areaCadastro.js
import { abrirPagina } from './utilidades.js';

document.addEventListener('DOMContentLoaded', function () {
    const botoes = document.querySelectorAll('.botaoAreaCadastro');
    
    botoes.forEach((botao) => {
        botao.addEventListener('click', function() {
            const pagina = this.getAttribute('data-pagina') + '.html'; 
            abrirPagina(pagina);
        });
    });
});