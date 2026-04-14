import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'Mai', value: 500 },
  { name: 'Jun', value: 900 },
];

const pieData = [
  { name: 'Vendas', value: 400 },
  { name: 'Serviços', value: 300 },
  { name: 'Licenças', value: 200 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-border group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer overflow-hidden relative">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2.5 rounded-xl bg-accent group-hover:bg-primary transition-colors">
        <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <span className={cn(
        "text-xs font-bold px-2.5 py-1 rounded-full",
        trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      )}>
        {change}
      </span>
    </div>
    <div className="relative z-10">
      <h3 className="text-muted-foreground text-sm font-medium mb-1 tracking-tight">{title}</h3>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 transition-all duration-500 group-hover:bg-primary/20" />
  </div>
);

import { cn } from '@/lib/utils';

const Home = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground font-medium">Bem-vindo de volta, Eduardo. Aqui está o resumo das suas operações.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receita Total" value="R$ 124.590" change="+12.5%" icon={DollarSign} trend="up" />
        <StatCard title="Novos Clientes" value="1,248" change="+8.2%" icon={Users} trend="up" />
        <StatCard title="Taxa de Conversão" value="24.3%" change="-1.2%" icon={TrendingUp} trend="down" />
        <StatCard title="Atividade em Tempo Real" value="Active" change="98.2%" icon={Activity} trend="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Performance Mensal</h2>
              <p className="text-sm text-muted-foreground">Volume de transações por canal</p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-secondary" />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-xl">
          <h2 className="text-xl font-bold tracking-tight mb-8">Distribuição de Receita</h2>
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
