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
async function preencherTabela(pesquisa = "") {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    let url = `${API_URLS.Usuario}`;

    // Se houver um valor de pesquisa, altera a URL para a rota de pesquisa
    if (pesquisa.trim() !== "") {
        url = `${API_URLS.Usuario}/Pesquisa?valor=${encodeURIComponent(pesquisa)}`;
    }

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

            tr.addEventListener('click', function () { selecionarLinha(this); });

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao preencher a tabela:', error);
    }
}

// Evento para carregar a tabela ao abrir a página
document.addEventListener('DOMContentLoaded', function () {
    preencherTabela();

    // Evento para pesquisar ao clicar no botão de pesquisa
    
    document.getElementById("Pesquisar").addEventListener("click", async () => {
        const pesquisa = document.getElementById("text").value.trim();
        preencherTabela(pesquisa);
    });
});

//AREA FUNÇÃO PARA ABRIR CAMINHOS DENTRO DE USUARIO

function abrirlinksUsuario(pagina) {
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
            alert('Usuário criado com sucesso!');

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

document.addEventListener('DOMContentLoaded', function () {
    vincularEventosLinhas();
    preencherFormulario();
});

function vincularEventosLinhas() {
    const linhas = document.querySelectorAll('#tbody tr');
    linhas.forEach((linha) => {
        linha.addEventListener('click', () => selecionarLinha(linha));
    });
}
function selecionarLinha(linha) {
    const linhas = document.querySelectorAll('#tbody tr');
    const botaoAlterar = document.getElementById('alterar');
    const botaoDeletar = document.getElementById('deletar');

    linhas.forEach((tr) => tr.classList.remove('selecionado'));

    linha.classList.add('selecionado');

    const idUsuario = linha.cells[0].textContent.trim();
    console.log(idUsuario)

    localStorage.setItem('idUsuarioSelecionado', idUsuario);

    botaoAlterar.disabled = false;
    botaoDeletar.disabled = false;

    preencherFormulario();

    if (botaoDeletar) {
        botaoDeletar.addEventListener('click', deletarUsuario);
    }

    document.addEventListener('click', function fora(event) {

        const tabela = document.querySelector('.table');
        if (!tabela.contains(event.target)) {

            linhas.forEach((tr) => tr.classList.remove('selecionado'));
            botaoAlterar.disabled = true;
            botaoDeletar.disabled = true;
            document.removeEventListener('click', fora);
        }
    });
}

async function preencherFormulario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    const url = `${API_URLS.Usuario}/${idUsuario}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });

    const usuario = await response.json();

    document.getElementById('id').value = usuario.id;
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('cargo').value = usuario.cargo;
    document.getElementById('login').value = usuario.login;
    document.getElementById('senha').value = usuario.senha;
    document.getElementById('confirmarSenha').value = usuario.senha;

}

async function alterarTabela() {
    const idInput = document.getElementById('id');
    const nomeInput = document.getElementById('nome');
    const loginInput = document.getElementById('login');
    const cargoInput = document.getElementById('cargo');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');

    const id = parseInt(idInput.value);
    const nome = nomeInput.value.toUpperCase();
    const login = loginInput.value;
    const cargo = cargoInput.value.toUpperCase();
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
    }

    const usuario = {
        id: id,
        nome: nome,
        cargo: cargo,
        login: login,
        senha: senha,
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

        alert('Usuário alterado com sucesso!');
        fecharAba();

    } catch (error) {
        console.error('Erro ao alterar os dados do usuário:', error);
    }
}

document.getElementById('Atualizar').addEventListener('click', (event) => {
    event.preventDefault();
    alterarTabela();
});

//FUNÇÃO EXCLUIR USUÁRIO 

async function deletarUsuario() {
    const idUsuario = localStorage.getItem('idUsuarioSelecionado');

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            const url = `${API_URLS.Usuario}/${idUsuario}`;
            console.log('URL da requisição DELETE:', url);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao excluir usuário: ${errorMessage}`);
            }

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            alert('Usuário excluído com sucesso!');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir usuário. Por favor, tente novamente.');
        }
    }
}