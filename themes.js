// PowerShell/Batch Visual IDE - Theme Management

// Available themes
const editorThemes = {
    'vs-dark': {
        name: 'VS Dark',
        base: 'vs-dark',
        colors: {
            'editor.background': '#1e1e2e',
            'editor.foreground': '#f8f9fa',
            'editorCursor.foreground': '#f8f9fa',
            'editor.lineHighlightBackground': '#2d2d44',
            'editor.selectionBackground': '#4a4a6a',
            'editorLineNumber.foreground': '#adb5bd',
            'editorLineNumber.activeForeground': '#f8f9fa',
            'editorIndentGuide.background': '#4a4a6a',
            'editorIndentGuide.activeBackground': '#6a6a8a'
        }
    },
    'monokai': {
        name: 'Monokai',
        base: 'vs-dark',
        colors: {
            'editor.background': '#272822',
            'editor.foreground': '#f8f8f2',
            'editorCursor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#3e3d32',
            'editor.selectionBackground': '#49483e',
            'editorLineNumber.foreground': '#90908a',
            'editorLineNumber.activeForeground': '#f8f8f2',
            'editorIndentGuide.background': '#3b3a32',
            'editorIndentGuide.activeBackground': '#9d550f'
        },
        rules: [
            { token: 'comment', foreground: '#75715e' },
            { token: 'string', foreground: '#e6db74' },
            { token: 'keyword', foreground: '#f92672' },
            { token: 'number', foreground: '#ae81ff' },
            { token: 'identifier', foreground: '#a6e22e' },
            { token: 'variable', foreground: '#66d9ef' },
            { token: 'variable.predefined', foreground: '#66d9ef', fontStyle: 'italic' },
            { token: 'function', foreground: '#a6e22e' },
            { token: 'operator', foreground: '#f92672' },
            { token: 'tag', foreground: '#f92672' },
            { token: 'attribute.name', foreground: '#a6e22e' },
            { token: 'attribute.value', foreground: '#e6db74' }
        ]
    },
    'github-dark': {
        name: 'GitHub Dark',
        base: 'vs-dark',
        colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#c9d1d9',
            'editorCursor.foreground': '#c9d1d9',
            'editor.lineHighlightBackground': '#161b22',
            'editor.selectionBackground': '#2d333b',
            'editorLineNumber.foreground': '#6e7681',
            'editorLineNumber.activeForeground': '#c9d1d9',
            'editorIndentGuide.background': '#21262d',
            'editorIndentGuide.activeBackground': '#30363d'
        },
        rules: [
            { token: 'comment', foreground: '#8b949e' },
            { token: 'string', foreground: '#a5d6ff' },
            { token: 'keyword', foreground: '#ff7b72' },
            { token: 'number', foreground: '#79c0ff' },
            { token: 'identifier', foreground: '#c9d1d9' },
            { token: 'variable', foreground: '#ffa657' },
            { token: 'function', foreground: '#d2a8ff' },
            { token: 'operator', foreground: '#ff7b72' },
            { token: 'tag', foreground: '#7ee787' },
            { token: 'attribute.name', foreground: '#79c0ff' },
            { token: 'attribute.value', foreground: '#a5d6ff' }
        ]
    },
    'solarized-dark': {
        name: 'Solarized Dark',
        base: 'vs-dark',
        colors: {
            'editor.background': '#002b36',
            'editor.foreground': '#839496',
            'editorCursor.foreground': '#839496',
            'editor.lineHighlightBackground': '#073642',
            'editor.selectionBackground': '#073642',
            'editorLineNumber.foreground': '#586e75',
            'editorLineNumber.activeForeground': '#839496',
            'editorIndentGuide.background': '#073642',
            'editorIndentGuide.activeBackground': '#586e75'
        },
        rules: [
            { token: 'comment', foreground: '#586e75' },
            { token: 'string', foreground: '#2aa198' },
            { token: 'keyword', foreground: '#cb4b16' },
            { token: 'number', foreground: '#d33682' },
            { token: 'identifier', foreground: '#839496' },
            { token: 'variable', foreground: '#268bd2' },
            { token: 'function', foreground: '#b58900' },
            { token: 'operator', foreground: '#cb4b16' },
            { token: 'tag', foreground: '#268bd2' },
            { token: 'attribute.name', foreground: '#b58900' },
            { token: 'attribute.value', foreground: '#2aa198' }
        ]
    },
    'dracula': {
        name: 'Dracula',
        base: 'vs-dark',
        colors: {
            'editor.background': '#282a36',
            'editor.foreground': '#f8f8f2',
            'editorCursor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#44475a',
            'editor.selectionBackground': '#44475a',
            'editorLineNumber.foreground': '#6272a4',
            'editorLineNumber.activeForeground': '#f8f8f2',
            'editorIndentGuide.background': '#44475a',
            'editorIndentGuide.activeBackground': '#6272a4'
        },
        rules: [
            { token: 'comment', foreground: '#6272a4' },
            { token: 'string', foreground: '#f1fa8c' },
            { token: 'keyword', foreground: '#ff79c6' },
            { token: 'number', foreground: '#bd93f9' },
            { token: 'identifier', foreground: '#f8f8f2' },
            { token: 'variable', foreground: '#8be9fd' },
            { token: 'function', foreground: '#50fa7b' },
            { token: 'operator', foreground: '#ff79c6' },
            { token: 'tag', foreground: '#ff79c6' },
            { token: 'attribute.name', foreground: '#50fa7b' },
            { token: 'attribute.value', foreground: '#f1fa8c' }
        ]
    },
    'light': {
        name: 'Light',
        base: 'vs',
        colors: {
            'editor.background': '#ffffff',
            'editor.foreground': '#000000',
            'editorCursor.foreground': '#000000',
            'editor.lineHighlightBackground': '#f5f5f5',
            'editor.selectionBackground': '#add6ff',
            'editorLineNumber.foreground': '#999999',
            'editorLineNumber.activeForeground': '#333333',
            'editorIndentGuide.background': '#d3d3d3',
            'editorIndentGuide.activeBackground': '#a0a0a0'
        }
    }
};

