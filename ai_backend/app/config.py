import os

class Config:
    # The URL where LM Studio is listening
    # In LM Studio -> Local Server -> Copy the "Base URL"
    AI_BACKEND_URL = "http://localhost:1234/v1/chat/completions"
    
    # Configuration for the Web Server
    PORT = 5000
    DEBUG = True