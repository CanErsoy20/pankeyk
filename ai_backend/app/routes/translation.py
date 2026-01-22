from flask import Blueprint, request, jsonify
from app.services.llm_connector import translate_ui_elements
import logging
import threading

translation_bp = Blueprint('translation', __name__)
logger = logging.getLogger(__name__)

#Dictionary: { "https://arol.com": 17150001, "https://arol.com/contact": 17150002 }
LATEST_REQUESTS = {}
REQUESTS_LOCK = threading.Lock()

@translation_bp.route('/translate', methods=['POST'])
def translate_endpoint():
    data = request.get_json()
    
    if not data or 'elements' not in data:
        return jsonify({"error": "Missing elements"}), 400

    elements = data['elements']
    target_lang = data.get('target_language', 'it')
    current_request_id = data.get('request_id', 0)
    page_url = data.get('page_url', 'unknown_page')
    
    #Update the "Primary" for THIS SPECIFIC URL
    with REQUESTS_LOCK:
        LATEST_REQUESTS[page_url] = current_request_id
    
    logger.info(f"Start: {page_url} (ID: {current_request_id}) -> {target_lang}")

    def abort_check():
        with REQUESTS_LOCK:
            latest_id = LATEST_REQUESTS.get(page_url, 0)
        #Only abort if a newer request came from the SAME page
        if latest_id > current_request_id:
            return True
        return False

    result = translate_ui_elements(
        elements, 
        target_lang, 
        page_url=page_url, 
        abort_check_func=abort_check
    )

    if result is None:
        return jsonify({"status": "aborted_or_failed"}), 409

    return jsonify({
        "target_language": target_lang,
        "elements": result
    })