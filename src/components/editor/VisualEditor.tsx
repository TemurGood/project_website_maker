"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EditorBlock, BlockType, BlockStyle } from "@/types/editor";
import SortableBlock from "./SortableBlock";
import StyleInspector from "./StyleInspector";
import { Heading, Type, Image as ImageIcon, MousePointerClick, Quote, Plus } from "lucide-react";

interface VisualEditorProps {
  initialBlocksByLang?: Record<string, EditorBlock[]>;
  activeLanguages: { code: string; name: string }[];
  onChange?: (blocksByLang: Record<string, EditorBlock[]>) => void;
}

export default function VisualEditor({
  initialBlocksByLang = { ru: [], en: [] },
  activeLanguages,
  onChange,
}: VisualEditorProps) {
  // Текущий активный язык вкладки редактора
  const [currentLang, setCurrentLang] = useState<string>(activeLanguages[0]?.code || "ru");

  // Блоки раздельно для каждого языка
  const [blocksByLang, setBlocksByLang] = useState<Record<string, EditorBlock[]>>(() => {
    const state: Record<string, EditorBlock[]> = {};
    activeLanguages.forEach((l) => {
      state[l.code] = initialBlocksByLang[l.code] || [];
    });
    return state;
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const currentBlocks = blocksByLang[currentLang] || [];
  const selectedBlock = currentBlocks.find((b) => b.id === selectedBlockId) || null;

  // Обновление состояния блоков
  const updateBlocks = (newBlocks: EditorBlock[]) => {
    const updated = { ...blocksByLang, [currentLang]: newBlocks };
    setBlocksByLang(updated);
    if (onChange) onChange(updated);
  };

  // Добавление нового блока
  const handleAddBlock = (type: BlockType) => {
    const newBlock: EditorBlock = {
      id: `block_${Date.now()}`,
      type,
      content: {
        text: type === "heading" ? "Новый заголовок" : type === "paragraph" ? "Текст абзаца..." : "",
        buttonText: type === "button" ? "Нажми меня" : undefined,
        buttonUrl: type === "button" ? "#" : undefined,
      },
      styles: {
        fontSize: type === "heading" ? "28px" : "16px",
        fontWeight: type === "heading" ? "700" : "400",
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 6,
      },
    };

    updateBlocks([...currentBlocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Перемещение блока мышкой (Drag & Drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentBlocks.findIndex((item) => item.id === active.id);
      const newIndex = currentBlocks.findIndex((item) => item.id === over.id);
      updateBlocks(arrayMove(currentBlocks, oldIndex, newIndex));
    }
  };

  // Удаление блока
  const handleDeleteBlock = (id: string) => {
    updateBlocks(currentBlocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  // Обновление контента блока
  const handleUpdateContent = (id: string, content: Partial<EditorBlock["content"]>) => {
    const updated = currentBlocks.map((b) =>
      b.id === id ? { ...b, content: { ...b.content, ...content } } : b
    );
    updateBlocks(updated);
  };

  // Обновление стилей через StyleInspector
  const handleUpdateStyles = (styles: Partial<BlockStyle>) => {
    if (!selectedBlockId) return;
    const updated = currentBlocks.map((b) =>
      b.id === selectedBlockId ? { ...b, styles: { ...b.styles, ...styles } } : b
    );
    updateBlocks(updated);
  };

  return (
    <div className="flex h-[750px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
      {/* Левая и центральная часть: Панель добавления, Языки и Холст */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Верхняя панель: Переключатель языков и Кнопки добавления блоков */}
        <div className="bg-white border-b border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3">
          {/* Вкладки языков для ручного перевода */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {activeLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setCurrentLang(lang.code);
                  setSelectedBlockId(null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition ${
                  currentLang === lang.code
                    ? "bg-white shadow text-blue-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang.code === "ru" ? "🇷🇺 Русский" : lang.code === "en" ? "🇬🇧 English" : lang.name}
              </button>
            ))}
          </div>

          {/* Палитра блоков для добавления */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Добавить:
            </span>
            <button
              type="button"
              onClick={() => handleAddBlock("heading")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition"
            >
              <Heading className="w-3.5 h-3.5 text-blue-600" /> Заголовок
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock("paragraph")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition"
            >
              <Type className="w-3.5 h-3.5 text-emerald-600" /> Текст
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock("image")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" /> Картинку
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock("button")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition"
            >
              <MousePointerClick className="w-3.5 h-3.5 text-purple-600" /> Кнопку
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock("quote")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition"
            >
              <Quote className="w-3.5 h-3.5 text-slate-600" /> Цитату
            </button>
          </div>
        </div>

        {/* Рабочая область (Canvas) */}
        <div
          className="flex-1 overflow-y-auto p-8"
          onClick={() => setSelectedBlockId(null)}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            {currentBlocks.length === 0 ? (
              <div className="py-20 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/60">
                <Plus className="w-8 h-8 text-slate-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Здесь пока нет блоков для языка [{currentLang.toUpperCase()}]
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Нажмите на кнопки сверху (Заголовок, Текст, Картинка и т.д.), чтобы добавить элементы.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentBlocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {currentBlocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={() => setSelectedBlockId(block.id)}
                        onDelete={() => handleDeleteBlock(block.id)}
                        onUpdateContent={(content) => handleUpdateContent(block.id, content)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Правая часть: Визуальный инспектор стилей */}
      <StyleInspector block={selectedBlock} onUpdateStyle={handleUpdateStyles} />
    </div>
  );
}