import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { OSRow } from '../types/os.types';
import { supabase } from '../lib/supabase';

const MAPEAMENTO_STATUS: Record<string, string> = {
  APPR: 'Aprovado',
  INPRG: 'Em Andamento',
  RVWD: 'Revisado',
  WAPPR: 'Aguardando Aprovação',
  WSCH: 'Aguardando Planejamento',
  WSHED: 'Aguardando Parada',
  WMATL: 'Aguardando Material',
  SCHED: 'Agendado',
};

function formatarDadosOS(dadosRaw: OSRow[]): OSRow[] {
  return dadosRaw.map((os) => {
    let statusFormatado = os['Status'];
    if (typeof statusFormatado === 'string') {
      const stLimp = statusFormatado.trim().toUpperCase();
      if (MAPEAMENTO_STATUS[stLimp]) {
        statusFormatado = MAPEAMENTO_STATUS[stLimp];
      }
    }
    return { ...os, Status: statusFormatado };
  });
}

interface OSDataContextType {
  dados: OSRow[];
  setDadosFromUpload: (data: OSRow[]) => void;
  limparDados: () => void;
  ultimaAtualizacao: Date | null;
  totalRegistros: number;
}

const OSDataContext = createContext<OSDataContextType | undefined>(undefined);

export const OSDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dados, setDados] = useState<OSRow[]>([]);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

  // Buscar dados consolidados do Servidor do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('dashboard_cache')
          .select('payload, updated_at')
          .eq('id', 1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('Nenhum dado inicial no Supabase encontrado.');
          } else {
            console.error('Erro na Query do Supabase:', error);
          }
          return;
        }

        if (data && data.payload) {
          setDados(formatarDadosOS(data.payload as OSRow[]));
          setUltimaAtualizacao(new Date(data.updated_at));
        }
      } catch (err) {
        console.error('Falha geral ao conectar Supabase:', err);
      }
    }
    loadData();

    // Podemos também configurar um real-time listener da supabase posteriormente aqui no futuro se for da vontade do sistema.
  }, []);

  const setDadosFromUpload = useCallback(async (data: OSRow[]) => {
    // Formatar antes de salvar
    const formattedData = formatarDadosOS(data);
    const now = new Date();
    
    setDados(formattedData);
    setUltimaAtualizacao(now);

    // Enviar em tempo real para a nuvem
    try {
      const { error } = await supabase.from('dashboard_cache').upsert({
        id: 1,
        payload: formattedData,
        updated_at: now.toISOString()
      }, { onConflict: 'id' });

      if (error) {
        console.error('Erro ao subir dados para a nuvem:', error);
      } else {
        console.log('Planilha enviada para a Nuvem com Sucesso!');
      }
    } catch (err) {
      console.error('Falha de Rede ao subir Planilha', err);
    }
  }, []);

  const limparDados = useCallback(async () => {
    setDados([]);
    setUltimaAtualizacao(null);
    try {
      const { error } = await supabase.from('dashboard_cache').delete().eq('id', 1);
      if (error) console.error('Erro ao limpar nuvem:', error);
    } catch (err) {
      // Ignorar erros locais
    }
  }, []);

  return (
    <OSDataContext.Provider
      value={{
        dados,
        setDadosFromUpload,
        limparDados,
        ultimaAtualizacao,
        totalRegistros: dados.length,
      }}
    >
      {children}
    </OSDataContext.Provider>
  );
};

export const useOSData = (): OSDataContextType => {
  const context = useContext(OSDataContext);
  if (!context) {
    throw new Error('useOSData deve ser usado dentro de um OSDataProvider');
  }
  return context;
};
