import { NextResponse } from "next/server";
import JSZip from "jszip";
import { db } from "@/db";
import { pages, pageTranslations, posts, postTranslations, staticTranslations, sites } from "@/db/schema";
import { renderBlockToHtml, buildFullPageHtml } from "@/lib/htmlGenerator";
import { EditorBlock } from "@/types/editor";

export async function GET() {
  const zip = new JSZip();

  // 1. Получаем данные сайта и словаря
  const [site] = await db.select().from(sites);
  const siteName = site?.name || "My Website";

  const allDict = await db.select().from(staticTranslations);
  const dictByLang: Record<string, Record<string, string>> = { ru: {}, en: {} };
  allDict.forEach((d) => {
    if (!dictByLang[d.lang]) dictByLang[d.lang] = {};
    dictByLang[d.lang][d.key] = d.value;
  });

  // 2. CSS стили
  const cssContent = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #ffffff; display: flex; flex-direction: column; min-height: 100vh; }
.container { max-width: 960px; margin: 0 auto; padding: 0 20px; }
.site-header { border-bottom: 1px solid #f1f5f9; padding: 16px 0; background: #fff; }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 20px; font-weight: 700; text-decoration: none; color: #0f172a; }
.nav { display: flex; align-items: center; gap: 20px; }
.nav a { text-decoration: none; color: #64748b; font-size: 14px; font-weight: 500; }
.nav a:hover { color: #2563eb; }
.lang-switch { display: flex; gap: 6px; margin-left: 10px; }
.lang-switch a { padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; border: 1px solid #cbd5e1; }
.lang-switch a.active { background: #2563eb; color: #fff; border-color: #2563eb; }
.site-main { flex: 1; padding: 48px 0; }
.content-area > * + * { margin-top: 16px; }
.quote { border-left: 4px solid #2563eb; padding-left: 16px; font-style: italic; color: #475569; margin: 16px 0; }
.site-footer { border-top: 1px solid #f1f5f9; padding: 24px 0; text-align: center; font-size: 13px; color: #94a3b8; }
`;
  zip.file("css/styles.css", cssContent);

  // 3. JS скрипты
  const jsContent = `console.log("Сайт успешно экспортирован из Modular CMS Builder");`;
  zip.file("js/main.js", jsContent);

  // 4. Главный index.html (переадресация на язык по умолчанию /ru/index.html)
  const rootIndexHtml = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=ru/index.html"></head><body></body></html>`;
  zip.file("index.html", rootIndexHtml);

  // 5. Генерация страниц (RU и EN)
  const allPages = await db.select().from(pages);
  const allPageTrans = await db.select().from(pageTranslations);

  for (const page of allPages) {
    const pTrans = allPageTrans.filter((pt) => pt.pageId === page.id);

    for (const lang of ["ru", "en"]) {
      const trans = pTrans.find((pt) => pt.lang === lang) || pTrans[0];
      if (!trans) continue;

      const blocks: EditorBlock[] = JSON.parse(trans.blocks || "[]");
      const bodyHtml = blocks.map(renderBlockToHtml).join("\n");

      const fullHtml = buildFullPageHtml({
        title: trans.title,
        lang,
        bodyContent: bodyHtml,
        pathToRoot: "../",
        siteName,
        dict: dictByLang[lang] || {},
      });

      const fileName = page.slug === "home" ? "index.html" : `${page.slug}.html`;
      zip.file(`${lang}/${fileName}`, fullHtml);
    }
  }

  // 6. Генерация статей блога
  const allPosts = await db.select().from(posts);
  const allPostTrans = await db.select().from(postTranslations);

  for (const post of allPosts) {
    const pTrans = allPostTrans.filter((pt) => pt.postId === post.id);

    for (const lang of ["ru", "en"]) {
      const trans = pTrans.find((pt) => pt.lang === lang) || pTrans[0];
      if (!trans) continue;

      const blocks: EditorBlock[] = JSON.parse(trans.blocks || "[]");
      const bodyHtml = blocks.map(renderBlockToHtml).join("\n");

      const fullHtml = buildFullPageHtml({
        title: trans.title,
        lang,
        bodyContent: bodyHtml,
        pathToRoot: "../../",
        siteName,
        dict: dictByLang[lang] || {},
      });

      zip.file(`${lang}/blog/${post.slug}.html`, fullHtml);
    }
  }

// 7. Сборка архива
  const zipBuffer = await zip.generateAsync({ type: "uint8array" });

  return new Response(zipBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="website_export.zip"',
    },
  });
}