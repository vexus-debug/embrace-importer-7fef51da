import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { HelpButton } from "./HelpButton";

export function AdminHeader() {
  const navigate = useNavigate();
  const { profile, roles, signOut } = useAuth();

  const displayName = profile?.full_name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const roleName = roles[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : "Staff";

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 border border-border bg-background text-foreground hover:bg-accent shadow-sm rounded-md flex items-center justify-center" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, appointments..."
            className="pl-9 w-72 h-9 bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HelpButton />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate("/admin/notifications")}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-tight">{displayName}</p>
                <p className="text-[11px] text-muted-foreground">{roleName}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/")}>Back to Website</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
