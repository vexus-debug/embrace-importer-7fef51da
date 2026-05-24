import { useState } from "react";
import {
  LayoutDashboard, Users, CalendarDays, Stethoscope, Pill, Receipt,
  BarChart3, Package, UserCog, MessageSquare, Bell, Settings, GraduationCap, LogOut,
  FileText, DollarSign, Shield, Armchair, Star, FileCheck, ScrollText, FolderOpen,
  ChevronDown, ChevronRight, UserPlus, ClipboardList, Activity, Heart, Briefcase, Cog,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useInvoices } from "@/hooks/useInvoices";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.jpg";

type RoleKey = "admin" | "dentist" | "receptionist" | "hygienist" | "accountant" | "assistant" | "nurse";

const allRoles: RoleKey[] = ["admin", "dentist", "receptionist", "hygienist", "accountant", "assistant", "nurse"];

interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: RoleKey[];
  badge?: string;
  children?: NavItem[];
}

// Grouped navigation structure
interface NavSection {
  label: string;
  icon: any;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, roles: ["admin"] },
    ],
  },
  {
    label: "Clinical",
    icon: Heart,
    items: [
      {
        title: "Patients", url: "/admin/patients", icon: Users, roles: ["admin", "dentist", "hygienist", "nurse"],
        children: [
          { title: "All Patients", url: "/admin/patients", icon: ClipboardList, roles: ["admin", "dentist", "hygienist", "nurse"] },
          { title: "Add Patient", url: "/admin/patients/add", icon: UserPlus, roles: ["admin"] },
        ],
      },
      { title: "Appointments", url: "/admin/appointments", icon: CalendarDays, roles: ["admin", "dentist", "receptionist", "hygienist", "nurse"] },
      { title: "Chair Schedule", url: "/admin/chairs", icon: Armchair, roles: ["admin", "receptionist"] },
      { title: "Diagnosis", url: "/admin/diagnosis", icon: Activity, roles: ["admin", "dentist", "nurse"] },
      { title: "Clinical Notes", url: "/admin/clinical-notes", icon: FileText, roles: ["admin", "dentist", "hygienist", "nurse"] },
      { title: "Treatments", url: "/admin/treatments", icon: Pill, roles: ["admin", "dentist", "nurse"] },
      { title: "Consent Forms", url: "/admin/consent-forms", icon: FileCheck, roles: ["admin", "dentist", "nurse"] },
    ],
  },
  {
    label: "Financial",
    icon: Briefcase,
    items: [
      { title: "Billing", url: "/admin/billing", icon: Receipt, roles: ["admin", "accountant"], badge: "pending" },
      { title: "Expenses", url: "/admin/expenses", icon: DollarSign, roles: ["admin", "accountant"] },
      { title: "Insurance", url: "/admin/insurance", icon: Shield, roles: ["admin"] },
      { title: "Reports", url: "/admin/reports", icon: BarChart3, roles: ["admin"] },
    ],
  },
  {
    label: "Operations",
    icon: Cog,
    items: [
      { title: "Inventory", url: "/admin/inventory", icon: Package, roles: ["admin", "nurse"] },
      { title: "Staff", url: "/admin/staff", icon: UserCog, roles: ["admin"] },
      { title: "Messaging", url: "/admin/messaging", icon: MessageSquare, roles: ["admin"] },
      { title: "Notifications", url: "/admin/notifications", icon: Bell, roles: ["admin"], badge: "notifications" },
      { title: "Reviews", url: "/admin/reviews", icon: Star, roles: ["admin"] },
      { title: "Documents", url: "/admin/documents", icon: FolderOpen, roles: ["admin"] },
    ],
  },
  {
    label: "System",
    icon: Settings,
    items: [
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText, roles: ["admin"] },
      { title: "Settings", url: "/admin/settings", icon: Settings, roles: ["admin"] },
      { title: "Tutorials", url: "/admin/tutorials", icon: GraduationCap, roles: ["admin"] },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roles, signOut } = useAuth();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { data: invoices = [] } = useInvoices();
  const { data: notifications = [] } = useNotifications();

  const pendingCount = invoices.filter(i => i.status === "pending" || i.status === "overdue").length;
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const userRole = (roles[0] as RoleKey) || "admin";

  const closeMobileMenu = () => { if (isMobile) setOpenMobile(false); };
  const handleLogout = async () => { await signOut(); navigate("/admin/login"); };

  const getBadgeCount = (badge?: string) => {
    if (badge === "pending") return pendingCount;
    if (badge === "notifications") return unreadCount;
    return 0;
  };

  const isChildActive = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(c => location.pathname === c.url || location.pathname.startsWith(c.url + "/"));
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Clinic" className="h-9 w-9 rounded-lg object-cover" />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-sm font-semibold text-sidebar-foreground leading-tight">Dbridge Dental</h2>
            <p className="text-xs text-sidebar-foreground/60">Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(item => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest font-semibold mb-1 flex items-center gap-1.5">
                <section.icon className="h-3 w-3" />
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    if (item.children) {
                      const visibleChildren = item.children.filter(c => c.roles.includes(userRole));
                      if (visibleChildren.length === 0) return null;
                      return (
                        <SubMenuItem
                          key={item.title}
                          item={item}
                          childItems={visibleChildren}
                          defaultOpen={isChildActive(item)}
                          location={location}
                          closeMobileMenu={closeMobileMenu}
                        />
                      );
                    }

                    const isActive = item.url === "/admin"
                      ? location.pathname === "/admin"
                      : location.pathname.startsWith(item.url);
                    const badgeCount = getBadgeCount(item.badge);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            end={item.url === "/admin"}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1">{item.title}</span>
                            {badgeCount > 0 && (
                              <Badge variant="destructive" className="h-5 min-w-5 px-1 text-[10px] font-bold rounded-full">
                                {badgeCount > 99 ? "99+" : badgeCount}
                              </Badge>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full">
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SubMenuItem({ item, childItems, defaultOpen, location, closeMobileMenu }: {
  item: NavItem; childItems: NavItem[]; defaultOpen: boolean; location: any; closeMobileMenu: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer">
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            {open ? <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/50" /> : <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/50" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-4 border-l border-sidebar-border pl-2 space-y-0.5 mt-0.5">
            {childItems.map(child => {
              const isActive = location.pathname === child.url || location.pathname.startsWith(child.url + "/");
              return (
                <SidebarMenuButton key={child.title} asChild isActive={isActive} tooltip={child.title}>
                  <NavLink
                    to={child.url}
                    end
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  >
                    <child.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{child.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
