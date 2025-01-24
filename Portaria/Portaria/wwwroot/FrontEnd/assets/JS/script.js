//URLS e Token

const API_URLS = {
    Usuario: 'https://localhost:7063/api/Usuario',
};

const token = localStorage.getItem('token');

// AREA LOGIN
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
document.addEventListener('DOMContentLoaded', function () {
    preencherTabela();
});


async function preencherTabela() {

    const url = `${API_URLS.Usuario}`;

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
    const url = `${API_URLS.Usuario}`;

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


function vincularEventosLinhas() {
    const linhas = document.querySelectorAll('#tbody tr');
    linhas.forEach((linha) => {
        linha.addEventListener('click', () => selecionarLinha(linha));
    });
}

function selecionarLinha(linha) {
    const linhas = document.querySelectorAll('#tbody tr');
    linhas.forEach((tr) => tr.classList.remove('selecionado'));

    linha.classList.add('selecionado'); 

    const idUsuario = linha.cells[0].textContent.trim(); 
    console.log('ID do usuário selecionado:', idUsuario);

    localStorage.setItem('idUsuarioSelecionado', idUsuario);

    const botaoAlterar = document.getElementById('alterar');
    botaoAlterar.disabled = false; 

    preencherFormulario();
}

async function preencherFormulario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');
    if (!idUsuario) {
        console.error('Nenhum usuário selecionado para alteração.');
        return;
    }

    const url = `${API_URLS.Usuario}/${idUsuario}`;

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
            console.error(`Erro na API: ${response.status}, mensagem: ${errorMessage}`);
            return;
        }

        const usuario = await response.json();
        console.log('Dados do usuário retornados:', usuario);

        document.getElementById('id').value = usuario.id || ''; 
        document.getElementById('nome').value = usuario.nome || '';
        document.getElementById('cargo').value = usuario.cargo || '';
        document.getElementById('login').value = usuario.login || '';
        document.getElementById('senha').value = usuario.senha || '';
        document.getElementById('confirmarSenha').value = usuario.senha || ''; 

    } catch (error) {
        console.error('Erro ao preencher o formulário:', error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    preencherFormulario(); 
});


async function alterarTabela(event) {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');
    
    if (!idUsuario) {
        console.error('Nenhum usuário selecionado para alteração.');
        return;
    }

    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const login = document.getElementById('login').value;
    const cargo = document.getElementById('cargo').value;
    const senha = document.getElementById('senha').value;

    const usuario = {
        id: parseInt(id),
        nome: nome,
        cargo: cargo,
        login: login,
        senha: senha
    };

    const url = `${API_URLS.Usuario}`;

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

        const botaoId = event.target.id;

        if (botaoId === 'AtualizarS') {
            fecharAba(); 
        }

        alert('Usuário alterado com sucesso!');
    } catch (error) {
        console.error('Erro ao alterar os dados do usuário:', error);
    }
}


document.addEventListener('DOMContentLoaded', alterarTabela);

document.getElementById('Atualizar').addEventListener('click', (event) => alterarTabela(event));
document.getElementById('AtualizarS').addEventListener('click', (event) => alterarTabela(event));