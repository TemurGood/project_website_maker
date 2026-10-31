import { EditorBlock } from "@/types/editor";

export const PAGE_TEMPLATES: Record<
  string,
  { name: string; description: string; getBlocks: (lang: string) => EditorBlock[] }
> = {
  landing: {
    name: "Посадочная страница (Landing Page)",
    description: "Яркий баннер, главный заголовок, призыв к действию и кнопка",
    getBlocks: (lang: string) => [
      {
        id: "b_hero_title",
        type: "heading",
        content: {
          text: lang === "ru" ? "Создавайте сайты легко и быстро" : "Build Stunning Websites with Ease",
        },
        styles: {
          fontSize: "40px",
          fontWeight: "700",
          textAlign: "center",
          color: "#1e293b",
          marginTop: 20,
          marginBottom: 8,
        },
      },
      {
        id: "b_hero_desc",
        type: "paragraph",
        content: {
          text:
            lang === "ru"
              ? "Современный конструктор без кода с мультиязычностью и чистым экспортом кода."
              : "A modern no-code builder supporting multi-language translation and static export.",
        },
        styles: {
          fontSize: "20px",
          textAlign: "center",
          color: "#64748b",
          marginBottom: 24,
        },
      },
      {
        id: "b_hero_btn",
        type: "button",
        content: {
          buttonText: lang === "ru" ? "Начать работу" : "Get Started Now",
          buttonUrl: "#",
        },
        styles: {
          textAlign: "center",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          borderRadius: 8,
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
      {
        id: "b_hero_img",
        type: "image",
        content: {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          alt: "Dashboard Preview",
        },
        styles: {
          borderRadius: 16,
          marginTop: 32,
        },
      },
    ],
  },

  about: {
    name: "О компании (About Us)",
    description: "История компании, цитата руководства и изображение",
    getBlocks: (lang: string) => [
      {
        id: "b_about_title",
        type: "heading",
        content: { text: lang === "ru" ? "Наша история" : "Our Story" },
        styles: { fontSize: "32px", fontWeight: "700", marginBottom: 12 },
      },
      {
        id: "b_about_text",
        type: "paragraph",
        content: {
          text:
            lang === "ru"
              ? "Мы создаем продукты нового поколения, делая веб-разработку доступной каждому человеку без знания кода."
              : "We build next-generation products, making web development accessible to everyone without code.",
        },
        styles: { fontSize: "16px", marginBottom: 16 },
      },
      {
        id: "b_about_quote",
        type: "quote",
        content: {
          text:
            lang === "ru"
              ? "Простота — это высшая ступень сложности. — Леонардо да Винчи"
              : "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
        },
        styles: { fontSize: "16px", color: "#334155", marginBottom: 20 },
      },
    ],
  },

  blank: {
    name: "Чистый лист (Blank)",
    description: "Пустая страница для сборки с нуля",
    getBlocks: () => [],
  },
};