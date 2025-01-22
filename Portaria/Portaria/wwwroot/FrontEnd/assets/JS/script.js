
//AREA LOGIN
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) { 
        loginForm.addEventListener('submit', async function (evento) {
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
                document.getElementById('mensagem').innerText = `Erro ao conectar à API: ${error.message}`;
            }
        });
    }
});

//AREA LISTAGEM DE USUÁRIOS

async function preencherTabela() {
    console.log("Função preencherTabela chamada");

    const url = 'https://localhost:7063/api/Usuario';
    const token = localStorage.getItem('token');

    console.log('Token encontrado:', token);  
    if (!token) {
        console.error('Token não encontrado no LocalStorage.');
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        console.log("Resposta da API:", response);  


        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro na resposta da API: ${response.status}, mensagem: ${errorMessage}`);
            return;
        }

        const usuarios = await response.json();
        console.log("Usuários retornados da API:", usuarios); 

        const tbody = document.getElementById('tbody');
        console.log("Tabela encontrada:", tbody); 
        tbody.innerHTML = ''; 

        usuarios.forEach((usuario) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = usuario.id;

            const tdNome = document.createElement('td');
            tdNome.textContent = usuario.nome;

            const tdCargo = document.createElement('td');
            tdCargo.textContent = usuario.cargo;

            const tdLogin = document.createElement('td');
            tdLogin.textContent = usuario.login;

            const tdSenha = document.createElement('td');
            tdSenha.textContent = '******';

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdCargo);
            tr.appendChild(tdLogin);
            tr.appendChild(tdSenha);

            tbody.appendChild(tr);
        });

        console.log("Tabela preenchida:", tbody); 

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}
