import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import type { OSRow } from '../../types/os.types';

/* ─────────────────────────────────────────
   Tabela: OS sem classificação
   ───────────────────────────────────────── */
interface SemClassificacaoTableProps {
  dados: OSRow[];
  thresholdDias?: number;
}

export const SemClassificacaoTable: React.FC<SemClassificacaoTableProps> = ({
  dados,
  thresholdDias = 15,
}) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ordenados = dados
    .filter((os) => {
      const grupoServico = os['Grupo de Serviço'];
      const equipe = os['Equipe'];
      const noG = !grupoServico || (typeof grupoServico === 'string' && grupoServico.trim() === '');
      const noE = !equipe || (typeof equipe === 'string' && equipe.trim() === '');
      return noG || noE;
    })
    .map((os) => {
      const relatadoEm = os['Relatado Em'];
      let dias = 0;
      if (relatadoEm) {
        const dataAbertura = new Date(relatadoEm);
        if (!isNaN(dataAbertura.getTime())) {
          dias = Math.max(0, Math.ceil((hoje.getTime() - dataAbertura.getTime()) / (1000 * 60 * 60 * 24)));
        }
      }
      return { ...os, diasSemClassificar: dias };
    })
    .sort((a, b) => (b.diasSemClassificar || 0) - (a.diasSemClassificar || 0));

  if (ordenados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-sm font-bold">Todas as OS estão classificadas</p>
        <p className="text-xs text-muted-foreground mt-1">Nenhuma ordem pendente de classificação</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-accent/40">
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Ordem de Serviço
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Relatado Em
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Equipe
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Local
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Dias s/ Classif.
            </th>
          </tr>
        </thead>
        <tbody>
          {ordenados.slice(0, 20).map((os, i) => {
            const dias = os.diasSemClassificar || 0;
            const isCritico = dias >= thresholdDias;
            return (
              <tr
                key={`${os['Ordem de Serviço']}-${i}`}
                className={`transition-colors ${isCritico ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-primary/5'}`}
              >
                <td className="p-3 text-sm font-bold border-b border-border/30 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    {isCritico && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    #{String(os['Ordem de Serviço'])}
                  </span>
                </td>
                <td className="p-3 text-sm font-medium border-b border-border/30 whitespace-nowrap text-muted-foreground">
                  {formatarData(os['Relatado Em'])}
                </td>
                <td className="p-3 text-sm font-medium border-b border-border/30 whitespace-nowrap">
                  {os['Equipe'] || '—'}
                </td>
                <td className="p-3 text-sm font-medium border-b border-border/30 whitespace-nowrap text-muted-foreground">
                  {os['Local'] || '—'}
                </td>
                <td className="p-3 border-b border-border/30 whitespace-nowrap">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      dias >= thresholdDias
                        ? 'bg-red-500/15 text-red-400'
                        : dias >= 7
                          ? 'bg-orange-500/15 text-orange-400'
                          : dias >= 3
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                    }`}
                  >
                    {dias} dia{dias !== 1 ? 's' : ''}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {ordenados.length > 20 && (
        <p className="text-xs font-bold text-center text-muted-foreground py-3 tracking-widest uppercase">
          Mostrando 20 de {ordenados.length} ordens
        </p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Tabela: Vencimentos Próximos e Vencidas
   ───────────────────────────────────────── */
interface VencimentosTableProps {
  dados: OSRow[];
}

export const VencimentosTable: React.FC<VencimentosTableProps> = ({ dados }) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ordenados = dados
    .filter((os) => {
      const terminar = os['Terminar Não Após De'];
      if (!terminar) return false;
      const statusOS = os['Status'];
      if (statusOS && typeof statusOS === 'string' && statusOS.toLowerCase().includes('concluída')) return false;
      const dataLimite = new Date(terminar);
      if (isNaN(dataLimite.getTime())) return false;
      dataLimite.setHours(0, 0, 0, 0);
      const diff = Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 7; // Vencidas + próximos 7 dias
    })
    .map((os) => {
      const dataLimite = new Date(os['Terminar Não Após De']);
      dataLimite.setHours(0, 0, 0, 0);
      const diasParaVencer = Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      let statusVencimento: 'VENCIDA' | 'VENCE_HOJE' | 'URGENTE' | 'ATENCAO' | 'NO_PRAZO';
      if (diasParaVencer < 0) statusVencimento = 'VENCIDA';
      else if (diasParaVencer === 0) statusVencimento = 'VENCE_HOJE';
      else if (diasParaVencer <= 3) statusVencimento = 'URGENTE';
      else statusVencimento = 'ATENCAO';
      return { ...os, diasParaVencer, statusVencimento };
    })
    .sort((a, b) => (a.diasParaVencer ?? 0) - (b.diasParaVencer ?? 0));

  if (ordenados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <p className="text-sm font-bold">Nenhum vencimento nos próximos 7 dias</p>
        <p className="text-xs text-muted-foreground mt-1">Tudo sob controle</p>
      </div>
    );
  }

  const STATUS_BADGE: Record<string, string> = {
    VENCIDA: 'bg-red-500/15 text-red-400',
    VENCE_HOJE: 'bg-red-500/20 text-red-300',
    URGENTE: 'bg-orange-500/15 text-orange-400',
    ATENCAO: 'bg-amber-500/15 text-amber-400',
  };

  const STATUS_LABEL: Record<string, string> = {
    VENCIDA: '🔴 Vencida',
    VENCE_HOJE: '🔴 Vence hoje',
    URGENTE: '🟠 Urgente',
    ATENCAO: '🟡 Atenção',
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-accent/40">
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Ordem de Serviço
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Grupo de Serviço
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Equipe
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Data Limite
            </th>
            <th className="p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {ordenados.slice(0, 20).map((os, i) => (
            <tr
              key={`${os['Ordem de Serviço']}-${i}`}
              className={`transition-colors ${
                os.statusVencimento === 'VENCIDA' ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-primary/5'
              }`}
            >
              <td className="p-3 text-sm font-bold border-b border-border/30 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  {os.statusVencimento === 'VENCIDA' && <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                  #{String(os['Ordem de Serviço'])}
                </span>
              </td>
              <td className="p-3 text-sm font-medium border-b border-border/30 whitespace-nowrap">
                {os['Grupo de Serviço'] || '—'}
              </td>
              <td className="p-3 text-sm font-medium border-b border-border/30 whitespace-nowrap">
                {os['Equipe'] || '—'}
              </td>
              <td className="p-3 text-sm font-medium border-b border-border/30 whitespace-nowrap text-muted-foreground">
                {formatarData(os['Terminar Não Após De'])}
              </td>
              <td className="p-3 border-b border-border/30 whitespace-nowrap">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    STATUS_BADGE[os.statusVencimento || ''] || 'bg-slate-500/10 text-slate-400'
                  }`}
                >
                  {STATUS_LABEL[os.statusVencimento || ''] || os.statusVencimento}{' '}
                  ({os.diasParaVencer !== undefined
                    ? os.diasParaVencer < 0
                      ? `${Math.abs(os.diasParaVencer)}d atrás`
                      : os.diasParaVencer === 0
                        ? 'hoje'
                        : `${os.diasParaVencer}d`
                    : '—'})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {ordenados.length > 20 && (
        <p className="text-xs font-bold text-center text-muted-foreground py-3 tracking-widest uppercase">
          Mostrando 20 de {ordenados.length} ordens
        </p>
      )}
    </div>
  );
};

/* ────────── Utilidades ────────── */
function formatarData(valor: string | Date | undefined | null): string {
  if (!valor) return '—';
  const data = new Date(valor);
  if (isNaN(data.getTime())) return String(valor);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
