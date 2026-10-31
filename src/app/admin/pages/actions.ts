"use server";

import { db } from "@/db";
import { pages, pageTranslations, languages } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function savePage(data: {
  slug: string;
  template: string;
  isPublished: boolean;
  titles: { ru: string; en: string };
  blocksByLang: Record<string, any>;
}) {
  const pageId = `page_${Date.now()}`;
  const cleanSlug = data.slug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");

  // 1. Гарантируем наличие языков в базе
  try {
    await db.insert(languages).values({
      code: "ru",
      name: "Русский",
      isDefault: true,
    }).onConflictDoNothing();

    await db.insert(languages).values({
      code: "en",
      name: "English",
      isDefault: false,
    }).onConflictDoNothing();
  } catch (e) {
    // Игнорируем, если уже созданы
  }

  // 2. Создаем страницу в таблице pages
  await db.insert(pages).values({
    id: pageId,
    slug: cleanSlug,
    template: data.template,
    isPublished: data.isPublished,
  });

  // 3. Сохраняем переводы страницы (RU и EN)
  await db.insert(pageTranslations).values([
    {
      id: `pt_${pageId}_ru`,
      pageId,
      lang: "ru",
      title: data.titles.ru || "Без названия",
      blocks: JSON.stringify(data.blocksByLang["ru"] || []),
    },
    {
      id: `pt_${pageId}_en`,
      pageId,
      lang: "en",
      title: data.titles.en || data.titles.ru || "Untitled",
      blocks: JSON.stringify(data.blocksByLang["en"] || data.blocksByLang["ru"] || []),
    },
  ]);

  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await db.delete(pages).where(eq(pages.id, id));
  revalidatePath("/admin/pages");
}