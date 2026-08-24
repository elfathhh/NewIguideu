import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';
import {
    translations,
    type Language,
    type TranslationKey,
} from '@/data/translations';

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey | string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

const STORAGE_KEY = 'iguideu-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('id');

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'id' || saved === 'en') {
                setLanguageState(saved);
                document.documentElement.lang = saved;
            }
        } catch {
            // Ignore storage read errors (e.g. private mode)
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, lang);
            } catch {
                // Ignore storage write errors
            }
            document.documentElement.lang = lang;
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const t = useCallback(
        (key: TranslationKey | string): string => {
            const langDict = translations[language] as
                Record<string, string> | undefined;
            if (langDict && key in langDict) {
                return langDict[key];
            }

            // Fallback to default Indonesian if available
            const defaultDict = translations.id as Record<string, string>;
            if (key in defaultDict) {
                return defaultDict[key];
            }

            // Return the key itself if not found
            return key;
        },
        [language],
    );

    const value = useMemo<LanguageContextType>(
        () => ({
            language,
            setLanguage,
            t,
        }),
        [language, setLanguage, t],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
