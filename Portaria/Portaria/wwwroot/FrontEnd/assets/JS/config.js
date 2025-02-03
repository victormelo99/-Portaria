export const API_URLS = {
    Usuario: 'https://localhost:7063/api/Usuario',
    Local: 'https://localhost:7063/api/Local',
    Funcionario: 'https://localhost:7063/api/Funcionario',
    Visitante: 'https://localhost:7063/api/Visitante',
    Terceiro: 'https://localhost:7063/api/Terceiro',
    Veiculo: 'https://localhost:7063/api/Veiculo',
    Acesso: 'https://localhost:7063/api/Acesso',
};

export const Token = () => localStorage.getItem('token');