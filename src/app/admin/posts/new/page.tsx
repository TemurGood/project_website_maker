"use client";

import React, { useState, useEffect } from "react";
import VisualEditor from "@/components/editor/VisualEditor";
import { savePost } from "../actions";
import { ArrowLeft, Save, Image as ImageIcon, Folder } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorBlock } from "@/types/editor";

export default function NewPostCreator() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptRu, setExcerptRu] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [template, setTemplate] = useState("classic");
  const [categoriesList, setCategoriesList] = useState<{ id: string; title: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [blocksByLang, setBlocksByLang] = useState<Record<string, EditorBlock[]>>({
    ru: [
      {
        id: "post_b1",
        type: "paragraph",
        content: { text: "Начните писать текст вашей новости здесь..." },
        styles: { fontSize: "16px", marginBottom: 12 },
      },
    ],
    en: [
      {
        id: "post_b1",
        type: "paragraph",
        content: { text: "Start writing your article content here..." },
        styles: { fontSize: "16px", marginBottom: 12 },
      },
    ],
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategoriesList(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !titleRu) {
      alert("Пожалуйста, укажите URL и заголовок статьи!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await savePost({
        slug,
        categoryId: categoryId || null,
        template,
        featuredImage: featuredImage || null,
        isPublished: true,
        titles: { ru: titleRu, en: titleEn },
        excerpts: { ru: excerptRu, en: excerptEn },
        blocksByLang,
      });

      if (res?.success) {
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (err: any) {
      alert("Ошибка при сохранении: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Новая статья / новость</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Создание публикации с привязкой к рубрике и блочным редактором
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-medium text-sm rounded-xl shadow transition"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Сохранение..." : "Опубликовать новость"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              URL / Слаг статьи *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tech-breakthrough"
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-blue-600" /> Рубрика (Категория)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none"
            >
              <option value="">Без рубрики</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" /> URL обложки новости
            </label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            🇷🇺 Русский язык *
          </span>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Заголовок статьи</label>
            <input
              type="text"
              value={titleRu}
              onChange={(e) => setTitleRu(e.target.value)}
              placeholder="Заголовок новости"
              required
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Краткий анонс</label>
            <textarea
              rows={2}
              value={excerptRu}
              onChange={(e) => setExcerptRu(e.target.value)}
              placeholder="Короткое описание для каталога..."
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            🇬🇧 English
          </span>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Post Title</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Article Title"
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Short Excerpt</label>
            <textarea
              rows={2}
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              placeholder="Summary for blog feed..."
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Тело статьи (смена порядка блоков и оформление без CSS):
        </label>
        <VisualEditor
          initialBlocksByLang={blocksByLang}
          activeLanguages={[
            { code: "ru", name: "Русский" },
            { code: "en", name: "English" },
          ]}
          onChange={(updated) => setBlocksByLang(updated)}
        />
      </div>
    </form>
  );
}