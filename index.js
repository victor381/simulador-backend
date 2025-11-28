import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { calcularSimulacao } from './services/calculadora.js';
import { buscarCNPJ } from './services/brasilapi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configurado para aceitar requisições de qualquer origem
// Em produção, você pode restringir para o domínio do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Buscar dados do CNPJ
app.get('/api/cnpj/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;
    const dados = await buscarCNPJ(cnpj);
    res.json(dados);
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar dados do CNPJ',
      message: error.message 
    });
  }
});

// Simular cenário fiscal
app.post('/api/simular', async (req, res) => {
  try {
    const {
      cnpj,
      dadosEmpresa,
      faturamentoAnual,
      despesasAnuais,
      regimeAtual,
      anoInicio = 2025,
      anoFim = 2033
    } = req.body;

    const resultado = calcularSimulacao({
      cnpj,
      dadosEmpresa,
      faturamentoAnual,
      despesasAnuais,
      regimeAtual,
      anoInicio,
      anoFim
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao simular:', error);
    res.status(500).json({ 
      error: 'Erro ao calcular simulação',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

