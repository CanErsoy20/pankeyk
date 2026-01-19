import requests
import json
import logging
from app.config import Config
from app.services.mock_responses import get_mock_translation

logger = logging.getLogger(__name__)

MOCK_AI = True

def translate_ui_elements(elements_list, target_language="it", page_url=None):
    """
    Takes a list of UI elements (dicts with id, text, context) and returns 
    the list with a new 'translated_text' field added.
    """

    if MOCK_AI:
            return get_mock_translation(
                elements_list,
                target_language,
                page_url=page_url
            )
    
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


    # 1. Construct the Strict System Prompt
    # We explicitly tell the AI to look at "context" but only return IDs and Translations.
    system_instruction = (
        f"You are a professional UI translator. Translate the 'text' fields into {target_language}. "
        "Use the 'context' field to choose the most appropriate translation (e.g., for a 'button', use an imperative verb). "
        "CRITICAL INSTRUCTIONS: \n"
        "1. Return ONLY a valid JSON list of objects. \n"
        "2. Each object must have exactly two fields: 'id' (copied from input) and 'translated_text'. \n"
        "3. Do not include 'context' or original 'text' in the output to save space. \n"
        "4. Example Output: [{\"id\": \"btn_01\", \"translated_text\": \"Accedi\"}]"
    )

    # 2. Prepare the Payload
    # We dump the Python list of dicts into a JSON string to send to the AI
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
        "stream": False
    }

    try:
        # 3. Send Request to LM Studio
        response = requests.post(
            Config.AI_BACKEND_URL, 
            headers={"Content-Type": "application/json"}, 
            data=json.dumps(payload),
            timeout=None # Give it time for larger batches
        )
        response.raise_for_status()
        
        # 4. Extract the AI's Raw Text Response
        ai_response_text = response.json()['choices'][0]['message']['content']
        
        # Clean up potential markdown formatting (common issue with Llama-3)
        # If AI returns ```json [ ... ] ```, we remove the triple backticks
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
        # 5. Parse the JSON Output
    #     try:
    #         translations_map_list = json.loads(ai_response_text)
    #     except json.JSONDecodeError:
    #         logger.error(f"AI returned invalid JSON: {ai_response_text}")
    #         return None

    #     # 6. Merge Translations back into Original List
    #     # We create a dictionary for fast lookup: { "btn_01": "Accedi", "lbl_02": "Nome" }
    #     lookup_map = {item['id']: item['translated_text'] for item in translations_map_list if 'id' in item}

    #     # We loop through the ORIGINAL list and add the translation found in the map
    #     final_output = []
    #     for item in elements_list:
    #         # Create a copy of the item so we don't modify the original input
    #         new_item = item.copy()
    #         # If AI translated it, add it. If AI missed it, keep original text as fallback.
    #         new_item['translated_text'] = lookup_map.get(item['id'], item['text'])
    #         final_output.append(new_item)

    #     return final_output

    # except Exception as e:
    #     logger.error(f"AI Connection Error: {e}")
    #     return None