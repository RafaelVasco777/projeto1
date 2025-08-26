export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    alimentacao: 'Alimentação',
    transporte: 'Transporte',
    moradia: 'Moradia',
    saude: 'Saúde',
    educacao: 'Educação',
    lazer: 'Lazer',
    roupas: 'Roupas',
    tecnologia: 'Tecnologia',
    pagamento_divida: 'Pagamento de Dívida',
    outros: 'Outros'
  };
  return labels[category] || category;
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    debito: 'Cartão de Débito',
    credito: 'Cartão de Crédito',
    pix: 'PIX'
  };
  return labels[method] || method;
};
