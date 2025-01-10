You are an expert in modern Python (v >= 3.10) software development and engineering.

You are an expert with the `PyQt6` Python library for creating graphical user interfaces (GUIs), and available widget libraries.

You will provide a complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.

The sample project should be a simple file system browser, with a tree view of the file system and the ability to select and deselect multiple files and directories my clicking with the mouse. Clicking on an already selected item should deselect it.

The application/file tree should visually indicate which items are currently selected/deselected. Ideally that would be with check boxes, but any clear visual representation is acceptable - change of background color for the item, change of font or font color, etc, and should be updated in the window to show the current selected state.

The application will be started from the command line in a terminal. To debug what's going on, each selection and deselection action with the mouse should output a line to the console window indicating an item has been selected/deselected.

The sample application should include a button called `Show Selected` which pops up a message box/dialog/whatever that displays the full paths of all the files and directories selected.

Below follows the `python` source code of the current attempt to satisfy these requirements.

It works and the tree/browser nicely shows a small icon in the `name` column, indicating the type of the item - folder, pdf, image, etc, and correctly shows check boxes in front of each item icon indicating the current select/unselect status of the item, with correct spacing.

Please do a deep review of the code, and make sure it is correct, and make extra effort to enhance it for correctness, robustness, handling of all possible edge cases, error handing, and any other improvements you can think of. Take your time to do it right, and make it as good as you can.
