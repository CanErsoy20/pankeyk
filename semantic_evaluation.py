import json
import torch
import os
from sentence_transformers import SentenceTransformer, util

def evaluate_semantic_similarity(reference_file, candidate_file, output_path, model):
    """
    Calculates semantic similarity and saves result to the page folder.
    """
    try:
        with open(reference_file, 'r', encoding='utf-8') as f:
            refs = json.load(f)
        with open(candidate_file, 'r', encoding='utf-8') as f:
            cands = json.load(f)
    except FileNotFoundError as e:
        print(f"Skipping: {e}")
        return

    total_similarity = 0
    count = 0

    for key, ref_text in refs.items():
        if key in cands:
            cand_text = cands[key]

            # Encode and compute cosine similarity
            emb_ref = model.encode(ref_text, convert_to_tensor=True)
            emb_cand = model.encode(cand_text, convert_to_tensor=True)
            similarity = util.pytorch_cos_sim(emb_ref, emb_cand).item()
            
            total_similarity += similarity
            count += 1

    if count > 0:
        avg_sim = total_similarity / count
        
        # Prepare report content
        report = [
            f"Total Evaluated Items: {count}",
            f"Average Semantic Similarity: {avg_sim:.4f}",
        ]
        
        # Save results to the page directory
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("\n".join(report))
        print(f"Success: Semantic report saved to {output_path}")
    else:
        print(f"No matching keys found in {os.path.dirname(output_path)}")

def process_all_pages_semantic(base_root):
    """
    Traverses subfolders (e.g., llama3.1/home) and performs evaluation.
    """
    # Load model once to save time and memory
    print("Loading Transformer model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')

    for page_name in os.listdir(base_root):
        page_folder = os.path.join(base_root, page_name)
        
        if os.path.isdir(page_folder):
            candidate_path = os.path.join(page_folder, 'it.json')  
            reference_path = os.path.join(page_folder, 'en.json')
            output_file = os.path.join(page_folder, 'semantic_scores.txt')
            
            print(f"Processing Semantic Similarity for: {page_name}...")
            evaluate_semantic_similarity(reference_path, candidate_path, output_file, model)

if __name__ == "__main__":
    target_folder = './llama3.2-3b/' 
    process_all_pages_semantic(target_folder)