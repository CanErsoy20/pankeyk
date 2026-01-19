import json
import os
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(__file__)
MOCK_DATA_DIR = os.path.join(BASE_DIR, "mock_data")

def _select_mock_file(page_url: str) -> str:
    """
    Decide which mock file to return based on the page URL.
    """

    if not page_url:
        return "arol_it.json"

    parsed = urlparse(page_url)
    path = parsed.path.lower()

    if "arol-canelli" in path:
        return "arol_canelli_it.json"

    return "arol_it.json"


def get_mock_translation(elements, target_language, page_url=None):
    """
    Loads and returns the mocked AI response based on the page URL.
    Input elements are intentionally ignored to simulate a real AI backend.
    """

    mock_file_name = _select_mock_file(page_url)
    mock_file_path = os.path.join(MOCK_DATA_DIR, mock_file_name)

    if not os.path.exists(mock_file_path):
        raise FileNotFoundError(f"Mock file not found: {mock_file_name}")

    with open(mock_file_path, "r", encoding="utf-8") as f:
        mock_response = json.load(f)

    return mock_response["elements"]
