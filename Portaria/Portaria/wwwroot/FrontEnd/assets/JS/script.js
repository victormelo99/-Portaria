document.getElementById('loginForm').addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('https://localhost:7063/api/Usuario/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: usuario, senha: senha }),
        });

        let message;

        const body = await response.text(); 
        if (response.ok) {
            const data = JSON.parse(body);
            localStorage.setItem('token', data.Token);
            document.getElementById('mensagem').innerText = 'Login realizado com sucesso!';
            window.location.href = '/frontend/assets/HTML/areaCadastro.html';
        } else {
            try {
                const errorData = JSON.parse(body);
                message = errorData.message || 'Erro desconhecido.';
            } catch {
                message = body;
            }
            document.getElementById('mensagem').innerText = message;
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('mensagem').innerText = `Erro ao conectar à API: ${error.message}`;
    }
});
