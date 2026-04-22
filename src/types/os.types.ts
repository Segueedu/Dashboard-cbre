/**
 * Interface principal para cada linha da planilha de Ordens de Serviço.
 * Os nomes das propriedades correspondem exatamente aos cabeçalhos do Excel.
 */
export interface OSRow {
  'Ordem de Serviço': string | number;
  'Relatado Em': string | Date;
  'Grupo de Serviço': string;
  'Equipe': string;
  'Local': string;
  'Status': string;
  'Tipo de Serviço': string;
  'Terminar Não Após De': string | Date;
  'Ativo': string;
  // Campos opcionais solicitados no Detalhamento
  'Descrição'?: string;
  'Relatado Por'?: string;
  // Campos calculados (adicionados pós-processamento)
  diasSemClassificar?: number;
  statusVencimento?: 'VENCIDA' | 'VENCE_HOJE' | 'URGENTE' | 'ATENCAO' | 'NO_PRAZO';
  diasParaVencer?: number;
}

/**
 * Resultado do cálculo de status de vencimento agregado
 */
export interface StatusVencimentoAgregado {
  vencidas: number;
  venceHoje: number;
  urgentes: number;
  atencao: number;
  noPrazo: number;
}

/**
 * Estado dos filtros ativos no dashboard
 */
export interface FiltrosDashboard {
  equipe: string;
  local: string;
  ordemServico: string;
  tipoServico: string;
  status: string;
  periodoInicio: string;
  periodoFim: string;
}

export const FILTROS_INICIAIS: FiltrosDashboard = {
  equipe: 'Todos',
  local: 'Todos',
  ordemServico: '',
  tipoServico: 'Todos',
  status: 'Todos',
  periodoInicio: '',
  periodoFim: '',
};
