"use server";

import { db } from "@/db";
import { posts, postTranslations, languages } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function savePost(data: {
  slug: string;
  categoryId: string | null;
  template: string;
  featuredImage: string | null;
  isPublished: boolean;
  titles: { ru: string; en: string };
  excerpts: { ru: string; en: string };
  blocksByLang: Record<string, any>;
}) {
  const postId = `post_${Date.now()}`;
  const cleanSlug = data.slug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");

  // 1. Гарантируем наличие языков в БД
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

  // 2. Создаем новость
  await db.insert(posts).values({
    id: postId,
    slug: cleanSlug,
    categoryId: data.categoryId ? data.categoryId : null,
    template: data.template || "classic",
    featuredImage: data.featuredImage || null,
    isPublished: data.isPublished,
  });

  // 3. Сохраняем переводы статьи
  await db.insert(postTranslations).values([
    {
      id: `post_tr_${postId}_ru`,
      postId,
      lang: "ru",
      title: data.titles.ru || "Без названия",
      excerpt: data.excerpts.ru || null,
      blocks: JSON.stringify(data.blocksByLang["ru"] || []),
    },
    {
      id: `post_tr_${postId}_en`,
      postId,
      lang: "en",
      title: data.titles.en || data.titles.ru || "Untitled",
      excerpt: data.excerpts.en || data.excerpts.ru || null,
      blocks: JSON.stringify(data.blocksByLang["en"] || data.blocksByLang["ru"] || []),
    },
  ]);

  revalidatePath("/admin/posts");
  return { success: true };
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/admin/posts");
}