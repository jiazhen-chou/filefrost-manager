
import { 
  File, 
  FileCheck, 
  History 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Navigation menu items
const navItems = [
  {
    title: "招标文件解析",
    path: "/bid-document-analysis",
    icon: File,
  },
  {
    title: "投标文件检查",
    path: "/tender-document-check",
    icon: FileCheck,
  },
  {
    title: "历史文件",
    path: "/history",
    icon: History,
  },
];

const MainNavbar = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-border">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MainNavbar;
