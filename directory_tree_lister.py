"""
Generate a tree-like representation of the current directory.

This script recursively lists files and subfolders using indentation and 
tree-style characters for readability. It is useful for quickly creating a 
text-based overview of a directory structure.

The `IGNORE_LIST` (case-sensitive) can be used to specify files and folders
to ignore.

Options:
    --display
        Display the directory tree as it is being constructed.

Example:
    python directory_tree_lister.py --display

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

import argparse

from pathlib import Path

# Constants
PATH = Path(__file__).parent
OUTPUT_FILENAME = "dtl_output.txt"
IGNORE_LIST = [
	Path(__file__).name, 
    OUTPUT_FILENAME,
    ".git", 
	"__pycache__"
]

# CLI arguments
parser = argparse.ArgumentParser()
parser.add_argument("--display", action="store_true")
args = parser.parse_args()

# Local
tree_structure = [PATH.name]

def build_directory_structure(dir_path, indent=0):
    """Recursively lists directory contents in a tree-like format, ignoring specified folders."""
    for item in sorted(dir_path.iterdir()):
        if item.name in IGNORE_LIST:
            continue  
        
        prefix = "│   " * indent + "├── "
        name = prefix + item.name

        tree_structure.append(name)

        if args.display:
            print(name)
        
        if item.is_dir():
            build_directory_structure(item, indent + 1)


if __name__ == "__main__":
    print(f"Creating directory tree for '{PATH.resolve()}'...\n")

    if args.display:
        print(PATH.name)

    build_directory_structure(PATH)
    
    with open(OUTPUT_FILENAME, "w", encoding="utf-8") as f:
        f.write("\n".join(tree_structure))
        print(f"\nSaved output to: {(PATH / OUTPUT_FILENAME).resolve()}")