import Link from "next/link";
import { 
  FileText, 
  Newspaper, 
  FolderTree, 
  Languages, 
  Eye, 
  Download,
  LayoutDashboard
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Дашборд", href: "/admin", icon: LayoutDashboard },
    { label: "Страницы", href: "/admin/pages", icon: FileText },
    { label: "Статьи / Новости", href: "/admin/posts", icon: Newspaper },
    { label: "Рубрики", href: "/admin/categories", icon: FolderTree },
    { label: "Словарь переводов", href: "/admin/translations", icon: Languages },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Боковая панель */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between p-4 shadow-xl border-r border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <span className="text-xl font-bold tracking-tight text-white">
              CMS Builder
            </span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono">
              v1.0
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Нижние действия: Темная тема, Предпросмотр, Экспорт */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          {/* Переключатель темной темы */}
          <ThemeToggle />

          <Link
            href="/preview/default-site/home"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            Предпросмотр сайта
          </Link>

          <a
            href="/api/export"
            download="website_export.zip"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors text-center"
          >
            <Download className="w-4 h-4" />
            Экспорт (HTML/ZIP)
          </a>
        </div>
      </aside>

      {/* Контентная часть */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}