# Generative AI & Automatic GUI Translation

This project provides a module for real-time, automatic translation of Web Application GUIs using a locally-hosted Generative AI model (LLM). It performs dynamic translation of text elements without disrupting application functionality.

The project offers two implementations:

1.  **React Module (Main Design):** An integrated module for React applications (`<TranslationProvider>`).
2.  **Browser Extension:** A standalone extension for translating external websites.

---

## 1. Environment & AI Setup

Before running either the React Module or the Extension version, you must set up the AI backend. This is common to both implementations.

### **Local LLM Setup (LM Studio)**

We use **LM Studio** to host the `meta-llama-3-8b-instruct` model (or any desired model) locally.

1.  **Download LM Studio**: Visit [lmstudio.ai](https://lmstudio.ai/) and install the application for your OS.
2.  **Acquire the Model**:
    - Open LM Studio and search for `meta-llama-3-8b-instruct` in "Discover" tab.
    - Download a quantized version (e.g., `Q4_K_M` is recommended - for a balance of speed and accuracy).
3.  **Start the Local Server**:
    - Go to the **"Developer"** tab.
    - Select the downloaded model from the top dropdown in order to load it.
    - Ensure the **Server Port** is set to `1234`.
    - Activate the **"Start Server"** slider.
    - Ensure the "Base URL" displayed is `http://localhost:1234/v1`.

### **Backend Setup**

The backend acts as the bridge between the frontend (React/Extension) and the local LLM.

1.  Navigate to the backend directory:
    ```bash
    cd pankeyk/ai_backend
    ```
2.  Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the backend server:

    ```bash
    python run.py
    ```

    - You should see: `Backend running on http://localhost:5000`.
    - **Keep this terminal window open.**

---

## 2. React Module Implementation (Main approach)

This version integrates directly into a React application, providing translation via state management.

### **Installation & Setup**

1.  **Prerequisites**: Ensure you have **Node.js** installed (v16 or higher is recommended).
    - Verify installation by running `node -v` and `npm -v` in your terminal.
    - If not installed, download it from [nodejs.org](https://nodejs.org/).

2.  Navigate to the frontend directory:

    ```bash
    cd pankeyk/frontend_module
    ```

3.  Install dependencies:
    ```bash
    npm install
    ```

### **Usage Guide**

#### **Running the Demo Application**

We provide a sample "AROL Group" demo website (within the pankeyk/frontend_module directory) to showcase the translation capabilities.

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open the URL provided in the terminal (usually `http://localhost:5173`) in your browser.

#### **Integrating into Your Own App**

To use the module in a different React application:

1.  Copy the `translation-module` folder (under `pankeyk/frontend_extension/src/`) into your project's `src` directory.
2.  Wrap your root component with the provider:

    ```tsx
    import { TranslationProvider } from "./translation-module/TranslationProvider";

    function App() {
      return (
        <TranslationProvider>
          <YourAppContent />
        </TranslationProvider>
      );
    }
    ```

### **How to Use the Module UI**

1.  **Select Language**: Use the dropdown in the top-right corner of the NavBar to select a target language (the current implementation presents Italian, Spanish, French, and German options).
2.  **Observe Translation**: The text content will update automatically in some time, depending on the hardware specifications and the LLM model being used.
3.  **Navigation**: Navigate between "Home" and "Company" tabs; the translation persists and applies to new content automatically.
4.  **Dynamic Content**: Interact with the "Menu" or popup buttons. The module detects these new elements and translates them on-the-fly.

---

## 3. Browser Extension (Experimental)

This version injects the translation logic into any external webpage via a Google Chrome Extension.

### **Installation**

1.  Open the Google Chrome browser and navigate to `chrome://extensions`.
2.  Enable **"Developer mode"** (toggle in the top-right corner).
3.  Click **"Load unpacked"** (in the top-left corner).
4.  Select the `frontend_extension/src/extension` folder from the project directory.

### **How to Use**

1.  Navigate to any website you wish to translate.
2.  Click the **"GUI Text Extractor"** icon in the Chrome toolbar.
3.  Select a target language from the popup menu and click **"Translate Page"**.
4.  The extension will scan the DOM, send text to the local backend, and replace the content with the translated text.

---
