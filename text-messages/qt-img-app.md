[[pyapp]] The goal of this project is to create a full featured, working, and tested PyQt6 GUI application in Python for viewing and browsing image files (.jpg, .png, .gif, etc.).

It should consist of multiple, modular, reusable components/widgets, and should be easy to extend and modify. 

The requirements are:
- The `MainAppContainer` main app/window container/component with a menu bar and a toolbar. The code for this component/module will be in the `main_app_container.py` file.
- The `FileSystemBrowser` component - A tree view/selection component/module of the file system which allows browsing and selecting/deselecting multiple files and directories by clicking with the mouse. Clicking on an already selected item should deselect it. The application/file tree should visually indicate which items are currently selected/deselected, ideally with check boxes.The tree view should be able to display the file system in a hierarchical structure, with folders and files. The code for this component/module will be in the `file_system_browser.py` file.

- The `ImageViewer` component - an image viewer component/module for displaying individual images. This component/module will be in the `image_viewer.py` file.

- The `ImageViewContainer` component - An image viewer container component, which allows the user to view multiple images at once, using multiple instances of the `ImageViewer` component. This component/module will be in the `image_viewer_container.py` file.

This will be a complex project, with multiple steps and iterations. The first steps:

- Create the `MainAppContainer` component as described above.
- Create the `FileSystemBrowser` component as above.
- Create the `ImageViewer` component as above.
- Create the `ImageViewContainer` component as above.

The `MainAppContainer` component will be the main window of the application, and will contain the `FileSystemBrowser` on the left side, and the `ImageViewContainer` component on the right side.

Please make sure to follow the best practices for Python and PyQt6, and make sure to write clean, well-structured, and well-documented code. Generate the code now, and make sure to review and test it thoroughly before submitting it.