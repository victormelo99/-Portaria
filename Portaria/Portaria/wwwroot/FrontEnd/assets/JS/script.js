// AREA LOGIN
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

                const body = await response.text();
                let message;

                if (response.ok) {
                    const data = JSON.parse(body);
                    localStorage.setItem('token', data.token);
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

//AUTENTICAÇÃO PARA ABRIR PAGINAS COM TOKEN
function abrirPagina(pagina) {
    const token = localStorage.getItem('token');

    if (token) {
        window.open(`/Frontend/assets/HTML/${pagina}`, '_blank');
    } else {
        const mensagem = document.getElementById('mensagem');
        mensagem.innerText = 'Você precisa estar autenticado para acessar esta página!';
    }
}
// AREA LISTAGEM DE USUÁRIOS

async function preencherTabela() {

    const url = 'https://localhost:7063/api/Usuario';
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro na resposta da API: ${response.status}, mensagem: ${errorMessage}`);
            return;
        }

        const usuarios = await response.json();

        const tbody = document.getElementById('tbody');
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

            tr.addEventListener('click', function () {selecionarLinha(this);});

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}



document.addEventListener('DOMContentLoaded', function () {
    preencherTabela();
});


//AREA FUNÇÃO PARA ABRIR CAMINHOS DENTRO DE USUARIO

function abrirlinksUsuario(pagina) {
    //const token = localStorage.getItem('token');

    return window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
}

//FUNCIONAMENTO BOTÃO CADASTRAR AREA USUARIO

const opcoes = document.getElementById('opcoes');

opcoes.addEventListener('click', (evento) => {
    if (evento.target.id === 'salvar' || evento.target.id === 'salvarS') {
        const nome = document.getElementById('nome').value.toUpperCase();
        const login = document.getElementById('login').value;
        const cargo = document.getElementById('cargo').value.toUpperCase();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (nome === '' || login === '' || cargo === '' || senha === '' || confirmarSenha === '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (senha.length < 8 || senha.length > 16 || confirmarSenha.length < 8 || confirmarSenha.length > 16) {
            alert('A senha deve ter entre 8 e 16 caracteres!');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('campo senha e confirmar senha estão diferentes um do outro');
            return;
        }

        enviarDados(nome, login, cargo, senha, evento.target.id);
    } else if (evento.target.id === 'sair') {
        fecharAba();
    }
});

async function enviarDados(nome, login, cargo, senha, botaoId) {
    const url = 'https://localhost:7063/api/Usuario';
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, login, cargo, senha }),
        });

        if (response.ok) {
            document.querySelectorAll('input').forEach(input => input.value = '');

            if (botaoId === 'salvarS') {
                fecharAba();
            }
        } else {
            console.error('Erro ao salvar os dados do usuário:', response.status);
        }
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
    }
};

const sair = document.getElementById('sair');

sair.addEventListener('click', fecharAba);

function fecharAba() {
    window.close();
}

//FUNCIONAMENTO AREA ALTERAR USUARIO

function selecionarLinha(linha) {
    const linhas = document.querySelectorAll('#tbody tr');
    linhas.forEach((tr) => tr.classList.remove('selecionado'));

    linha.classList.add('selecionado');

    const idUsuario = linha.cells[0].textContent;
    localStorage.setItem('idUsuarioSelecionado', idUsuario); 

    const botaoAlterar = document.getElementById('alterar');
    botaoAlterar.disabled = false;

    preencherFormulario(); 
}

function desmarcarTabela(e) {
    const tabelaIn = e.target.closest('#tbody tr');
    if (!tabelaIn) {
        const botaoAlterar = document.getElementById('alterar');
        botaoAlterar.disabled = true;

        document.querySelectorAll('#tbody tr').forEach((tr) => {
            tr.classList.remove('selecionado');
        });
    }
}

async function preencherFormulario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado'); // Recuperar ID
    
    if (!idUsuario) {
        console.error('Nenhum usuário selecionado para alteração.');
        return;
    }

    const url = `https://localhost:7063/api/Usuario/${idUsuario}`; // URL para buscar os dados do usuário
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro na resposta da API: ${response.status}, mensagem: ${errorMessage}`);
            return;
        }

        const usuario = await response.json();

        // Preencher o formulário com os dados do usuário
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('cargo').value = usuario.cargo;
        document.getElementById('login').value = usuario.login;
        document.getElementById('senha').value = usuario.senha;

    } catch (error) {
        console.error('Erro ao preencher os dados do usuário:', error);
    }
}

async function alterarTabela() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado'); // Recuperar ID
    if (!idUsuario) {
        console.error('Nenhum usuário selecionado para alteração.');
        return;
    }

    const nome = document.getElementById('nome').value;
    const cargo = document.getElementById('cargo').value;
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    const url = `https://localhost:7063/api/Usuario`;
    const token = localStorage.getItem('token');

    const usuario = {
        id: idUsuario,
        nome: nome,
        login: login,
        senha: senha,
        cargo: cargo
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro na resposta da API: ${response.status}, mensagem: ${errorMessage}`);
            return;
        }

        alert('Usuário alterado com sucesso!');
    } catch (error) {
        console.error('Erro ao alterar os dados do usuário:', error);
    }
}