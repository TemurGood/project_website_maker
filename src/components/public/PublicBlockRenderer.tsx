import React from "react";
import { EditorBlock } from "@/types/editor";

export default function PublicBlockRenderer({ block }: { block: EditorBlock }) {
  const s = block.styles || {};

  const customStyle: React.CSSProperties = {
    color: s.color,
    backgroundColor: s.backgroundColor,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    textAlign: s.textAlign,
    paddingTop: s.paddingTop ? `${s.paddingTop}px` : undefined,
    paddingBottom: s.paddingBottom ? `${s.paddingBottom}px` : undefined,
    marginTop: s.marginTop ? `${s.marginTop}px` : undefined,
    marginBottom: s.marginBottom ? `${s.marginBottom}px` : undefined,
    borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
  };

  switch (block.type) {
    case "heading":
      return (
        <h2 style={customStyle} className="leading-tight">
          {block.content.text}
        </h2>
      );

    case "paragraph":
      return (
        <p style={customStyle} className="leading-relaxed whitespace-pre-line">
          {block.content.text}
        </p>
      );

    case "quote":
      return (
        <blockquote
          style={customStyle}
          className="border-l-4 border-blue-600 pl-4 py-2 italic text-slate-700 my-4"
        >
          {block.content.text}
        </blockquote>
      );

    case "image":
      if (!block.content.url) return null;
      return (
        <div style={{ textAlign: s.textAlign || "center", marginTop: s.marginTop, marginBottom: s.marginBottom }}>
          <img
            src={block.content.url}
            alt={block.content.alt || "Изображение"}
            style={{ borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined }}
            className="inline-block max-w-full h-auto shadow-sm"
          />
        </div>
      );

    case "button":
      return (
        <div style={{ textAlign: s.textAlign || "left", marginTop: s.marginTop, marginBottom: s.marginBottom }}>
          <a
            href={block.content.buttonUrl || "#"}
            style={{
              backgroundColor: s.backgroundColor || "#2563eb",
              color: s.color || "#ffffff",
              borderRadius: s.borderRadius ? `${s.borderRadius}px` : "8px",
              paddingTop: s.paddingTop ? `${s.paddingTop}px` : "12px",
              paddingBottom: s.paddingBottom ? `${s.paddingBottom}px` : "12px",
            }}
            className="inline-block px-6 font-semibold text-sm shadow hover:opacity-95 transition"
          >
            {block.content.buttonText || "Подробнее"}
          </a>
        </div>
      );

    default:
      return null;
  }
}