// Calculadora baseada na Reforma Tributária
// EC 132/2024 e LCP 214/2024

// Alíquotas base da Reforma Tributária (conforme LCP 214/2024)
// CBS: Contribuição sobre Bens e Serviços (União)
// IBS: Imposto sobre Bens e Serviços (Estados e Municípios)

// Cronograma de transição conforme legislação (2025-2033)
// Nota: As alíquotas podem variar por setor e região
const CRONOGRAMA_TRANSICAO = {
  2025: { 
    cbs: 0.12,           // 12% - CBS (União)
    ibs_estadual: 0.09,  // 9% - IBS Estadual
    ibs_municipal: 0.01, // 1% - IBS Municipal
    total: 0.22          // 22% - Total
  },
  2026: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2027: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2028: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2029: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2030: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2031: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2032: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 },
  2033: { cbs: 0.12, ibs_estadual: 0.09, ibs_municipal: 0.01, total: 0.22 }
};

// Fatores de ajuste por porte e setor (simplificado)
const FATORES_AJUSTE = {
  'ME': { // Microempresa
    reducao_cbs: 0.02, // Redução de 2% na CBS
    reducao_ibs: 0.01  // Redução de 1% no IBS
  },
  'EPP': { // Empresa de Pequeno Porte
    reducao_cbs: 0.01,
    reducao_ibs: 0.005
  },
  'DEMAIS': {
    reducao_cbs: 0,
    reducao_ibs: 0
  }
};

// Alíquotas aproximadas dos regimes atuais (para comparação)
// Baseado em médias do sistema tributário atual
const REGIMES_ATUAIS = {
  'SIMPLES_NACIONAL': {
    aliquota_media: 0.06, // Varia de 4% a 19% conforme faturamento e atividade
    nome: 'Simples Nacional',
    descricao: 'Regime simplificado de tributação',
    impostos: ['ICMS', 'ISS', 'IRPJ', 'CSLL', 'PIS', 'COFINS', 'INSS']
  },
  'LUCRO_PRESUMIDO': {
    aliquota_media: 0.15, // IRPJ (1,2% a 2,88%) + CSLL (1,08% a 2,88%) + PIS/COFINS (3,65%)
    nome: 'Lucro Presumido',
    descricao: 'Tributação sobre lucro presumido',
    impostos: ['ICMS', 'ISS', 'IRPJ', 'CSLL', 'PIS', 'COFINS']
  },
  'LUCRO_REAL': {
    aliquota_media: 0.18, // IRPJ (15% sobre lucro) + CSLL (9% sobre lucro) + PIS/COFINS (3,65%)
    nome: 'Lucro Real',
    descricao: 'Tributação sobre lucro real',
    impostos: ['ICMS', 'ISS', 'IRPJ', 'CSLL', 'PIS', 'COFINS']
  },
  'MEI': {
    aliquota_media: 0.05, // DAS mensal fixo
    nome: 'MEI',
    descricao: 'Microempreendedor Individual',
    impostos: ['DAS']
  }
};

function calcularImpostosAtuais(faturamento, regime) {
  const regimeData = REGIMES_ATUAIS[regime] || REGIMES_ATUAIS['LUCRO_PRESUMIDO'];
  const baseCalculo = faturamento;
  const imposto = baseCalculo * regimeData.aliquota_media;
  
  return {
    baseCalculo,
    imposto,
    aliquota: regimeData.aliquota_media,
    regime: regimeData.nome
  };
}

function calcularImpostosNovos(faturamento, ano, dadosEmpresa = null) {
  const cronograma = CRONOGRAMA_TRANSICAO[ano] || CRONOGRAMA_TRANSICAO[2025];
  const baseCalculo = faturamento;
  
  // Aplicar fatores de ajuste se disponível
  let fatorCBS = 1;
  let fatorIBS = 1;
  
  if (dadosEmpresa && dadosEmpresa.porte) {
    const fator = FATORES_AJUSTE[dadosEmpresa.porte] || FATORES_AJUSTE['DEMAIS'];
    fatorCBS = 1 - fator.reducao_cbs;
    fatorIBS = 1 - fator.reducao_ibs;
  }
  
  const cbs = baseCalculo * cronograma.cbs * fatorCBS;
  const ibsEstadual = baseCalculo * cronograma.ibs_estadual * fatorIBS;
  const ibsMunicipal = baseCalculo * cronograma.ibs_municipal * fatorIBS;
  const total = cbs + ibsEstadual + ibsMunicipal;
  const aliquotaEfetiva = total / baseCalculo;
  
  return {
    baseCalculo,
    cbs,
    ibsEstadual,
    ibsMunicipal,
    total,
    aliquotaTotal: cronograma.total,
    aliquotaEfetiva,
    detalhes: {
      aliquotaCBS: cronograma.cbs * fatorCBS,
      aliquotaIBSEstadual: cronograma.ibs_estadual * fatorIBS,
      aliquotaIBSMunicipal: cronograma.ibs_municipal * fatorIBS,
      fatorAjusteAplicado: dadosEmpresa?.porte || 'N/A'
    }
  };
}

