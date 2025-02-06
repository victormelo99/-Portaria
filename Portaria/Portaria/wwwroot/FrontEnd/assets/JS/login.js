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
                
                if (!response.ok) {
                    // Exibe o status de erro se a resposta não for 2xx
                    const errorText = await response.text();
                    console.error("Erro na API:", errorText);
                    document.getElementById('mensagem').innerText = `Erro: ${response.status} - ${errorText}`;
                } else {
                    const body = await response.text();
                    console.log("Resposta da API:", body);
                
                    const data = JSON.parse(body);
                    console.log('resultado do data:', JSON.stringify(data, null, 2));
                
                    if (data.redefinirSenha !== undefined) {
                        console.log('RedefinirSenha:', data.redefinirSenha);
                
                        if (data.redefinirSenha) {
                            window.location.href = '/frontend/assets/HTML/resetSenha.html';
                        } else if (data.resultado && data.resultado.token) {
                            localStorage.setItem('token', data.resultado.token);
                            localStorage.setItem('usuarioId', data.resultado.usuario.id);
                            window.location.href = '/frontend/assets/HTML/areaCadastro.html';
                        }
                    } else {
                        document.getElementById('mensagem').innerText = 'Erro ao processar login. Tente novamente.';
                    }}
            } catch (error) {
                const mensagemEl = document.getElementById('mensagem');
                mensagemEl.innerText = 'Erro ao conectar ao servidor. Tente novamente.';
                mensagemEl.style.color = 'red';
            }
        });
    }
});
