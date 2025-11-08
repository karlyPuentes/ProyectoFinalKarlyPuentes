import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNews, deleteNews, updateNews } from "../../services/db";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function MyNews() {
  const { user, role } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const list =
        role === "editor"
          ? await getAllNews({ onlyMine: false })
          : await getAllNews({ onlyMine: true, authorId: user.uid });
      setNews(list);
      setLoading(false);
    })();
  }, [user, role]);

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar esta noticia?")) {
      await deleteNews(id);
      setNews(news.filter((n) => n.id !== id));
    }
  };

  const handleToggleStatus = async (n) => {
    const newStatus = n.status === "Publicado" ? "Desactivado" : "Publicado";
    await updateNews(n.id, { status: newStatus });
    setNews(
      news.map((item) =>
        item.id === n.id ? { ...item, status: newStatus } : item
      )
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <GlobeAltIcon className="h-10 w-10 animate-spin mb-2 text-sky-500" />
        Cargando noticias...
      </div>
    );

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <DocumentTextIcon className="h-7 w-7 text-sky-600" />
          {role === "editor" ? "Todas las noticias" : "Mis noticias"}
        </h1>
        <Link
          to="/admin/crear"
          className="btn bg-gradient-to-r from-sky-500 to-rose-500 text-white font-semibold shadow-md hover:opacity-90"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Nueva noticia
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="text-gray-500 text-center py-20">
          No hay noticias registradas todavía.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <motion.div
              key={n.id}
              className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={
                    n.imageUrl ||
                    "https://via.placeholder.com/600x400?text=Sin+Imagen"
                  }
                  alt={n.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-gray-800 line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {n.subtitle || "Sin subtítulo"}
                </p>
                <div className="flex justify-between items-center pt-3 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${
                      n.status === "Publicado"
                        ? "bg-green-100 text-green-700"
                        : n.status === "Terminado"
                        ? "bg-blue-100 text-blue-700"
                        : n.status === "Edición"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {n.status}
                  </span>
                  <span className="text-gray-400">
                    {new Date(n.createdAt?.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <Link
                  to={`/noticia/${n.id}`}
                  className="p-2 bg-gray-700/80 rounded-full text-white hover:bg-gray-800"
                  title="Ver noticia"
                >
                  <EyeIcon className="h-5 w-5" />
                </Link>
                <Link
                  to={`/admin/editar/${n.id}`}
                  className="p-2 bg-blue-600/80 rounded-full text-white hover:bg-blue-700"
                  title="Editar"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                {role === "editor" && (
                  <button
                    onClick={() => handleToggleStatus(n)}
                    className="p-2 bg-green-600/80 rounded-full text-white hover:bg-green-700"
                    title="Publicar / Desactivar"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-700"
                  title="Eliminar"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`h-5 w-5 ${props.className || ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
