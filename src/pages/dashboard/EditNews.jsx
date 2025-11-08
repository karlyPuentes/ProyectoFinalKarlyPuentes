import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNews, getNews, updateNews, getSections } from "../../services/db";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { PencilSquareIcon, PlusCircleIcon, PhotoIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const empty = {
  title: "",
  subtitle: "",
  content: "",
  sectionId: "",
  status: "Edición",
  imageUrl: "",
};

export default function EditNews({ isCreate = false }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, role } = useAuth();
  const [data, setData] = useState(empty);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const canChangeStatus = role === "editor";

  useEffect(() => {
    (async () => {
      const secs = await getSections();
      setSections(secs);
      if (!isCreate && id) {
        const doc = await getNews(id);
        if (doc) setData({ ...empty, ...doc });
      }
    })();
  }, [id, isCreate]);

  const onChange = (e) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        sectionId: data.sectionId,
        imageUrl: data.imageUrl || "",
        status: data.status,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorRole: role,
      };
      if (isCreate) {
        await createNews(payload);
      } else {
        await updateNews(id, payload);
      }
      nav("/admin/mis-noticias");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        {isCreate ? (
          <PlusCircleIcon className="h-8 w-8 text-sky-600" />
        ) : (
          <PencilSquareIcon className="h-8 w-8 text-sky-600" />
        )}
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isCreate ? "Crear nueva noticia" : "Editar noticia"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Título y subtítulo */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Título</label>
            <input
              className="input"
              name="title"
              value={data.title}
              onChange={onChange}
              required
              placeholder="Ej: Festival de Teatro de Bogotá"
            />
          </div>
          <div>
            <label className="label">Subtítulo</label>
            <input
              className="input"
              name="subtitle"
              value={data.subtitle}
              onChange={onChange}
              placeholder="Ej: Más de 200 artistas llenan la capital de cultura"
            />
          </div>
        </div>

        {/* Sección y estado */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Sección</label>
            <select
              className="select"
              name="sectionId"
              value={data.sectionId}
              onChange={onChange}
              required
            >
              <option value="">Seleccione una sección</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Estado</label>
            <select
              className="select"
              name="status"
              value={data.status}
              onChange={onChange}
              disabled={!canChangeStatus && !isCreate}
            >
              <option>Edición</option>
              <option>Terminado</option>
              <option>Publicado</option>
              <option>Desactivado</option>
            </select>
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="label flex items-center gap-2">
            <PhotoIcon className="h-5 w-5 text-gray-500" />
            Imagen (URL en línea)
          </label>
          <input
            className="input"
            name="imageUrl"
            value={data.imageUrl}
            onChange={onChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {data.imageUrl && (
            <motion.div
              className="relative w-full aspect-video mt-3 rounded-xl overflow-hidden shadow-md border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={data.imageUrl}
                alt="Vista previa"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </motion.div>
          )}
        </div>

        {/* Contenido */}
        <div>
          <label className="label flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
            Contenido (HTML o texto)
          </label>
          <textarea
            className="input"
            name="content"
            rows="8"
            value={data.content}
            onChange={onChange}
            placeholder="<p>Texto de la noticia...</p>"
          ></textarea>
        </div>

        {/* Botón guardar */}
        <motion.button
          type="submit"
          disabled={saving}
          className="btn w-full bg-gradient-to-r from-sky-500 to-rose-500 hover:from-sky-600 hover:to-rose-600 text-white font-bold text-lg shadow-md"
          whileTap={{ scale: 0.97 }}
        >
          {saving
            ? "Guardando..."
            : isCreate
            ? "Publicar noticia"
            : "Actualizar noticia"}
        </motion.button>
      </form>
    </motion.div>
  );
}