function identificarRegimeAtual(dadosEmpresa) {
  if (!dadosEmpresa || !dadosEmpresa.regime_tributario) {
    return 'LUCRO_PRESUMIDO'; // Default
  }

  const regimes = dadosEmpresa.regime_tributario;
  const ultimoRegime = regimes[regimes.length - 1];
  
  const formaTributacao = ultimoRegime?.forma_de_tributacao?.toUpperCase() || '';
  
  if (formaTributacao.includes('SIMPLES') || dadosEmpresa.opcao_pelo_simples) {
    return 'SIMPLES_NACIONAL';
  }
  if (dadosEmpresa.opcao_pelo_mei) {
    return 'MEI';
  }
  if (formaTributacao.includes('LUCRO REAL')) {
    return 'LUCRO_REAL';
  }
  
  return 'LUCRO_PRESUMIDO';
}

export function calcularSimulacao({
  cnpj,
  dadosEmpresa,
  faturamentoAnual,
  despesasAnuais = 0,
  regimeAtual,
  anoInicio = 2025,
  anoFim = 2033
}) {
  // Identificar regime atual se não informado
  if (!regimeAtual && dadosEmpresa) {
    regimeAtual = identificarRegimeAtual(dadosEmpresa);
  }
  
  if (!regimeAtual) {
    regimeAtual = 'LUCRO_PRESUMIDO';
  }

  const resultados = [];
  let totalEconomia = 0;
  let totalGasto = 0;

  for (let ano = anoInicio; ano <= anoFim; ano++) {
    const impostosAtuais = calcularImpostosAtuais(faturamentoAnual, regimeAtual);
    const impostosNovos = calcularImpostosNovos(faturamentoAnual, ano, dadosEmpresa);
    
    const diferenca = impostosNovos.total - impostosAtuais.imposto;
    const percentualVariacao = impostosAtuais.imposto > 0 
      ? (diferenca / impostosAtuais.imposto) * 100 
      : 0;
    
    if (diferenca < 0) {
      totalEconomia += Math.abs(diferenca);
    } else {
      totalGasto += diferenca;
    }

    resultados.push({
      ano,
      regimeAtual: {
        nome: impostosAtuais.regime,
        aliquota: impostosAtuais.aliquota,
        baseCalculo: impostosAtuais.baseCalculo,
        imposto: impostosAtuais.imposto
      },
      regimeNovo: {
        cbs: impostosNovos.cbs,
        ibsEstadual: impostosNovos.ibsEstadual,
        ibsMunicipal: impostosNovos.ibsMunicipal,
        total: impostosNovos.total,
        aliquotaTotal: impostosNovos.aliquotaTotal,
        aliquotaEfetiva: impostosNovos.aliquotaEfetiva,
        detalhes: impostosNovos.detalhes
      },
      comparativo: {
        diferenca,
        percentualVariacao,
        beneficio: diferenca < 0,
        economia: diferenca < 0 ? Math.abs(diferenca) : 0,
        gastoAdicional: diferenca > 0 ? diferenca : 0,
        economiaPercentual: diferenca < 0 ? Math.abs(percentualVariacao) : 0,
        gastoPercentual: diferenca > 0 ? percentualVariacao : 0
      }
    });
  }

  const totalAnos = anoFim - anoInicio + 1;
  const resumo = {
    totalEconomia,
    totalGasto,
    saldoFinal: totalEconomia - totalGasto,
    beneficioLiquido: totalEconomia > totalGasto,
    economiaMediaAnual: totalEconomia / totalAnos,
    gastoMedioAnual: totalGasto / totalAnos,
    economiaPercentual: totalEconomia > 0 
      ? (totalEconomia / (faturamentoAnual * totalAnos)) * 100 
      : 0,
    gastoPercentual: totalGasto > 0 
      ? (totalGasto / (faturamentoAnual * totalAnos)) * 100 
      : 0,
    anosComBeneficio: resultados.filter(r => r.comparativo.beneficio).length,
    anosComCusto: resultados.filter(r => !r.comparativo.beneficio).length
  };

  return {
    cnpj,
    dadosEmpresa: dadosEmpresa ? {
      razaoSocial: dadosEmpresa.razao_social,
      nomeFantasia: dadosEmpresa.nome_fantasia,
      regimeIdentificado: regimeAtual,
      uf: dadosEmpresa.uf,
      municipio: dadosEmpresa.municipio,
      cnaeFiscal: dadosEmpresa.cnae_fiscal,
      cnaeFiscalDescricao: dadosEmpresa.cnae_fiscal_descricao
    } : null,
    parametros: {
      faturamentoAnual,
      despesasAnuais,
      regimeAtual,
      anoInicio,
      anoFim
    },
    resultados,
    resumo,
    geradoEm: new Date().toISOString()
  };
}

