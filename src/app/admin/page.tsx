import { db } from "@/db";
import { pages, posts, categories, languages } from "@/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [pagesCount] = await db.select({ val: count() }).from(pages);
  const [postsCount] = await db.select({ val: count() }).from(posts);
  const [categoriesCount] = await db.select({ val: count() }).from(categories);
  const activeLanguages = await db.select().from(languages);

  const stats = [
    { label: "Страниц", count: pagesCount?.val ?? 0, href: "/admin/pages" },
    { label: "Статей / Новостей", count: postsCount?.val ?? 0, href: "/admin/posts" },
    { label: "Рубрик", count: categoriesCount?.val ?? 0, href: "/admin/categories" },
    { label: "Языков", count: activeLanguages.length, href: "/admin/translations" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Панель управления</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Конструктор сайтов с визуальным редактированием и мультиязычностью.
        </p>
      </div>

      {/* Карточки со статистикой с поддержкой dark-режима */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow transition"
          >
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{s.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}