"use server";

import { db } from "@/db";
import { staticTranslations, languages } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function addTranslationKey(formData: FormData) {
  const rawKey = formData.get("key") as string;
  const key = rawKey?.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const valueRu = (formData.get("value_ru") as string) || "";
  const valueEn = (formData.get("value_en") as string) || "";

  if (!key) throw new Error("Ключ обязателен");

  // 1. Сначала гарантируем наличие языков 'ru' и 'en' в базе
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
    // Языки уже существуют
  }

  // 2. Добавляем перевод для RU
  await db
    .insert(staticTranslations)
    .values({
      id: `st_${key}_ru`,
      key,
      lang: "ru",
      value: valueRu,
    })
    .onConflictDoUpdate({
      target: staticTranslations.id,
      set: { value: valueRu },
    });

  // 3. Добавляем перевод для EN
  await db
    .insert(staticTranslations)
    .values({
      id: `st_${key}_en`,
      key,
      lang: "en",
      value: valueEn,
    })
    .onConflictDoUpdate({
      target: staticTranslations.id,
      set: { value: valueEn },
    });

  revalidatePath("/admin/translations");
}

export async function updateTranslationValue(formData: FormData) {
  const key = formData.get("key") as string;
  const lang = formData.get("lang") as string;
  const value = formData.get("value") as string;

  await db
    .update(staticTranslations)
    .set({ value })
    .where(and(eq(staticTranslations.key, key), eq(staticTranslations.lang, lang)));

  revalidatePath("/admin/translations");
}

export async function deleteTranslationKey(key: string) {
  await db.delete(staticTranslations).where(eq(staticTranslations.key, key));
  revalidatePath("/admin/translations");
}