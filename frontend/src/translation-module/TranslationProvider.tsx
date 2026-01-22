import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { scanDOM, restoreDOM } from './utils/domScanner';
import { sendToBackend } from './api';

interface TranslationContextType {
    targetLanguage: string;
    setTargetLanguage: (lang: string) => void;
    isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) throw new Error("useTranslation must be used within TranslationProvider");
    return context;
};

// React Component that enables its children to be translated
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // States
    const [targetLanguage, setTargetLanguage] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);
    
    // References
    const abortControllerRef = useRef<AbortController | null>(null);
    const cacheRef = useRef<Record<string, string>>({});
    const observerRef = useRef<MutationObserver | null>(null);
    const lastPayloadJson = useRef<string>("");

    const debounceTimerRef = useRef<any>(null);

    // Track target language for the Observer
    const targetLanguageRef = useRef<string>("");

    // Load cache by language (Same page can be cached in different languages)
    const loadCache = (lang: string) => {
        const key = `pankeyk_cache_${lang}`;
        const saved = localStorage.getItem(key);
        cacheRef.current = saved ? JSON.parse(saved) : {};
    };

    const saveCache = (lang: string) => {
        localStorage.setItem(`pankeyk_cache_${lang}`, JSON.stringify(cacheRef.current));
    };

    // Apply the translation to the Page
    const applyTranslations = (elements: any[]) => {
        // 1. Disconnect Observer (Observer will detect mutations during our translation)
        if (observerRef.current) observerRef.current.disconnect();

        // 2. Change the original text to the translated element by element
        let appliedCount = 0;
        elements.forEach(el => {
            const translatedText = cacheRef.current[el.id];
            if (translatedText && el.node.textContent !== translatedText) {
                el.node.textContent = translatedText;
                (el.node as any).__pankeykTranslated = true; 
                appliedCount++;
            }
        });

        // 3. Reconnect Observer (Changes are now reliable and not happening because of us)
        if (observerRef.current && targetLanguageRef.current) {
            setupObserver();
        }
        
        return appliedCount;
    };

    const executeTranslation = async () => {
        const currentLang = targetLanguageRef.current;
        if (!currentLang) return;

        // 1. Kill any pending request (Avoids queueing)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const currentSignal = abortControllerRef.current.signal;

        // 2. Apply the translation to the Page
        const elements = scanDOM();
        applyTranslations(elements);

        // 3. Identify missing
        const missingElements = elements.filter(el => !cacheRef.current[el.id]);
        if (missingElements.length === 0) {
            setIsTranslating(false);
            return;
        }

        // 4. Prepare payload for the missing elements
        const candidatePayload = {
            target_language: currentLang,
            page_url: window.location.href,
            request_id: Date.now(),
            elements: missingElements.map(el => ({ id: el.id, text: el.text, context: el.context }))
        };

        // 5. Fingerprint Check (Prevent exact duplicates)
        // - We exclude request_id from the fingerprint check since it always changes
        const fingerprintPayload = { ...candidatePayload, request_id: 0 };
        const payloadStr = JSON.stringify(fingerprintPayload);
        
        if (payloadStr === lastPayloadJson.current) {
            setIsTranslating(false);
            return;
        }
        lastPayloadJson.current = payloadStr;

        setIsTranslating(true);

        // 6. API Call
        try {
            const result = await sendToBackend(candidatePayload, currentSignal);
            
            if (currentSignal.aborted) return;

            if (result && result.elements) {
                result.elements.forEach((item: any) => {
                    cacheRef.current[item.id] = item.translated_text;
                });
                saveCache(currentLang);

                const freshScan = scanDOM();
                applyTranslations(freshScan);
            }
        } catch (e) {
            // Ignore abort errors
        } finally {
            if (!currentSignal.aborted) {
                setIsTranslating(false);
            }
        }
    };

    const triggerTranslation = () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        
        debounceTimerRef.current = setTimeout(() => {
            executeTranslation();
        }, 600); 
    };

    const setupObserver = () => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new MutationObserver((mutations) => {
            // If the mutation occurred because of use, ignore
            const relevant = mutations.some(m => !(m.target as any).__pankeykTranslated);
            if (relevant) {
                triggerTranslation();
            }
        });

        observerRef.current.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    };

    // Fired when the language switched or page changed
    // Page change triggering is necessary for the page change while the language is switched
    // - New page needs to be translated to the target language too
    useEffect(() => {
        targetLanguageRef.current = targetLanguage;
        
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
        lastPayloadJson.current = ""; 
        
        if (observerRef.current) observerRef.current.disconnect();
        restoreDOM();

        // Nothing to be translated
        if (!targetLanguage) {
            setIsTranslating(false);
            return; 
        }

        // Start the translation process
        loadCache(targetLanguage);
        setupObserver();
        executeTranslation();
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [[],targetLanguage]);

    return (
        <TranslationContext.Provider value={{ targetLanguage, setTargetLanguage, isTranslating }}>
            {children}
        </TranslationContext.Provider>
    );
};