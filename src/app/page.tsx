"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-mono text-sm">
      Загрузка панели управления...
    </div>
  );
}