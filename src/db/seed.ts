import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { sites, languages, staticTranslations } from "./schema";

async function seed() {
  console.log("🌱 Начинаем заполнение базы...");

  // 1. Создаем сайт по умолчанию
  await db.insert(sites).values({
    id: "default-site",
    name: "Мой Сайт",
    defaultLanguage: "ru",
    theme: "modern",
    globalStyles: JSON.stringify({
      primaryColor: "#2563eb",
      fontFamily: "Inter, sans-serif",
      borderRadius: "8px",
    }),
  }).onConflictDoNothing();

  // 2. Создаем базовые языки
  await db.insert(languages).values([
    { code: "ru", name: "Русский", isDefault: true },
    { code: "en", name: "English", isDefault: false },
  ]).onConflictDoNothing();

  // 3. Добавляем системные слова для словаря
  await db.insert(staticTranslations).values([
    { id: "st_1", key: "read_more", lang: "ru", value: "Читать далее" },
    { id: "st_2", key: "read_more", lang: "en", value: "Read more" },
    { id: "st_3", key: "back_to_home", lang: "ru", value: "На главную" },
    { id: "st_4", key: "back_to_home", lang: "en", value: "Back to Home" },
    { id: "st_5", key: "categories", lang: "ru", value: "Рубрики" },
    { id: "st_6", key: "categories", lang: "en", value: "Categories" },
  ]).onConflictDoNothing();

  console.log(" Все начальные данные успешно добавлены!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Ошибка при сидировании:", err);
  process.exit(1);
});