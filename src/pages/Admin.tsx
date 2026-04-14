import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle2, Database, LayoutPanelTop, Download, Trash2, Save, CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';

const Admin = () => {
  const [data, setData] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileInfo({ name: file.name, size: (file.size / 1024).toFixed(2) + ' KB' });

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setData(jsonData);
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveToSupabase = async () => {
    setLoading(true);
    // Simulação de persistência
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Gestão de Dados</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <LayoutPanelTop className="w-4 h-4 text-primary" />
            Importação e processamento de planilhas Excel
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-accent/50 hover:bg-accent border border-border px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-[0.98]">
            <Download className="w-4 h-4" />
            Modelo Excel
          </button>
          <button 
            disabled={data.length === 0 || loading}
            onClick={handleSaveToSupabase}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20",
              data.length > 0 ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {loading ? <CloudUpload className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />}
            Sincronizar Cloud
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card/40 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-dashed border-border group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden text-center min-h-[350px] flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:bg-primary transition-all duration-500 shadow-inner group-hover:shadow-primary/50">
              <Upload className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Carregar Planilha</h3>
            <p className="text-muted-foreground text-sm font-medium px-4 mb-2">Arraste seu arquivo Excel ou CSV aqui ou clique para procurar</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Limite: 50MB</p>
          </div>

          {fileInfo && (
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 animate-in zoom-in-95 duration-500 flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-500/20 transition-colors">
                <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-sm">{fileInfo.name}</p>
                <p className="text-xs font-semibold text-muted-foreground tracking-tight">{fileInfo.size}</p>
              </div>
              <button onClick={() => { setData([]); setFileInfo(null); }} className="hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-500/10">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold p-5 rounded-2xl flex items-center gap-3 animate-in slide-in-from-left duration-500">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div className="bg-emerald-500 w-1 h-6 rounded-full" />
              <span className="text-sm">Dados sincronizados com o Supabase com sucesso!</span>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border shadow-2xl overflow-hidden min-h-[500px] flex flex-col group">
            <div className="p-8 border-b border-border bg-gradient-to-r from-card to-accent/20 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Preview dos Dados</h2>
                <p className="text-sm text-muted-foreground font-medium">Visualização prévia das linhas detectadas</p>
              </div>
              <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
                {data.length} Linhas Encontradas
              </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar p-2">
              {data.length > 0 ? (
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-accent/40">
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap first:rounded-tl-2xl">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="hover:bg-primary/5 transition-colors group">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="p-4 text-sm font-medium border-b border-border/30 whitespace-nowrap group-last:border-none">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <Database className="w-24 h-24 mb-6 text-muted-foreground animate-pulse" />
                  <h3 className="text-lg font-bold mb-1">Nenhum dado selecionado</h3>
                  <p className="text-sm max-w-xs mx-auto">Selecione uma planilha Excel para pré-visualizar o conteúdo antes do upload.</p>
                </div>
              )}
            </div>
            
            {data.length > 10 && (
              <div className="p-6 bg-accent/20 border-t border-border mt-auto">
                <p className="text-xs font-bold text-center text-muted-foreground tracking-widest uppercase">
                  Mostrando primeiras 10 de {data.length} linhas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
