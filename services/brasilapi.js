import axios from 'axios';

const BRASIL_API_BASE = 'https://brasilapi.com.br/api/cnpj/v1';

export async function buscarCNPJ(cnpj) {
  try {
    // Remove formatação do CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }

    const response = await axios.get(`${BRASIL_API_BASE}/${cnpjLimpo}`, {
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('CNPJ não encontrado');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout ao buscar CNPJ. Tente novamente.');
    }
    throw new Error(`Erro ao buscar CNPJ: ${error.message}`);
  }
}

