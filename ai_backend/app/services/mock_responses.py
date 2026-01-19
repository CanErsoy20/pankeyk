import json
import os

BASE_DIR = os.path.dirname(__file__)
MOCK_FILE = os.path.join(
    BASE_DIR,
    "mock_data",
    "arol_canelli_it.json"
)

def get_mock_translation(elements, target_language):
    """
    Loads and returns the exact mocked AI response from disk.
    The input parameters are intentionally ignored to simulate
    a real AI backend response.
    """

    with open(MOCK_FILE, "r", encoding="utf-8") as f:
        mock_response = json.load(f)

    return mock_response["elements"]
