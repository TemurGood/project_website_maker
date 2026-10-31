import { db } from "@/db";
import { pages, pageTranslations } from "@/db/schema";
import Link from "next/link";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { deletePage } from "./actions";

export default async function PagesListPage() {
  const allPages = await db.select().from(pages);
  const translations = await db.select().from(pageTranslations);

  const items = allPages.map((p) => {
    const pTrans = translations.filter((t) => t.pageId === p.id);
    const ru = pTrans.find((t) => t.lang === "ru");
    const en = pTrans.find((t) => t.lang === "en");
    return {
      ...p,
      ruTitle: ru?.title || "Без названия",
      enTitle: en?.title || "No title",
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Страницы</h1>
          <p className="text-slate-500 text-sm mt-1">
            Управление статическими и посадочными страницами сайта.
          </p>
        </div>

        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          Создать страницу
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Страниц пока нет. Нажмите «Создать страницу», чтобы добавить первую.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50 uppercase">
                <th className="py-3 px-5 font-semibold">Заголовок (RU / EN)</th>
                <th className="py-3 px-5 font-semibold">URL маршрут</th>
                <th className="py-3 px-5 font-semibold">Шаблон</th>
                <th className="py-3 px-5 text-right font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900">{item.ruTitle}</div>
                    <div className="text-xs text-slate-400">EN: {item.enTitle}</div>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-blue-600">
                    /{item.slug}
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-600 capitalize">
                    {item.template}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/preview/default-site/${item.slug}`}
                        target="_blank"
                        title="Предпросмотр"
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <form action={deletePage.bind(null, item.id)}>
                        <button
                          type="submit"
                          title="Удалить"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}