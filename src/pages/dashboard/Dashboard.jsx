import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  NewspaperIcon,
  Squares2X2Icon,
  PlusCircleIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const location = useLocation();
  const { role } = useAuth(); // ✅ se obtiene el rol desde el contexto

  // 🔹 Construcción dinámica del menú
  const navLinks = [
    { to: "/admin/mis-noticias", label: "Mis noticias", icon: NewspaperIcon },
    ...(role === "editor"
      ? [
          { to: "/admin/todas", label: "Todas las noticias", icon: Squares2X2Icon },
          { to: "/admin/secciones", label: "Secciones", icon: FolderIcon },
        ]
      : []),
    { to: "/admin/crear", label: "Nueva noticia", icon: PlusCircleIcon },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 🔹 Barra de navegación interna */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
        {navLinks.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-sky-500"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 🔹 Contenido principal */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <Outlet />
      </div>
    </motion.div>
  );
}
