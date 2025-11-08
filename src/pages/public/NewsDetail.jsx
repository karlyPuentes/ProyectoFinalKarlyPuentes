import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNews, getNewsPublicBySection } from "../../services/db";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import "react-lazy-load-image-component/src/effects/opacity.css";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    (async () => {
      const doc = await getNews(id);
      if (doc) {
        setNews(doc);
        const rel = await getNewsPublicBySection(doc.sectionId, 3);
        setRelated(rel.filter((r) => r.id !== id));
      }
    })();
  }, [id]);

  if (!news)
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Cargando noticia...
      </div>
    );

  const date = new Date(news.createdAt?.seconds * 1000).toLocaleDateString(
    "es-ES",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <motion.article
      className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 🔹 HEADER */}
      <div className="space-y-5 text-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-sky-600 hover:text-rose-600 hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Volver al inicio
        </Link>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          {news.title}
        </h1>
        <p className="text-lg text-gray-600 italic max-w-3xl mx-auto">
          {news.subtitle}
        </p>

        <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <UserCircleIcon className="h-4 w-4" />
            {news.authorName}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {date}
          </div>
        </div>
      </div>

      {/* 🔹 IMAGE CENTRADA */}
      <motion.div
        className="relative overflow-hidden rounded-3xl shadow-lg w-full aspect-[16/9] flex items-center justify-center bg-gray-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <LazyLoadImage
          src={news.imageUrl}
          alt={news.title}
          effect="opacity"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* 🔹 CONTENT */}
      <div
        className="prose prose-lg max-w-none text-gray-800 prose-headings:text-sky-600 prose-a:text-sky-500 prose-a:hover:text-rose-600"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* 🔹 RELATED */}
      {related.length > 0 && (
        <motion.div
          className="pt-10 border-t border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Más de esta sección
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r, i) => (
              <motion.div
                key={r.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  <LazyLoadImage
                    src={r.imageUrl}
                    alt={r.title}
                    effect="opacity"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 group-hover:text-sky-600 transition">
                    {r.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {r.subtitle}
                  </p>
                  <Link
                    to={`/noticia/${r.id}`}
                    className="text-sky-600 hover:text-rose-600 hover:underline text-sm mt-2 inline-block font-medium"
                  >
                    Leer más →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
