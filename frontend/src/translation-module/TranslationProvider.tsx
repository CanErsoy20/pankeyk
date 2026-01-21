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

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [targetLanguage, setTargetLanguage] = useState<string>(""); 
    const [isTranslating, setIsTranslating] = useState(false);
    
    // --- REFS ---
    const abortControllerRef = useRef<AbortController | null>(null);
    const cacheRef = useRef<Record<string, string>>({});
    const observerRef = useRef<MutationObserver | null>(null);
    const lastPayloadJson = useRef<string>("");
    
    // The "Global" Debounce Timer
    const debounceTimerRef = useRef<any>(null);

    // Track language ref for the Observer
    const targetLanguageRef = useRef<string>("");

    // --- CACHE UTILS ---
    const loadCache = (lang: string) => {
        const key = `pankeyk_cache_${lang}`;
        const saved = localStorage.getItem(key);
        cacheRef.current = saved ? JSON.parse(saved) : {};
    };

    const saveCache = (lang: string) => {
        localStorage.setItem(`pankeyk_cache_${lang}`, JSON.stringify(cacheRef.current));
    };

    // --- DOM MANIPULATION ---
    const applyTranslations = (elements: any[]) => {
        // 1. Disconnect Observer (Safety)
        if (observerRef.current) observerRef.current.disconnect();

        let appliedCount = 0;
        elements.forEach(el => {
            const translatedText = cacheRef.current[el.id];
            if (translatedText && el.node.textContent !== translatedText) {
                el.node.textContent = translatedText;
                (el.node as any).__pankeykTranslated = true; 
                appliedCount++;
            }
        });

        // 2. Reconnect Observer (Listen for FUTURE changes)
        if (observerRef.current && targetLanguageRef.current) {
            setupObserver();
        }
        
        return appliedCount;
    };

    // --- THE CORE TRANSLATION RUNNER ---
    const executeTranslation = async () => {
        const currentLang = targetLanguageRef.current;
        if (!currentLang) return;

        // 1. Kill any pending request immediately (Frontend side)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const currentSignal = abortControllerRef.current.signal;

        // 2. Scan & Apply Cache
        const elements = scanDOM();
        applyTranslations(elements);

        // 3. Identify Missing
        const missingElements = elements.filter(el => !cacheRef.current[el.id]);
        if (missingElements.length === 0) {
            setIsTranslating(false);
            return;
        }

        // 4. PREPARE PAYLOAD WITH REQUEST ID
        const candidatePayload = {
            target_language: currentLang,
            page_url: window.location.href,
            request_id: Date.now(), // <--- THIS FIXES THE LLM QUEUE
            elements: missingElements.map(el => ({ id: el.id, text: el.text, context: el.context }))
        };

        // 5. Fingerprint Check (Prevent exact duplicates)
        // Note: We exclude request_id from the fingerprint check since it always changes
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
                
                // Final Apply
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

    // --- DEBOUNCED TRIGGER ---
    const triggerTranslation = () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        
        debounceTimerRef.current = setTimeout(() => {
            executeTranslation();
        }, 600); 
    };

    // --- OBSERVER SETUP ---
    const setupObserver = () => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new MutationObserver((mutations) => {
            // Filter out our own changes
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

    // --- MAIN EFFECT: LANGUAGE SWITCH ---
    useEffect(() => {
        targetLanguageRef.current = targetLanguage;
        
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
        lastPayloadJson.current = ""; 
        
        if (observerRef.current) observerRef.current.disconnect();
        restoreDOM();

        if (!targetLanguage) {
            setIsTranslating(false);
            return; 
        }

        loadCache(targetLanguage);
        setupObserver();
        executeTranslation();

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [targetLanguage]);

    return (
        <TranslationContext.Provider value={{ targetLanguage, setTargetLanguage, isTranslating }}>
            {children}
        </TranslationContext.Provider>
    );
};