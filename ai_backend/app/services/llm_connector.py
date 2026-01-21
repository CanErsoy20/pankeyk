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

    #LLM Prompt
    system_instruction = (
        f"You are a professional UI translator. Translate the 'text' fields into {full_lang_name}. "
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
            
            print(f"\n[DEBUG] LLM Response:\n{ai_response_text}\n", flush=True)

            #Clean Markdown wrappers if present
            if "```" in ai_response_text:
                ai_response_text = ai_response_text.replace("```json", "").replace("```", "")

            translations_map_list = []
            
            # PLAN A: Try Standard JSON Load
            try:
                translations_map_list = json.loads(ai_response_text)
                if isinstance(translations_map_list, dict): 
                     #Handle case where LLM returns a single object instead of a list
                     translations_map_list = [translations_map_list]
            except json.JSONDecodeError:
                pass #Proceed to Plan B

            # PLAN B: Regex Scavenger (Bracket Independent)
            if not translations_map_list:
                logger.warning("Standard JSON parse failed. Running Regex Scavenger...")
                
                #This Regex hunts for {"id": "...", "translated_text": "..."} (ignores everything else)
                pattern = r'\{\s*"id":\s*"[^"]+",\s*"translated_text":\s*"(?:[^"\\]|\\.)*"\s*\}'
                
                matches = re.findall(pattern, ai_response_text)
                for match in matches:
                    try:
                        obj = json.loads(match)
                        translations_map_list.append(obj)
                    except: continue

            if not translations_map_list:
                logger.error(f"FATAL: Could not salvage any JSON from response. Length: {len(ai_response_text)}")
                return None

            lookup_map = {item['id']: item['translated_text'] for item in translations_map_list if 'id' in item}
            final_output = []
            
            for item in elements_list:
                new_item = item.copy()
                new_item['translated_text'] = lookup_map.get(item['id'], item['text'])
                final_output.append(new_item)

            return final_output

    except Exception as e:
        logger.error(f"AI Connection Error: {e}")
        return None