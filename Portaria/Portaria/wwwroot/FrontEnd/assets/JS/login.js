// login.js
import { API_URLS } from './config.js';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (evento) {
            evento.preventDefault();

            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch(`${API_URLS.Usuario}/Login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ login: usuario, senha: senha }),
                });

                const body = await response.text();

                if (response.ok) {
                    const data = JSON.parse(body);
                    localStorage.setItem('token', data.token);
                    document.getElementById('mensagem').innerText = 'Login realizado com sucesso!';
                    window.location.href = '/frontend/assets/HTML/areaCadastro.html';  // Isso pode ser alterado dependendo da sua lógica
                } else {
                    document.getElementById('mensagem').innerText = 'Usuário ou senha incorreto. Tente novamente.';
                }
            } catch (error) {
                const mensagemEl = document.getElementById('mensagem');
                mensagemEl.innerText = 'Usuário ou senha incorretos. Tente novamente.';
                mensagemEl.style.color = 'red';
            }
        });
    }
});
