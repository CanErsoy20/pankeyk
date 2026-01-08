from flask import Blueprint, request, jsonify
from app.services.llm_connector import translate_ui_elements
import logging

translation_bp = Blueprint('translation', __name__)
logger = logging.getLogger(__name__)

@translation_bp.route('/translate', methods=['POST'])
def translate_endpoint():
    """
    Receives a complex JSON payload with IDs and Contexts.
    Expected format:
    {
      "target_language": "Italian",
      "elements": [
         { "id": "btn_01", "text": "Sign in", "context": "button" },
         ...
      ]
    }
    """
    data = request.get_json()

    # 1. Validation
    if not data or 'elements' not in data:
        return jsonify({"error": "Missing 'elements' list in request"}), 400
    
    elements = data['elements']
    target_lang = data.get('target_language', 'Italian')
    
    # Check if elements is actually a list
    if not isinstance(elements, list):
        return jsonify({"error": "'elements' must be a list"}), 400

    logger.info(f"Received {len(elements)} elements to translate into {target_lang}")

    # 2. Call the Service (The Brain)
    # We pass the whole list of objects (dictionaries) to the service
    translated_elements = translate_ui_elements(elements, target_lang)

    # 3. Return the Result
    # We return the full structure back to the frontend
    if translated_elements:
        return jsonify({
            "target_language": target_lang,
            "elements": translated_elements
        })
    else:
        return jsonify({"error": "Translation failed internally"}), 500