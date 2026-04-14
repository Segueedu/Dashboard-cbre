import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, LogIn, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Admin', icon: Settings, path: '/admin' },
    { title: 'Login', icon: LogIn, path: '/login' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <LayoutDashboard className="text-primary-foreground w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight">CBRE Dash</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
              location.pathname === item.path
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              location.pathname === item.path ? "text-primary" : "group-hover:text-foreground"
            )} />
            {item.title}
            {location.pathname === item.path && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 border border-primary/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium">Conectado ao Seguedu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
