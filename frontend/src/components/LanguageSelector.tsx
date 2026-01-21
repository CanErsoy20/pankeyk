import React from 'react';
import { useTranslation } from '../translation-module/TranslationProvider';

const LanguageSelector: React.FC = () => {
    const { targetLanguage, setTargetLanguage, isTranslating } = useTranslation();

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isTranslating && (
                <span data-pankeyk-ignore="true" style={{color: 'orange', fontSize: '0.9em'}}>
                    Translating...
                </span>
            )}
            <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                style={{ padding: '5px' }}
            >
                <option value="">Original Language</option>
                <option value="it">Italian</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
            </select>
        </div>
    );
};

export default LanguageSelector;