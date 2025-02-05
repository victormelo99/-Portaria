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
                    
                    if (data.token && data.usuario && data.usuario.cargo) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('usuarioId', data.usuario.cargo);

                        document.getElementById('mensagem').innerText = 'Login realizado com sucesso!';
                        window.location.href = '/frontend/assets/HTML/areaCadastro.html';
                    } else {
                        document.getElementById('mensagem').innerText = 'Erro ao processar login. Tente novamente.';
                    }
                } else {
                    document.getElementById('mensagem').innerText = 'Usuário ou senha incorreto. Tente novamente.';
                }
            } catch (error) {
                const mensagemEl = document.getElementById('mensagem');
                mensagemEl.innerText = 'Erro ao conectar ao servidor. Tente novamente.';
                mensagemEl.style.color = 'red';
            }
        });
    }
});
