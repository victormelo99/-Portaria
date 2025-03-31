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
                    const errorText = await response.text();
                    console.error("Erro na API:", errorText);
                    document.getElementById('mensagem').innerText = errorText;
                    return;
                }

                const body = await response.text();

                const data = JSON.parse(body);

                if (data.redefinirSenha !== undefined) {
    			if (data.redefinirSenha) {
        			localStorage.setItem('token', data.token); 
        			localStorage.setItem('usuarioId', data.id);
        			window.location.href = '/frontend/assets/HTML/resetSenha.html';
        		return;
    			}
		}


                if (data.resultado && data.resultado.token && data.resultado.usuario && data.resultado.usuario.cargo) {
                    localStorage.setItem('token', data.resultado.token);
                    localStorage.setItem('usuarioId', data.resultado.usuario.usuario);
                    localStorage.setItem('usuarioCargo', data.resultado.usuario.cargo);

                    document.getElementById('mensagem').innerText = 'Login realizado com sucesso!';

                    window.location.href = '/frontend/assets/HTML/areaCadastro.html';
                } else {
                    document.getElementById('mensagem').innerText = 'Erro ao processar login. Tente novamente.';
                }

            } catch (error) {
                console.error("Erro de conexÃ£o:", error);
                const mensagemEl = document.getElementById('mensagem');
                mensagemEl.innerText = 'Erro ao conectar ao servidor. Tente novamente.';
                mensagemEl.style.color = 'red';
            }
        });
    }
});
