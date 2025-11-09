import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Brain, LogOut, LayoutDashboard, Users, BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const navItems = {
    student: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
      { icon: BookOpen, label: "Performance", path: "/student/performance" },
      { icon: ClipboardList, label: "Attendance", path: "/student/attendance" },
    ],
    teacher: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/teacher" },
      { icon: ClipboardList, label: "Marks Entry", path: "/teacher/marks" },
      { icon: Users, label: "Students", path: "/teacher/students" },
    ],
    mentor: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/mentor" },
      { icon: Users, label: "My Students", path: "/mentor/students" },
      { icon: ClipboardList, label: "At Risk", path: "/mentor/at-risk" },
    ],
    hod: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/hod" },
      { icon: Users, label: "Department", path: "/hod/department" },
      { icon: BookOpen, label: "Analytics", path: "/hod/analytics" },
    ],
  };

  const currentNavItems = navItems[role as keyof typeof navItems] || navItems.student;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MentorTrack AI</h1>
                <p className="text-sm text-muted-foreground capitalize">{role} Portal</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <nav className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {currentNavItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "gap-2 whitespace-nowrap",
                    location.pathname === item.path && "shadow-md"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
