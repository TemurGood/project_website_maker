"use server";

import { db } from "@/db";
import { categories, categoryTranslations } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createCategory(formData: FormData) {
  const slug = formData.get("slug") as string;
  const titleRu = formData.get("title_ru") as string;
  const descRu = formData.get("desc_ru") as string;
  const titleEn = formData.get("title_en") as string;
  const descEn = formData.get("desc_en") as string;

  if (!slug || !titleRu) {
    throw new Error("Слаг и название на русском обязательны");
  }

  const categoryId = `cat_${Date.now()}`;

  // 1. Создаем категорию
  await db.insert(categories).values({
    id: categoryId,
    slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
  });

  // 2. Создаем перевод для RU
  await db.insert(categoryTranslations).values({
    id: `ct_${categoryId}_ru`,
    categoryId,
    lang: "ru",
    title: titleRu,
    description: descRu || null,
  });

  // 3. Создаем перевод для EN (если заполнен или берем RU как запасной)
  await db.insert(categoryTranslations).values({
    id: `ct_${categoryId}_en`,
    categoryId,
    lang: "en",
    title: titleEn || titleRu,
    description: descEn || descRu || null,
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}