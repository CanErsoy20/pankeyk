import json
import nltk
import os
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

# Ensure tokenizer is downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def evaluate_files(reference_file, candidate_file, output_path):
    # Load the data
    try:
        refs = load_json(reference_file)  # Your Ground Truth (e.g., it.json)
        cands = load_json(candidate_file) # Your AI Output (e.g., en.json)
    except FileNotFoundError as e:
        print(f"Skipping: {e}")
        return

    total_bleu = 0
    exact_matches = 0
    count = 0
    smoother = SmoothingFunction().method1
    
    report_lines = []

    # Iterate through all keys in the reference file
    for key, ref_text in refs.items():
        if key in cands:
            cand_text = cands[key]

            # Case-insensitive normalization (improves score for UI consistency)
            ref_norm = ref_text.strip().lower()
            cand_norm = cand_text.strip().lower()

            # Tokenize
            ref_tokens = nltk.word_tokenize(ref_norm)
            cand_tokens = nltk.word_tokenize(cand_norm)

            # Calculate BLEU
            score = sentence_bleu([ref_tokens], cand_tokens, smoothing_function=smoother)
            
            # Check Exact Match
            is_exact = (ref_norm == cand_norm)
            if is_exact:
                exact_matches += 1

            total_bleu += score
            count += 1

    # Final Statistics Calculation
    if count > 0:
        avg_bleu = total_bleu / count
        exact_acc = (exact_matches / count) * 100
        
        report_lines.append(f"Total Strings Evaluated: {count}")
        report_lines.append(f"Average BLEU Score:      {avg_bleu:.4f}")
        report_lines.append(f"Exact Match Accuracy:    {exact_acc:.2f}%")
        
        # Write to the specific folder
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("\n".join(report_lines))
        print(f"Success: Report saved to {output_path}")
    else:
        print(f"No matching keys found in {os.path.dirname(output_path)}")

def process_all_pages(base_root):
    """
    Parses folder hierarchy: base_root -> page_folder -> en.json/it.json
    Example: llama3.1/home/en.json
    """
    # Iterate through subfolders (home, company, etc.)
    for page_name in os.listdir(base_root):
        page_folder = os.path.join(base_root, page_name)
        
        if os.path.isdir(page_folder):
            # Paths to your files based on your hierarchy
            candidate_path = os.path.join(page_folder, 'it.json')   # AI Output
            reference_path = os.path.join(page_folder, 'en.json')   # Ground Truth
            output_file = os.path.join(page_folder, 'blue_scores.txt')
            
            print(f"Processing Page: {page_name}...")
            evaluate_files(reference_path, candidate_path, output_file)

if __name__ == "__main__":
    # Specify your top-level model folder here
    # Structure: ./llama3.1/home/en.json
    target_model_folder = './llama3.2-3b/' 
    process_all_pages(target_model_folder)