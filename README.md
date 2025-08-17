# PowerShell/Batch Visual IDE

A sleek, modern, dark-themed IDE specifically designed for PowerShell and Batch file development with beginner-friendly features akin to Visual Basic 6.

## Features

### Dark Theme Interface
- Modern, visually appealing dark theme design
- Clean layout with intuitive organization
- Responsive design that works on different screen sizes

### File Management
- Create new PowerShell (.ps1) and Batch (.bat/.cmd) files
- Open existing scripts
- Save your work
- Export scripts for download

### Language Support
- Full syntax highlighting for PowerShell scripts
- Full syntax highlighting for Batch files
- Auto-completion for PowerShell commands
- Language switching between PowerShell and Batch modes

### Visual Development Tools
- GUI Builder for PowerShell Windows Forms applications
- Component palette for drag-and-drop GUI design
- Pre-built templates for common application types

### Project Templates
- CLI Application template for command-line PowerShell scripts
- GUI Application template for Windows Forms applications
- Batch Utility template for menu-driven batch scripts
- Module Project template for PowerShell modules with manifest files

### Module Management
- Import PowerShell modules directly into your scripts
- Access to commonly used PowerShell modules

### Debugging Capabilities
- Debug PowerShell scripts with breakpoint support
- Variable inspection (simulated)
- Step through code execution (simulated)

## How to Use

1. **Creating Files**: Use the "File" menu or toolbar buttons to create new files with templates
2. **Project Creation**: Use the "Project" menu to start new projects from templates
3. **GUI Development**: Click the "GUI Builder" button to access visual components for PowerShell GUI apps
4. **Module Importing**: Click the "Modules" button to import PowerShell modules
5. **Running Scripts**: Use the "Run" button to execute scripts (simulated)
6. **Debugging**: Use the "Debug" button to start a debugging session (simulated)
7. **Exporting**: Use the "Export" button to download your scripts

## Technology Stack

- HTML5/CSS3 for structure and styling
- JavaScript for functionality
- Monaco Editor for code editing (same engine as VS Code)
- Bootstrap 5 for UI components
- Font Awesome for icons

## Accessing the IDE

The IDE can be accessed through a web browser. All functionality is contained within a single HTML file with associated CSS and JavaScript files.

## Limitations

This is a frontend-only implementation that simulates IDE functionality. In a production environment, this would need:
- Backend integration for actual script execution
- File system access for real file management
- PowerShell runtime integration for debugging
- Extension marketplace for modules and templates