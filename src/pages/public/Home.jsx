import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSections, getNewsPublicBySection } from "../../services/db";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";
import { NewspaperIcon } from "@heroicons/react/24/solid";

import "react-lazy-load-image-component/src/effects/opacity.css"; // ✅ más natural

export default function Home() {
  const [sections, setSections] = useState([]);
  const [bySection, setBySection] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const secs = await getSections();
      setSections(secs);
      const data = {};
      for (const s of secs) {
        data[s.id] = await getNewsPublicBySection(s.id, 6);
      }
      setBySection(data);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <NewspaperIcon className="h-10 w-10 animate-pulse mb-2" />
        Cargando noticias...
      </div>
    );

  return (
    <div className="space-y-16 pb-10">
      {sections.map((s, index) => (
        <motion.section
          key={s.id}
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-sky-600">{s.name}</h2>
            <Link
              to={`/seccion/${s.slug}`}
              className="text-sm text-sky-500 hover:underline"
            >
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(bySection[s.id] || []).map((n, i) => (
              <motion.div
                key={n.id}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <LazyLoadImage
                    src={n.imageUrl}
                    alt={n.title}
                    effect="opacity" // ✅ quita el blur, usa fundido suave
                    className="w-full h-auto object-cover aspect-video group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-sky-600 transition">
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {n.subtitle}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>{n.authorName || "—"}</span>
                    <span>
                      {new Date(n.createdAt?.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/noticia/${n.id}`}
                  className="absolute inset-0 bg-black/0 hover:bg-black/5 transition"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}

      {sections.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No hay secciones registradas todavía.
        </div>
      )}
    </div>
  );
}
