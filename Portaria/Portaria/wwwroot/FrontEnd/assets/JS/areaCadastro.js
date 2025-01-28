// areaCadastro.js
import { abrirPagina } from './utilidades.js';  // Importa a função abrirPagina

document.addEventListener('DOMContentLoaded', function () {
    const botoes = document.querySelectorAll('.botaoAreaCadastro');
    
    botoes.forEach((botao) => {
        botao.addEventListener('click', function() {
            const pagina = this.getAttribute('data-pagina') + '.html';  // Pega o nome da página do atributo data-pagina
            abrirPagina(pagina);  // Chama a função para abrir a página
        });
    });
});