import { db } from "@/db";
import { categories, categoryTranslations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createCategory, deleteCategory } from "./actions";
import { FolderPlus, Trash2 } from "lucide-react";

export default async function CategoriesPage() {
  // Получаем список категорий со всеми их переводами
  const allCategories = await db.select().from(categories);
  const translations = await db.select().from(categoryTranslations);

  // Группируем переводы по categoryId
  const items = allCategories.map((cat) => {
    const catTranslations = translations.filter((t) => t.categoryId === cat.id);
    const ru = catTranslations.find((t) => t.lang === "ru");
    const en = catTranslations.find((t) => t.lang === "en");
    return {
      ...cat,
      ruTitle: ru?.title || "Без названия",
      enTitle: en?.title || "No title",
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Рубрики сайта</h1>
        <p className="text-slate-500 text-sm mt-1">
          Категории для группировки статей и новостей с поддержкой мультиязычного перевода.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Форма добавления новой рубрики */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-1 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            Добавить рубрику
          </h2>

          <form action={createCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Слаг (URL)
              </label>
              <input
                type="text"
                name="slug"
                placeholder="tech-news"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Вкладка/секция RU */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                🇷🇺 Русский язык
              </span>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Название (RU)</label>
                <input
                  type="text"
                  name="title_ru"
                  placeholder="Технологии"
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Описание (RU)</label>
                <input
                  type="text"
                  name="desc_ru"
                  placeholder="Новости из мира IT"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Вкладка/секция EN */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                🇬🇧 English
              </span>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Title (EN)</label>
                <input
                  type="text"
                  name="title_en"
                  placeholder="Technology"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Description (EN)</label>
                <input
                  type="text"
                  name="desc_en"
                  placeholder="IT and high tech news"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow transition"
            >
              Создать рубрику
            </button>
          </form>
        </div>

        {/* Список существующих рубрик */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Список рубрик ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Рубрик пока нет. Создайте первую рубрику через форму слева.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800 text-base">
                        {item.ruTitle}
                      </span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        /{item.slug}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      EN: <span className="font-medium text-slate-700">{item.enTitle}</span>
                    </div>
                  </div>

                  <form action={deleteCategory.bind(null, item.id)}>
                    <button
                      type="submit"
                      title="Удалить"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}