"use client";

import { EditorBlock, BlockStyle } from "@/types/editor";
import { AlignLeft, AlignCenter, AlignRight, Sliders, Type, Palette, Box } from "lucide-react";

interface StyleInspectorProps {
  block: EditorBlock | null;
  onUpdateStyle: (newStyles: Partial<BlockStyle>) => void;
}

export default function StyleInspector({ block, onUpdateStyle }: StyleInspectorProps) {
  if (!block) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <Sliders className="w-10 h-10 mb-2 opacity-30" />
        <p className="text-sm font-medium">Выберите блок на странице</p>
        <p className="text-xs text-slate-400 mt-1">
          Кликните по любому блоку в редакторе, чтобы настроить его стиль и оформление без CSS.
        </p>
      </div>
    );
  }

  const s = block.styles || {};

  return (
    <div className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-6 text-slate-800">
      <div className="border-b border-slate-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
          Настройки блока: {block.type}
        </span>
      </div>

      {/* 1. Типографика */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase">
          <Type className="w-3.5 h-3.5" />
          Типографика
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Размер шрифта</label>
            <select
              value={s.fontSize || "16px"}
              onChange={(e) => onUpdateStyle({ fontSize: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded p-1.5 bg-slate-50"
            >
              <option value="14px">14px (Мелкий)</option>
              <option value="16px">16px (Обычный)</option>
              <option value="20px">20px (Средний)</option>
              <option value="28px">28px (Крупный H2)</option>
              <option value="40px">40px (Огромный H1)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Начертание</label>
            <select
              value={s.fontWeight || "400"}
              onChange={(e) => onUpdateStyle({ fontWeight: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded p-1.5 bg-slate-50"
            >
              <option value="400">Обычный</option>
              <option value="600">Полужирный</option>
              <option value="700">Жирный</option>
            </select>
          </div>
        </div>

        {/* Выравнивание текста */}
        <div>
          <label className="text-[11px] text-slate-500 block mb-1">Выравнивание</label>
          <div className="flex gap-1 bg-slate-100 p-1 rounded">
            {(["left", "center", "right"] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onUpdateStyle({ textAlign: align })}
                className={`flex-1 py-1 flex items-center justify-center rounded text-xs transition ${
                  (s.textAlign || "left") === align ? "bg-white shadow-sm font-bold text-blue-600" : "text-slate-500"
                }`}
              >
                {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Цвета */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase">
          <Palette className="w-3.5 h-3.5" />
          Цвета
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Цвет текста</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded p-1 bg-slate-50">
              <input
                type="color"
                value={s.color || "#0f172a"}
                onChange={(e) => onUpdateStyle({ color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono">{s.color || "#0f172a"}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Цвет фона</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded p-1 bg-slate-50">
              <input
                type="color"
                value={s.backgroundColor || "#ffffff"}
                onChange={(e) => onUpdateStyle({ backgroundColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[11px] font-mono">{s.backgroundColor || "#ffffff"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Отступы и скругления */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase">
          <Box className="w-3.5 h-3.5" />
          Отступы и Границы
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">
              Внутр. отступ (Padding): {s.paddingTop || 0}px
            </label>
            <input
              type="range"
              min="0"
              max="60"
              step="4"
              value={s.paddingTop || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateStyle({ paddingTop: val, paddingBottom: val });
              }}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 block mb-1">
              Внешн. отступ (Margin): {s.marginTop || 0}px
            </label>
            <input
              type="range"
              min="0"
              max="60"
              step="4"
              value={s.marginTop || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateStyle({ marginTop: val, marginBottom: val });
              }}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-500 block mb-1">
            Скругление углов: {s.borderRadius || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="40"
            step="2"
            value={s.borderRadius || 0}
            onChange={(e) => onUpdateStyle({ borderRadius: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}