import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Сайты
export const sites = sqliteTable("sites", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  defaultLanguage: text("default_language").notNull().default("ru"),
  theme: text("theme").notNull().default("modern"), // modern, classic, minimal, etc.
  globalStyles: text("global_styles").default("{}"), // JSON со шрифтами, палитрой бренда
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 2. Поддерживаемые языки сайта
export const languages = sqliteTable("languages", {
  code: text("code").primaryKey(), // 'ru', 'en', 'uz'
  name: text("name").notNull(),     // 'Русский', 'English'
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
});

// 3. Рубрики (Категории)
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Переводы рубрик под разные языки
export const categoryTranslations = sqliteTable("category_translations", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  lang: text("lang").notNull().references(() => languages.code, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
});

// 4. Страницы
export const pages = sqliteTable("pages", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(), // Например: 'about', 'contacts', 'home'
  template: text("template").notNull().default("standard"), // 'standard', 'landing', 'blank'
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Переводы и контент страниц
export const pageTranslations = sqliteTable("page_translations", {
  id: text("id").primaryKey(),
  pageId: text("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
  lang: text("lang").notNull().references(() => languages.code, { onDelete: "cascade" }),
  title: text("title").notNull(),
  seoDescription: text("seo_description"),
  // blocks: JSON массив с блоками редактора и их визуальными стилями
  blocks: text("blocks").notNull().default("[]"),
});

// 5. Статьи / Новости
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  template: text("template").notNull().default("classic"), // 'classic', 'fullwidth'
  featuredImage: text("featured_image"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: text("published_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Переводы и контент статей
export const postTranslations = sqliteTable("post_translations", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  lang: text("lang").notNull().references(() => languages.code, { onDelete: "cascade" }),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  seoDescription: text("seo_description"),
  // blocks: JSON массив с блоками статьи и кастомными стилями блоков
  blocks: text("blocks").notNull().default("[]"),
});

// 6. Словарь статических строк (системные слова интерфейса)
export const staticTranslations = sqliteTable("static_translations", {
  id: text("id").primaryKey(),
  key: text("key").notNull(), // Например: 'read_more', 'search_placeholder', 'all_rights_reserved'
  lang: text("lang").notNull().references(() => languages.code, { onDelete: "cascade" }),
  value: text("value").notNull(),
});