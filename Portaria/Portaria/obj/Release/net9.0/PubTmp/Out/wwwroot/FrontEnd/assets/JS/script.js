document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('https://localhost/Portaria/api/Usuario/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: usuario, senha: senha }), 
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.Token);
            document.getElementById('mensagem').innerText = 'Login realizado com sucesso!';
            console.log('Token recebido:', data.Token);
        } else {
            document.getElementById('mensagem').innerText = data || 'Erro ao fazer login.';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('mensagem').innerText = `Erro ao conectar à API: ${error.message}`;
    }
});