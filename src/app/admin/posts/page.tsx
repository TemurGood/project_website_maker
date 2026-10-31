import { db } from "@/db";
import { posts, postTranslations, categories, categoryTranslations } from "@/db/schema";
import Link from "next/link";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function PostsListPage() {
  const allPosts = await db.select().from(posts);
  const translations = await db.select().from(postTranslations);
  const allCats = await db.select().from(categories);
  const catTrans = await db.select().from(categoryTranslations);

  const items = allPosts.map((p) => {
    const pTrans = translations.filter((t) => t.postId === p.id);
    const ru = pTrans.find((t) => t.lang === "ru");
    const en = pTrans.find((t) => t.lang === "en");
    const cat = allCats.find((c) => c.id === p.categoryId);
    const catName = catTrans.find((ct) => ct.categoryId === cat?.id && ct.lang === "ru")?.title;

    return {
      ...p,
      ruTitle: ru?.title || "Без названия",
      enTitle: en?.title || "No title",
      categoryName: catName || "Без рубрики",
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Статьи и Новости</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Публикации сайта с привязкой к рубрикам и переводами.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          Написать статью
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Статей пока нет. Нажмите «Написать статью», чтобы добавить первую новость.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50 uppercase">
                <th className="py-3 px-5 font-semibold">Заголовок</th>
                <th className="py-3 px-5 font-semibold">Рубрика</th>
                <th className="py-3 px-5 font-semibold">URL маршрут</th>
                <th className="py-3 px-5 text-right font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.ruTitle}</div>
                    <div className="text-xs text-slate-400">EN: {item.enTitle}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-slate-600">
                    /blog/{item.slug}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/preview/default-site/blog/${item.slug}`}
                        target="_blank"
                        title="Предпросмотр"
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <form action={deletePost.bind(null, item.id)}>
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