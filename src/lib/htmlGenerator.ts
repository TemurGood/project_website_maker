import { EditorBlock } from "@/types/editor";

export function renderBlockToHtml(block: EditorBlock): string {
  const s = block.styles || {};

  const inlineStyles = [
    s.color ? `color: ${s.color};` : "",
    s.backgroundColor ? `background-color: ${s.backgroundColor};` : "",
    s.fontSize ? `font-size: ${s.fontSize};` : "",
    s.fontWeight ? `font-weight: ${s.fontWeight};` : "",
    s.textAlign ? `text-align: ${s.textAlign};` : "",
    s.paddingTop ? `padding-top: ${s.paddingTop}px;` : "",
    s.paddingBottom ? `padding-bottom: ${s.paddingBottom}px;` : "",
    s.marginTop ? `margin-top: ${s.marginTop}px;` : "",
    s.marginBottom ? `margin-bottom: ${s.marginBottom}px;` : "",
    s.borderRadius ? `border-radius: ${s.borderRadius}px;` : "",
  ].filter(Boolean).join(" ");

  const styleAttr = inlineStyles ? `style="${inlineStyles}"` : "";

  switch (block.type) {
    case "heading":
      return `<h2 ${styleAttr}>${escapeHtml(block.content.text || "")}</h2>`;
    case "paragraph":
      return `<p ${styleAttr}>${escapeHtml(block.content.text || "").replace(/\n/g, "<br/>")}</p>`;
    case "quote":
      return `<blockquote class="quote" ${styleAttr}>${escapeHtml(block.content.text || "")}</blockquote>`;
    case "image":
      if (!block.content.url) return "";
      return `<div style="text-align: ${s.textAlign || "center"}; margin: ${s.marginTop || 0}px 0 ${s.marginBottom || 0}px 0;"><img src="${escapeHtml(block.content.url)}" alt="${escapeHtml(block.content.alt || "")}" style="border-radius: ${s.borderRadius || 0}px; max-width: 100%; height: auto;" /></div>`;
    case "button":
      return `<div style="text-align: ${s.textAlign || "left"}; margin: ${s.marginTop || 0}px 0 ${s.marginBottom || 0}px 0;"><a href="${escapeHtml(block.content.buttonUrl || "#")}" class="btn" style="background-color: ${s.backgroundColor || "#2563eb"}; color: ${s.color || "#ffffff"}; border-radius: ${s.borderRadius || 8}px; padding: ${s.paddingTop || 12}px 24px; display: inline-block; text-decoration: none; font-weight: 600;">${escapeHtml(block.content.buttonText || "Подробнее")}</a></div>`;
    default:
      return "";
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildFullPageHtml(options: {
  title: string;
  lang: string;
  bodyContent: string;
  pathToRoot: string;
  siteName: string;
  dict: Record<string, string>;
}): string {
  const { title, lang, bodyContent, pathToRoot, siteName, dict } = options;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - ${escapeHtml(siteName)}</title>
  <link rel="stylesheet" href="${pathToRoot}css/styles.css">
</head>
<body>
  <!-- Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${pathToRoot}${lang}/index.html" class="logo">${escapeHtml(siteName)}</a>
      <nav class="nav">
        <a href="${pathToRoot}${lang}/index.html">${escapeHtml(dict["back_to_home"] || "Главная")}</a>
        <div class="lang-switch">
          <a href="${pathToRoot}ru/index.html" class="${lang === "ru" ? "active" : ""}">RU</a>
          <a href="${pathToRoot}en/index.html" class="${lang === "en" ? "active" : ""}">EN</a>
        </div>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="site-main">
    <div class="container content-area">
      ${bodyContent}
    </div>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(siteName)}. ${escapeHtml(dict["all_rights_reserved"] || "Все права защищены.")}</p>
    </div>
  </footer>

  <script src="${pathToRoot}js/main.js"></script>
</body>
</html>`;
}