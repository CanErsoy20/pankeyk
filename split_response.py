import json

def split_translation_data(json_input_string):
    """
    Parses a JSON string containing UI text elements and splits them 
    into two separate files: original.json and translated.json.
    """
    try:
        # Parse the input string into a Python list of dictionaries
        data = json.loads(json_input_string)

        # 1. Initialize as a single dictionary instead of a list
        translated_data = {}

        for entry in data:
            # 2. Map the ID directly to the Translated Text
            entry_id = entry.get("id")
            translated_text = entry.get("translated_text")
            
            if entry_id is not None:
                translated_data[entry_id] = translated_text

        # 3. Write the single object to translated.json
        with open('it.json', 'w', encoding='utf-8') as f_trans:
            json.dump(translated_data, f_trans, indent=4, ensure_ascii=False)

    except json.JSONDecodeError as e:
        print(f"Error parsing the input JSON string: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# --- Example Usage ---

# Simulating the JSON format string you described
input_json_string = """[
    {
      "context": "paragraph",
      "id": "text_62057db7",
      "text": "Work With Us",
      "translated_text": "Lavora con noi"
    },
    {
      "context": "heading",
      "id": "text_62057db7",
      "text": "Work With Us",
      "translated_text": "Lavora con noi"
    },
    {
      "context": "heading",
      "id": "text_a020324",
      "text": "Why Join Us",
      "translated_text": "Perch\u00e9 unirti a noi"
    },
    {
      "context": "paragraph",
      "id": "text_12a225b2",
      "text": "Joining our company means becoming part of an international industrial group driven by innovation, technical excellence, and continuous improvement. We value competence, responsibility, and collaboration, and we encourage a working environment where people can contribute actively to the development of advanced technological solutions.",
      "translated_text": "Unirsi alla nostra societ\u00e0 significa diventare parte di un gruppo industriale internazionale guidato dall'innovazione, dalla tecnica eccellente e dall'impegno continuo. Valutiamo la competenza, la responsabilit\u00e0 e la collaborazione, e incoraggiamo un ambiente di lavoro in cui le persone possono contribuire attivamente allo sviluppo di soluzioni tecnologiche avanzate."
    },
    {
      "context": "paragraph",
      "id": "text_2b2f05f0",
      "text": "Our culture is based on respect, knowledge sharing, and long-term vision, offering employees the opportunity to work on challenging projects in a dynamic and structured organization.",
      "translated_text": "La nostra cultura si basa sul rispetto, la condivisione del sapere e una visione a lungo termine, offrendo agli dipendenti l'opportunit\u00e0 di lavorare su progetti sfidanti in un'organizzazione dinamica e strutturata."
    },
    {
      "context": "heading",
      "id": "text_7d0a8a20",
      "text": "Professional Growth",
      "translated_text": "Sviluppo professionale"
    },
    {
      "context": "paragraph",
      "id": "text_2a12da9a",
      "text": "We strongly believe in the professional growth of our people. Continuous training, on-the-job learning, and skill development are integral parts of our approach. Employees are supported through technical training programs, cross-functional collaboration, and opportunities to develop both technical and managerial competencies.",
      "translated_text": "Siamo convinti fortemente nel miglioramento del nostro personale. I programmi di formazione continua, l'apprendimento sul posto e lo sviluppo delle competenze sono parte integrante della nostra approccio. Gli dipendenti sono sostenuti attraverso i programmi di formazione tecnica, la collaborazione cross-funcionale e le opportunit\u00e0 per sviluppare sia le competenze tecniche che gestionali."
    },
    {
      "context": "paragraph",
      "id": "text_66b3e255",
      "text": "By investing in people, we ensure the development of expertise that supports innovation and guarantees high-quality solutions for our customers worldwide.",
      "translated_text": "Investendo nel nostro personale, assicuriamo lo sviluppo delle competenze che supportano l'innovazione e garantono soluzioni di alta qualit\u00e0 per i nostri clienti in tutto il mondo."
    },
    {
      "context": "heading",
      "id": "text_767fee14",
      "text": "Open Positions",
      "translated_text": "Posizioni aperte"
    },
    {
      "context": "paragraph",
      "id": "text_3870be17",
      "text": "We are constantly looking for motivated professionals to join our teams in engineering, production, service, and corporate functions. Open positions are aimed at candidates who share our commitment to quality, precision, and continuous improvement.",
      "translated_text": "Siamo costantemente alla ricerca di professionisti motivati per unirsi alle nostre squadre nel settore ingegneria, produzione, servizi e funzioni corporate. Le posizioni aperte sono rivolte a candidati che condividono la nostra impegno per la qualit\u00e0, la precisione e l'impegno continuo."
    },
    {
      "context": "paragraph",
      "id": "text_249063ca",
      "text": "Candidates interested in joining our organization can apply by submitting their application through the dedicated recruitment channels. Each application is evaluated carefully to ensure alignment with our values and organizational needs.",
      "translated_text": "I candidati interessati a unirsi alla nostra organizzazione possono candidarsi inviando la propria domanda attraverso i canali di reclutamento dedicati. Ogni richiesta \u00e8 valutata con attenzione per assicurare l'adesione ai nostri valori e alle esigenze organizzative."
    }
  ]
"""

# Run the function
if __name__ == "__main__":
    split_translation_data(input_json_string)