// Initialize theme selector
function initializeThemeSelector() {
    // Create theme selector dropdown
    const themeSelector = document.createElement('select');
    themeSelector.id = 'theme-selector';
    themeSelector.className = 'theme-selector';
    
    // Add theme options
    Object.keys(editorThemes).forEach(themeId => {
        const option = document.createElement('option');
        option.value = themeId;
        option.textContent = editorThemes[themeId].name;
        if (themeId === currentTheme) {
            option.selected = true;
        }
        themeSelector.appendChild(option);
    });
    
    // Add theme selector to toolbar
    const themeContainer = document.createElement('div');
    themeContainer.className = 'theme-container';
    themeContainer.innerHTML = '<span>Theme:</span>';
    themeContainer.appendChild(themeSelector);
    
    // Find a good place to insert the theme selector
    const toolbar = document.querySelector('.toolbar');
    const lastDivider = Array.from(toolbar.querySelectorAll('.vr')).pop();
    if (lastDivider) {
        toolbar.insertBefore(themeContainer, lastDivider.nextSibling);
    } else {
        toolbar.appendChild(themeContainer);
    }
    
    // Add event listener for theme change
    themeSelector.addEventListener('change', function() {
        changeEditorTheme(this.value);
    });
}

// Change editor theme
function changeEditorTheme(themeId) {
    if (!editorThemes[themeId]) return;
    
    const theme = editorThemes[themeId];
    currentTheme = themeId;
    
    // Define the theme
    monaco.editor.defineTheme(themeId, {
        base: theme.base,
        inherit: true,
        colors: theme.colors || {},
        rules: theme.rules || []
    });
    
    // Set the theme
    monaco.editor.setTheme(themeId);
    
    // Save theme preference
    localStorage.setItem('editorTheme', themeId);
    
    // Update status bar
    document.querySelector('.status-bar').style.backgroundColor = theme.colors['editor.background'] || '';
    
    // Show theme change message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Theme changed to ${theme.name}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Load saved theme preference
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme && editorThemes[savedTheme]) {
        changeEditorTheme(savedTheme);
    }
}