"use client";

import { useEffect, useMemo, useState } from "react";
import { detectInitialLanguage, translations, type Language } from "@/i18n/translations";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    setLanguageState(detectInitialLanguage());
  }, []);

  useEffect(() => {
    const translation = translations[language];
    document.documentElement.lang = language;
    document.documentElement.dir = translation.dir;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("seren.lang", next);
  };

  return useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  );
}
