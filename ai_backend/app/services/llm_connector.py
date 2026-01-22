import requests
import json
import logging
import re
from app.config import Config

logger = logging.getLogger(__name__)

def translate_ui_elements(elements_list, target_language="it", page_url=None, abort_check_func=None):
    
    #Language Mapping (for better representation in LLM prompt)
    lang_map = { "it": "Italian", "es": "Spanish", "fr": "French", "de": "German", "ja": "Japanese" }
    full_lang_name = lang_map.get(target_language, target_language)
    gui_translation_schema = {
        "name": "gui_translation",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "elements": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": { "type": "string" },
                            "translated_text": { "type": "string" }
                        },
                        "required": ["id", "translated_text"],
                        "additionalProperties": False
                    }
                }
            },
            "required": ["elements"],
            "additionalProperties": False
        }
    }
    #LLM Prompt
    # Refined LLM Prompt
    system_instruction = (
        f"You are an expert UI localization engine. Translate the 'text' fields into {full_lang_name}. "
        "Use the 'context' field to choose the most appropriate translation (e.g., for a 'button', use an imperative verb). "
        "CRITICAL INSTRUCTIONS: \n"
        "1. Return ONLY a valid JSON list of objects. \n"
        "2. Each object must have exactly two fields: 'id' (copied from input) and 'translated_text'. \n"
        "3. Do not include 'context' or original 'text' in the output to save space. \n"
        "4. Example Output: [{\"id\": \"btn_01\", \"translated_text\": \"Accedi\"}]"
    )


    user_content_json = json.dumps(elements_list)

    payload = {
        "model": "local-model",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_content_json}
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": gui_translation_schema
        },
        "temperature": 0.1,
        "stream": True 
    }

    try:
        with requests.post(
            Config.AI_BACKEND_URL, 
            headers={"Content-Type": "application/json"}, 
            data=json.dumps(payload),
            stream=True, 
            timeout=None 
        ) as response:
            response.raise_for_status()
            
            collected_text = ""
            
            #Stream Collection
            for line in response.iter_lines():
                if abort_check_func and abort_check_func():
                    logger.info("Abort signal detected. Closing connection to LLM.")
                    return None 

                if line:
                    decoded_line = line.decode('utf-8').strip()
                    if decoded_line.startswith("data: "):
                        json_str = decoded_line[6:] 
                        if json_str == "[DONE]": break
                        try:
                            chunk_json = json.loads(json_str)
                            delta = chunk_json['choices'][0]['delta'].get('content', '')
                            collected_text += delta
                        except: pass
            
            #ROBUST PARSING
            ai_response_text = collected_text.strip()

            if ai_response_text.startswith("```"):
                ai_response_text = ai_response_text.strip("`").replace("json", "").strip()
            
            parsed_response = json.loads(ai_response_text)

            # Extract the list of translated items
            translations_list = parsed_response.get('elements', [])

            # 7. Merge Logic (Reconcile IDs)
            # Create a map: { "btn_01": "Accedi", ... }
            lookup_map = {item['id']: item['translated_text'] for item in translations_list}

            final_output = []
            for item in elements_list:
                new_item = item.copy()
                # If translation exists, use it; otherwise fallback to original
                new_item['translated_text'] = lookup_map.get(item['id'], item['text'])
                final_output.append(new_item)
            return final_output

    except json.JSONDecodeError as e:
        logger.error(f"JSON Parsing Error: {e}. Raw response: {ai_response_text}")
        return None
    except Exception as e:
        logger.error(f"AI Connection Error: {e}")
        return None
