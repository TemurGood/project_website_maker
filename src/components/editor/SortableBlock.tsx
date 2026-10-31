"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorBlock } from "@/types/editor";
import { GripVertical, Trash2 } from "lucide-react";
import React from "react";

interface SortableBlockProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateContent: (content: Partial<EditorBlock["content"]>) => void;
}

export default function SortableBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onUpdateContent,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Пользовательские стили блока, настроенные через StyleInspector
  const customBlockStyles: React.CSSProperties = {
    color: block.styles?.color || undefined,
    backgroundColor: block.styles?.backgroundColor || undefined,
    fontSize: block.styles?.fontSize || undefined,
    fontWeight: block.styles?.fontWeight || undefined,
    textAlign: block.styles?.textAlign || undefined,
    paddingTop: block.styles?.paddingTop ? `${block.styles.paddingTop}px` : undefined,
    paddingBottom: block.styles?.paddingBottom ? `${block.styles.paddingBottom}px` : undefined,
    marginTop: block.styles?.marginTop ? `${block.styles.marginTop}px` : undefined,
    marginBottom: block.styles?.marginBottom ? `${block.styles.marginBottom}px` : undefined,
    borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`group relative border rounded-xl transition-all ${
        isSelected
          ? "border-blue-500 shadow-md ring-2 ring-blue-100"
          : "border-slate-200 hover:border-slate-300 bg-white"
      }`}
    >
      {/* Верхняя плашка управления блоком (появляется при наведении или выборе) */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
        <div className="flex items-center gap-2">
          {/* Иконка перетаскивания (Drag Handle) */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200"
            title="Перетащить блок"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-medium text-slate-500 uppercase">
            {block.type}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
          title="Удалить блок"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Содержимое блока с примененными пользовательскими стилями */}
      <div className="p-4" style={customBlockStyles}>
        {/* Заголовок */}
        {block.type === "heading" && (
          <input
            type="text"
            value={block.content.text || ""}
            onChange={(e) => onUpdateContent({ text: e.target.value })}
            placeholder="Введите текст заголовка..."
            style={customBlockStyles}
            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
          />
        )}

        {/* Текст / Абзац */}
        {block.type === "paragraph" && (
          <textarea
            rows={3}
            value={block.content.text || ""}
            onChange={(e) => onUpdateContent({ text: e.target.value })}
            placeholder="Введите основной текст статьи или страницы..."
            style={customBlockStyles}
            className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-500 rounded p-1 focus:outline-none resize-y"
          />
        )}

        {/* Цитата */}
        {block.type === "quote" && (
          <div className="border-l-4 border-blue-500 pl-4 py-1 italic">
            <textarea
              rows={2}
              value={block.content.text || ""}
              onChange={(e) => onUpdateContent({ text: e.target.value })}
              placeholder="Текст цитаты..."
              style={customBlockStyles}
              className="w-full bg-transparent focus:outline-none resize-none"
            />
          </div>
        )}

        {/* Изображение */}
        {block.type === "image" && (
          <div className="space-y-3">
            <input
              type="text"
              value={block.content.url || ""}
              onChange={(e) => onUpdateContent({ url: e.target.value })}
              placeholder="Ссылка на изображение (https://...)"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {block.content.url ? (
              <img
                src={block.content.url}
                alt={block.content.alt || "Превью"}
                style={{ borderRadius: customBlockStyles.borderRadius }}
                className="max-h-72 w-full object-cover rounded-lg"
              />
            ) : (
              <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
                Вставьте URL картинки выше для превью
              </div>
            )}
          </div>
        )}

        {/* Кнопка / Ссылка */}
        {block.type === "button" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={block.content.buttonText || ""}
                onChange={(e) => onUpdateContent({ buttonText: e.target.value })}
                placeholder="Текст на кнопке"
                className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none"
              />
              <input
                type="text"
                value={block.content.buttonUrl || ""}
                onChange={(e) => onUpdateContent({ buttonUrl: e.target.value })}
                placeholder="Ссылка (URL)"
                className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none"
              />
            </div>

            <div style={{ textAlign: block.styles?.textAlign || "left" }}>
              <button
                type="button"
                style={{
                  backgroundColor: block.styles?.backgroundColor || "#2563eb",
                  color: block.styles?.color || "#ffffff",
                  borderRadius: block.styles?.borderRadius ? `${block.styles.borderRadius}px` : "6px",
                  paddingTop: block.styles?.paddingTop ? `${block.styles.paddingTop}px` : "10px",
                  paddingBottom: block.styles?.paddingBottom ? `${block.styles.paddingBottom}px` : "10px",
                }}
                className="px-5 font-medium text-sm shadow-sm pointer-events-none"
              >
                {block.content.buttonText || "Текст кнопки"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}