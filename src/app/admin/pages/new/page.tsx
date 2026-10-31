"use client";

import React, { useState } from "react";
import VisualEditor from "@/components/editor/VisualEditor";
import { PAGE_TEMPLATES } from "@/lib/templates";
import { savePage } from "../actions";
import { ArrowLeft, Save, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { EditorBlock } from "@/types/editor";

export default function NewPageCreator() {
  const [slug, setSlug] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [template, setTemplate] = useState("landing");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализируем блоки выбранным шаблоном
  const [blocksByLang, setBlocksByLang] = useState<Record<string, EditorBlock[]>>(() => ({
    ru: PAGE_TEMPLATES.landing.getBlocks("ru"),
    en: PAGE_TEMPLATES.landing.getBlocks("en"),
  }));

  // Переключение шаблона с перезаполнением блоков
  const handleApplyTemplate = (tplKey: string) => {
    setTemplate(tplKey);
    const tpl = PAGE_TEMPLATES[tplKey];
    if (tpl) {
      setBlocksByLang({
        ru: tpl.getBlocks("ru"),
        en: tpl.getBlocks("en"),
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !titleRu) {
      alert("Пожалуйста, заполните URL-слаг и заголовок страницы!");
      return;
    }

    setIsSubmitting(true);
    try {
      await savePage({
        slug,
        template,
        isPublished,
        titles: { ru: titleRu, en: titleEn },
        blocksByLang,
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Верхняя шапка действий */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Новая страница</h1>
            <p className="text-xs text-slate-500">Соберите страницу с ручным переводом блоков</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-medium text-sm rounded-xl shadow transition"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Сохранение..." : "Опубликовать страницу"}
        </button>
      </div>

      {/* Мета-информация и Шаблоны */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* URL и Шаблон */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              URL / Слаг страницы *
            </label>
            <div className="flex items-center">
              <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-2 border border-r-0 border-slate-300 rounded-l-lg font-mono">
                /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="about-us или contacts"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-r-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" /> Готовый шаблон
            </label>
            <select
              value={template}
              onChange={(e) => handleApplyTemplate(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none"
            >
              {Object.entries(PAGE_TEMPLATES).map(([key, tpl]) => (
                <option key={key} value={key}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Заголовок RU */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
            🇷🇺 Заголовок страницы (RU) *
          </span>
          <input
            type="text"
            value={titleRu}
            onChange={(e) => setTitleRu(e.target.value)}
            placeholder="Главная страница"
            required
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Заголовок EN */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
            🇬🇧 Page Title (EN)
          </span>
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Home Page"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Интерактивный Drag & Drop конструктор блоков */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Конструктор содержимого (переключайте вкладки RU / EN для ручного перевода):
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