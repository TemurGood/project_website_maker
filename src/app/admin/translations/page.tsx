import { db } from "@/db";
import { staticTranslations, languages } from "@/db/schema";
import { 
  addTranslationKey, 
  updateTranslationValue, 
  deleteTranslationKey 
} from "./actions";
import { Plus, Trash2, Check, Languages } from "lucide-react";

export default async function TranslationsPage() {
  const allTranslations = await db.select().from(staticTranslations);
  const allLangs = await db.select().from(languages);

  // Группируем переводы по ключу: { "read_more": { ru: "Читать далее", en: "Read more" } }
  const keysMap: { [key: string]: { [lang: string]: string } } = {};

  allTranslations.forEach((item) => {
    if (!keysMap[item.key]) {
      keysMap[item.key] = {};
    }
    keysMap[item.key][item.lang] = item.value;
  });

  const uniqueKeys = Object.keys(keysMap);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Languages className="w-8 h-8 text-blue-600" />
          Словарь статических слов
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Здесь настраиваются системные надписи сайта (названия кнопок, служебные подсказки и фразы интерфейса).
        </p>
      </div>

      {/* Форма добавления нового ключа */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" />
          Добавить новую системную фразу
        </h2>

        <form action={addTranslationKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Ключ (латиницей)
            </label>
            <input
              type="text"
              name="key"
              placeholder="contacts_title"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              🇷🇺 Перевод (RU)
            </label>
            <input
              type="text"
              name="value_ru"
              placeholder="Контакты"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              🇬🇧 Перевод (EN)
            </label>
            <input
              type="text"
              name="value_en"
              placeholder="Contact Us"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow transition h-[42px]"
          >
            Сохранить ключ
          </button>
        </form>
      </div>

      {/* Таблица существующих переводов с инлайн-редактированием */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Список фраз ({uniqueKeys.length})
          </h2>
          <span className="text-xs text-slate-500">
            Для изменения текста отредактируйте поле и нажмите галочку
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50/50 uppercase">
                <th className="py-3 px-4 font-semibold w-1/4">Ключ в коде</th>
                {allLangs.map((lang) => (
                  <th key={lang.code} className="py-3 px-4 font-semibold">
                    {lang.name} ({lang.code.toUpperCase()})
                  </th>
                ))}
                <th className="py-3 px-4 text-right font-semibold w-16">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {uniqueKeys.length === 0 ? (
                <tr>
                  <td colSpan={allLangs.length + 2} className="py-8 text-center text-slate-400">
                    Словарь пока пуст
                  </td>
                </tr>
              ) : (
                uniqueKeys.map((key) => (
                  <tr key={key} className="hover:bg-slate-50/60 transition">
                    {/* Ключ */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-700">
                      {key}
                    </td>

                    {/* Поля перевода под каждый язык */}
                    {allLangs.map((lang) => {
                      const val = keysMap[key]?.[lang.code] || "";
                      return (
                        <td key={lang.code} className="py-2 px-4">
                          <form action={updateTranslationValue} className="flex items-center gap-1.5">
                            <input type="hidden" name="key" value={key} />
                            <input type="hidden" name="lang" value={lang.code} />
                            <input
                              type="text"
                              name="value"
                              defaultValue={val}
                              placeholder="Пусто"
                              className="w-full px-2.5 py-1 text-sm bg-white border border-slate-200 rounded hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              title="Сохранить изменения"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </td>
                      );
                    })}

                    {/* Удалить ключ */}
                    <td className="py-3 px-4 text-right">
                      <form action={deleteTranslationKey.bind(null, key)}>
                        <button
                          type="submit"
                          title="Удалить"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}