import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { LayoutDashboard, Package, ClipboardList, LogOut, Fish, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();
  const { mutate: logout } = useLogout();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>;
  }

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ClipboardList },
    { label: "Sections", href: "/admin/sections", icon: LayoutList },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Fish className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="px-4 py-3 mb-2 rounded-lg bg-secondary/50 text-sm font-medium">
            Signed in as <span className="font-bold text-primary">{user.username}</span>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-card border-b flex items-center px-4 md:hidden justify-between">
          <span className="font-display font-bold text-lg">Admin Panel</span>
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOut className="w-5 h-5 text-destructive" />
          </Button>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden border-b bg-card overflow-x-auto">
          <div className="flex px-4 py-2 gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Badge variant={location === item.href ? "default" : "secondary"} className="px-3 py-1.5 text-sm whitespace-nowrap cursor-pointer">
                  {item.label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Quick component for mobile nav badges
import { Badge } from "@/components/ui/badge";
