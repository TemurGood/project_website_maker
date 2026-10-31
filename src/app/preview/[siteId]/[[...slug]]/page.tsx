import { db } from "@/db";
import { pages, pageTranslations, posts, postTranslations, staticTranslations } from "@/db/schema";
import { eq } from "drizzle-orm";
import PublicBlockRenderer from "@/components/public/PublicBlockRenderer";
import { EditorBlock } from "@/types/editor";
import Link from "next/link";
import { Monitor, Smartphone, Tablet, ArrowLeft } from "lucide-react";

interface PreviewProps {
  params: Promise<{ siteId: string; slug?: string[] }>;
  searchParams: Promise<{ lang?: string; view?: string }>;
}

export default async function SitePreviewPage({ params, searchParams }: PreviewProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const currentLang = resolvedSearch.lang || "ru";
  const viewMode = resolvedSearch.view || "desktop";
  const slugArray = resolvedParams.slug || ["home"];
  const currentSlug = slugArray.join("/");

  // 1. Загружаем словарь статических фраз
  const allDict = await db.select().from(staticTranslations).where(eq(staticTranslations.lang, currentLang));
  const dict: Record<string, string> = {};
  allDict.forEach((d) => {
    dict[d.key] = d.value;
  });

  // Вспомогательная функция для статических слов
  const t = (key: string, fallback: string) => dict[key] || fallback;

  // 2. Ищем запрашиваемую страницу или статью
  let pageTitle = "";
  let rawBlocks = "[]";
  let isFound = false;

  if (slugArray[0] === "blog" && slugArray[1]) {
    // Это просмотр статьи: /preview/[siteId]/blog/my-post
    const postSlug = slugArray[1];
    const [foundPost] = await db.select().from(posts).where(eq(posts.slug, postSlug));
    if (foundPost) {
      const trans = await db.select().from(postTranslations).where(eq(postTranslations.postId, foundPost.id));
      const postContent = trans.find((tr) => tr.lang === currentLang) || trans[0];
      if (postContent) {
        pageTitle = postContent.title;
        rawBlocks = postContent.blocks;
        isFound = true;
      }
    }
  } else {
    // Это просмотр страницы: /preview/[siteId]/home
    const pageSlug = slugArray[0] || "home";
    const [foundPage] = await db.select().from(pages).where(eq(pages.slug, pageSlug));
    if (foundPage) {
      const trans = await db.select().from(pageTranslations).where(eq(pageTranslations.pageId, foundPage.id));
      const pageContent = trans.find((tr) => tr.lang === currentLang) || trans[0];
      if (pageContent) {
        pageTitle = pageContent.title;
        rawBlocks = pageContent.blocks;
        isFound = true;
      }
    }
  }

  const blocks: EditorBlock[] = JSON.parse(rawBlocks || "[]");

  // Ограничитель ширины экрана для симуляции смартфонов и планшетов
  const containerWidthClass =
    viewMode === "mobile"
      ? "max-w-sm border-x border-slate-300 shadow-2xl min-h-screen mx-auto bg-white"
      : viewMode === "tablet"
      ? "max-w-2xl border-x border-slate-300 shadow-xl min-h-screen mx-auto bg-white"
      : "w-full bg-white min-h-screen";

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* Верхняя плавающая панель управления предпросмотром */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-2 py-1 rounded bg-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> В админку
          </Link>
          <span className="font-mono text-slate-400">/{currentSlug}</span>
        </div>

        {/* Переключатель устройств (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
          <Link
            href={`/preview/${resolvedParams.siteId}/${currentSlug}?lang=${currentLang}&view=desktop`}
            className={`p-1.5 rounded transition ${viewMode === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            title="Компьютер"
          >
            <Monitor className="w-4 h-4" />
          </Link>
          <Link
            href={`/preview/${resolvedParams.siteId}/${currentSlug}?lang=${currentLang}&view=tablet`}
            className={`p-1.5 rounded transition ${viewMode === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            title="Планшет"
          >
            <Tablet className="w-4 h-4" />
          </Link>
          <Link
            href={`/preview/${resolvedParams.siteId}/${currentSlug}?lang=${currentLang}&view=mobile`}
            className={`p-1.5 rounded transition ${viewMode === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            title="Телефон"
          >
            <Smartphone className="w-4 h-4" />
          </Link>
        </div>

        {/* Переключатель языка предпросмотра */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
          <Link
            href={`/preview/${resolvedParams.siteId}/${currentSlug}?lang=ru&view=${viewMode}`}
            className={`px-2.5 py-1 rounded font-bold transition ${currentLang === "ru" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            RU
          </Link>
          <Link
            href={`/preview/${resolvedParams.siteId}/${currentSlug}?lang=en&view=${viewMode}`}
            className={`px-2.5 py-1 rounded font-bold transition ${currentLang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            EN
          </Link>
        </div>
      </header>

      {/* Окно предпросмотра сайта */}
      <div className="flex-1 overflow-x-hidden">
        <div className={containerWidthClass}>
          {/* Публичная шапка сайта (Header) */}
          <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <Link href={`/preview/${resolvedParams.siteId}/home?lang=${currentLang}&view=${viewMode}`} className="font-bold text-lg text-slate-900">
              My Website
            </Link>
            <nav className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <Link href={`/preview/${resolvedParams.siteId}/home?lang=${currentLang}&view=${viewMode}`} className="hover:text-blue-600">
                {t("back_to_home", "Главная")}
              </Link>
            </nav>
          </header>

          {/* Содержимое страницы */}
          <main className="p-8 max-w-4xl mx-auto space-y-6">
            {!isFound ? (
              <div className="py-24 text-center">
                <h1 className="text-2xl font-bold text-slate-800">404: Страница не найдена</h1>
                <p className="text-slate-500 text-sm mt-2">
                  Страница «{currentSlug}» еще не создана в админке.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block) => (
                  <PublicBlockRenderer key={block.id} block={block} />
                ))}
              </div>
            )}
          </main>

          {/* Подвал сайта (Footer) со словами из словаря */}
          <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-20">
            © {new Date().getFullYear()} My Website. {t("all_rights_reserved", "Все права защищены.")}
          </footer>
        </div>
      </div>
    </div>
  );
}