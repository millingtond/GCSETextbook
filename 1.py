import os

# A comprehensive list of all the files needed for the project.
# The script will create the necessary directories based on these paths.
PROJECT_FILES = [
    # Configuration
    "package.json",
    "vite.config.js",

    # Public assets and PWA files
    "public/index.html",
    "public/manifest.json",
    "public/service-worker.js",
    "public/icon-192.png", # Placeholder for icon
    "public/icon-512.png", # Placeholder for icon

    # Main application source
    "src/App.jsx",
    "src/main.jsx",
    "src/index.css",
    "src/App.css",

    # Data
    "src/data/topics.json",

    # Reusable Components
    "src/components/Sidebar.jsx",
    "src/components/Sidebar.css",
    "src/components/SearchBar.jsx",
    "src/components/SearchBar.css",
    "src/components/ProgressTracker.jsx",
    "src/components/ProgressTracker.css",
    "src/components/PyodideRunner.jsx",
    "src/components/PyodideRunner.css",
    "src/components/CommandPalette.jsx",
    "src/components/CommandPalette.css",
    "src/components/HelpBanner.jsx",
    "src/components/HelpBanner.css",
    "src/components/charts/RagChart.jsx",

    # Application Pages
    "src/pages/HomePage.jsx",
    "src/pages/HomePage.css",
    "src/pages/TopicPage.jsx",
    "src/pages/TopicPage.css",
    "src/pages/DashboardPage.jsx",
    "src/pages/DashboardPage.css",
    "src/pages/GlossaryPage.jsx",
    "src/pages/GlossaryPage.css",

    # State Management (Redux)
    "src/state/progressSlice.js",
    "src/state/store.js",
]

def create_project_files():
    """
    Creates the necessary directories and empty files for the project.
    """
    print("Creating project directory structure and empty files...")
    
    base_dir = os.getcwd()

    for file_path in PROJECT_FILES:
        full_path = os.path.join(base_dir, file_path)
        
        # Create the directory if it doesn't already exist.
        dir_name = os.path.dirname(full_path)
        if dir_name:
            os.makedirs(dir_name, exist_ok=True)
        
        # Create an empty file.
        # The 'pass' statement means we do nothing, just create the file.
        try:
            with open(full_path, 'w') as f:
                pass
            print(f"  Created: {full_path}")
        except OSError as e:
            print(f"Error creating file {full_path}: {e}")

    print("\nEmpty file structure created successfully!")
    print("You can now begin adding code to each file.")

if __name__ == "__main__":
    create_project_files()
