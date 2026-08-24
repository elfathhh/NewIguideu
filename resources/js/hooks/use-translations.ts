import { useContext } from 'react';
import {
    LanguageContext,
    type LanguageContextType,
} from '@/contexts/language-context';

/**
 * Hook to access the current language state and translation function.
 * Must be used within a <LanguageProvider>.
 */
export function useTranslations(): LanguageContextType {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            'useTranslations must be used within a LanguageProvider',
        );
    }

    return context;
}

export { useTranslations as useTranslation };
export default useTranslations;
