from pathlib import Path

"""
This script generates a tree-like representation of the directory structure 
for the folder in which it is run. It recursively lists files and subfolders, 
using indentation and tree characters for readability.

Designed for quickly creating a text-based directory overview, this script 
makes it easy to share or analyze folder structures. Users can specify files 
and folders to ignore.

NOTE: Ignore list entries are case-sensitive.

Example Output:

Web
├── app.js
├── index.html
├── source
│   ├── app.js
│   ├── app.ts
│   ├── js
│   │   ├── app.js
│   │   ├── app.js.map
│   ├── tsconfig.json
├── styles.css
├── workspace.code-workspace
"""

PATH = Path(__file__).parent
OUTPUT_FILENAME = PATH / (Path(__file__).stem + "_output.txt")

SAVE_AS_FILE = False
IGNORE_LIST = [Path(__file__).name, OUTPUT_FILENAME.name,
            ".git"]

tree_structure = [PATH.name]

def build_directory_structure(dir_path, indent=0):
    """Recursively lists directory contents in a tree-like format, ignoring specified folders."""
    for item in sorted(dir_path.iterdir()):
        if item.name in IGNORE_LIST:
            continue  
        
        prefix = "│   " * indent + "├── "
        tree_structure.append(prefix + item.name)
        
        if item.is_dir():
            build_directory_structure(item, indent + 1)

if __name__ == "__main__":
    build_directory_structure(PATH)

    for line in tree_structure:
        print(line)
    
    if SAVE_AS_FILE:
        with open(OUTPUT_FILENAME, "w", encoding="utf-8") as f:
            f.write("\n".join(tree_structure))
            print(f"Saved output to: {OUTPUT_FILENAME}")