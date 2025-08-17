// PowerShell/Batch Visual IDE - JavaScript Functionality

// Global variables
let editor;
let currentLanguage = 'powershell';
let currentTheme = 'vs-dark';
let currentFileName = 'script.ps1';
let projectFiles = {
    'script.ps1': {
        content: [
            '# PowerShell Script',
            '# This is a sample PowerShell script',
            'Write-Host "Hello, World!"',
            '',
            '# You can create GUI applications like this:',
            '# Add-Type -AssemblyName System.Windows.Forms',
            '# $form = New-Object System.Windows.Forms.Form',
            '# $form.Text = "My Application"',
            '# $form.Size = New-Object System.Drawing.Size(300,200)',
            '# $form.ShowDialog()'
        ].join('\n'),
        language: 'powershell'
    },
    'batch.cmd': {
        content: [
            '@echo off',
            'REM This is a sample batch file',
            'echo Hello, World!',
            'pause'
        ].join('\n'),
        language: 'batch'
    }
};

// Initialize the IDE when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    updateStatusBar();
    
    // Load linting script
    const lintingScript = document.createElement('script');
    lintingScript.src = 'linting.js';
    lintingScript.onload = function() {
        // Enable linting after script is loaded
        enableLinting();
    };
    document.head.appendChild(lintingScript);
    
    // Load themes script
    const themesScript = document.createElement('script');
    themesScript.src = 'themes.js';
    themesScript.onload = function() {
        // Initialize theme selector after script is loaded
        initializeThemeSelector();
        loadSavedTheme();
    };
    document.head.appendChild(themesScript);
});

// Enable script linting
function enableLinting() {
    if (typeof analyzeScript === 'function') {
        // Set up model change listener for linting
        editor.onDidChangeModelContent(function() {
            const content = editor.getValue();
            const markers = analyzeScript(content, currentLanguage);
            monaco.editor.setModelMarkers(editor.getModel(), 'linting', markers);
        });
        
        // Initial linting of current content
        const content = editor.getValue();
        const markers = analyzeScript(content, currentLanguage);
        monaco.editor.setModelMarkers(editor.getModel(), 'linting', markers);
    }
}

// Initialize Monaco Editor
function initializeEditor() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: [
                '# PowerShell Script',
                '# This is a sample PowerShell script',
                'Write-Host "Hello, World!"',
                '',
                '# You can create GUI applications like this:',
                '# Add-Type -AssemblyName System.Windows.Forms',
                '# $form = New-Object System.Windows.Forms.Form',
                '# $form.Text = "My Application"',
                '# $form.Size = New-Object System.Drawing.Size(300,200)',
                '# $form.ShowDialog()'
            ].join('\n'),
            language: 'powershell',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: {
                enabled: true
            },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            snippetSuggestions: "inline",
            parameterHints: {
                enabled: true
            }
        });
        
        // Register Batch file language
        monaco.languages.register({ id: 'batch' });
        
        // Define Batch file syntax highlighting
        monaco.languages.setMonarchTokensProvider('batch', {
            tokenizer: {
                root: [
                    [/^(\s*)(rem\b.*)$/, ['white', 'comment']],
                    [/^(\s*)(@?echo\b.*)$/, ['white', 'string']],
                    [/(::.*$)/, 'comment'],
                    [/(^[A-Za-z]*:)/, 'tag'], // labels
                    [/(goto\b)/, 'keyword'],
                    [/(call\b)/, 'keyword'],
                    [/(\b(?:if|else|for|do|while|break|continue)\b)/, 'keyword'],
                    [/(\b(?:dir|copy|del|move|ren|md|rd|cls|echo|set|path|pause|exit|type|find|more|sort|date|time|ver|vol|diskcomp|diskcopy|format|label|mode|print|prompt|color|title|pushd|popd|shift|start|assoc|ftype|help|timeout|tasklist|taskkill|reg|schtasks|net|ping|ipconfig|systeminfo|driverquery|nslookup|at|whoami|eventcreate|eventquery|eventtriggers|getmac|logman|openfiles|perfmon|psr|pwlauncher|rcp|repair-bde|replace|robocopy|runas|rwinsta|sc|takeown|tcmsetup|tpmvscmgr|tzutil|typeperf|w32tm|waitfor|wbadmin|wecutil|wevtutil|winrm|winrs|bitsadmin|certreq|certutil|chkdsk|chkntfs|cipher|clip|cmdkey|compact|convert|defrag|diskpart|doskey|driverquery|expand|extract|fc|fsutil|ftype|gpresult|gpupdate|icacls|klist|ksetup|logman|makecab|mountvol|openfiles|pnputil|powercfg|print|recover|regini|reg|schtasks|secpol|setx|tree|typeperf|verify|wevtutil|wmic|wusa)\b)/, 'keyword'],
                    [/(%[^%]*%)/, 'variable'], // environment variables
                    [/(%%\w+%%)/, 'variable'], // special variables
                    [/(\d+)/, 'number'],
                    [/("[^"]*")/, 'string'],
                    [/(<)([^>]*)(>)/, ['delimiter', 'identifier', 'delimiter']],
                ]
            }
        });
        
        // Define PowerShell completion items with intelligent suggestions
        monaco.languages.registerCompletionItemProvider('powershell', {
            triggerCharacters: ['-', '$', '.'],
            provideCompletionItems: function(model, position) {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                
                const wordAtPosition = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: wordAtPosition.startColumn,
                    endColumn: wordAtPosition.endColumn
                };
                
                // Common PowerShell cmdlets
                const cmdletSuggestions = [
                    { label: 'Get-Process', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Get-Process', detail: 'Gets the processes that are running on the local computer.' },
                    { label: 'Get-Service', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Get-Service', detail: 'Gets the services on the local computer.' },
                    { label: 'Get-Content', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Get-Content', detail: 'Gets the content of the item at the specified location.' },
                    { label: 'Set-Content', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Set-Content', detail: 'Writes or replaces the content in an item with new content.' },
                    { label: 'New-Item', kind: monaco.languages.CompletionItemKind.Function, insertText: 'New-Item', detail: 'Creates a new item.' },
                    { label: 'Remove-Item', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Remove-Item', detail: 'Deletes the specified items.' },
                    { label: 'Invoke-Command', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Invoke-Command', detail: 'Runs commands on local and remote computers.' },
                    { label: 'Write-Host', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Write-Host', detail: 'Writes customized output to a host.' },
                    { label: 'Write-Output', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Write-Output', detail: 'Sends the specified objects to the next command in the pipeline.' },
                    { label: 'ForEach-Object', kind: monaco.languages.CompletionItemKind.Function, insertText: 'ForEach-Object', detail: 'Performs an operation against each item in a collection of input objects.' },
                    { label: 'Where-Object', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Where-Object', detail: 'Selects objects from a collection based on their property values.' },
                    { label: 'Select-Object', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Select-Object', detail: 'Selects objects or object properties.' },
                    { label: 'Sort-Object', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Sort-Object', detail: 'Sorts objects by property values.' },
                    { label: 'Measure-Object', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Measure-Object', detail: 'Calculates the numeric properties of objects.' },
                    { label: 'Import-Module', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Import-Module', detail: 'Adds modules to the current session.' },
                    { label: 'Export-Module', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Export-Module', detail: 'Exports a module member or a module.' }
                ];
                
                // PowerShell parameter suggestions
                const parameterSuggestions = [
                    { label: '-Path', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Path ', detail: 'Specifies the path to an item.' },
                    { label: '-LiteralPath', kind: monaco.languages.CompletionItemKind.Property, insertText: '-LiteralPath ', detail: 'Specifies the path to an item. The value is used exactly as it is typed.' },
                    { label: '-Filter', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Filter ', detail: 'Specifies a filter in the provider\'s format or language.' },
                    { label: '-Include', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Include ', detail: 'Specifies items that this cmdlet includes in the operation.' },
                    { label: '-Exclude', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Exclude ', detail: 'Specifies items that this cmdlet omits from the operation.' },
                    { label: '-Recurse', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Recurse', detail: 'Gets the items in the specified locations and in all child items of the locations.' },
                    { label: '-Force', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Force', detail: 'Forces the command to run without asking for user confirmation.' },
                    { label: '-Verbose', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Verbose', detail: 'Displays detailed information about the operation.' },
                    { label: '-Debug', kind: monaco.languages.CompletionItemKind.Property, insertText: '-Debug', detail: 'Displays programmer-level detail about the operation.' },
                    { label: '-ErrorAction', kind: monaco.languages.CompletionItemKind.Property, insertText: '-ErrorAction ', detail: 'Specifies what action to take if an error occurs.' },
                    { label: '-WarningAction', kind: monaco.languages.CompletionItemKind.Property, insertText: '-WarningAction ', detail: 'Specifies what action to take if a warning occurs.' },
                    { label: '-InformationAction', kind: monaco.languages.CompletionItemKind.Property, insertText: '-InformationAction ', detail: 'Specifies what action to take if an information event occurs.' },
                    { label: '-ErrorVariable', kind: monaco.languages.CompletionItemKind.Property, insertText: '-ErrorVariable ', detail: 'Stores error messages in the specified variable.' },
                    { label: '-WarningVariable', kind: monaco.languages.CompletionItemKind.Property, insertText: '-WarningVariable ', detail: 'Stores warning messages in the specified variable.' },
                    { label: '-OutVariable', kind: monaco.languages.CompletionItemKind.Property, insertText: '-OutVariable ', detail: 'Stores output objects in the specified variable.' },
                    { label: '-OutBuffer', kind: monaco.languages.CompletionItemKind.Property, insertText: '-OutBuffer ', detail: 'Specifies the number of objects to buffer before calling the next cmdlet in the pipeline.' }
                ];
                
                // PowerShell variable suggestions
                const variableSuggestions = [
                    { label: '$_', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$_', detail: 'Contains the current object in the pipeline.' },
                    { label: '$PSItem', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$PSItem', detail: 'Contains the current object in the pipeline (same as $_).' },
                    { label: '$args', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$args', detail: 'Contains an array of the undeclared parameters and/or parameter values that are passed to a function, script, or script block.' },
                    { label: '$true', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$true', detail: 'Contains TRUE.' },
                    { label: '$false', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$false', detail: 'Contains FALSE.' },
                    { label: '$null', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$null', detail: 'Contains NULL or empty value.' },
                    { label: '$PSVersionTable', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$PSVersionTable', detail: 'Contains a read-only hash table that displays details about the version of PowerShell that is running in the current session.' },
                    { label: '$Host', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$Host', detail: 'Contains an object that represents the current host application for PowerShell.' },
                    { label: '$profile', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$profile', detail: 'Contains the full path of the PowerShell profile for the current user and the current host application.' },
                    { label: '$PID', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$PID', detail: 'Contains the process identifier (PID) of the process that is hosting the current PowerShell session.' },
                    { label: '$PWD', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$PWD', detail: 'Contains an object that represents the full path of the current directory.' },
                    { label: '$PSScriptRoot', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$PSScriptRoot', detail: 'Contains the directory from which a script is being run.' },
                    { label: '$PSCommandPath', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$PSCommandPath', detail: 'Contains the full path and file name of the script that is being run.' },
                    { label: '$Error', kind: monaco.languages.CompletionItemKind.Variable, insertText: '$Error', detail: 'Contains an array of error objects that represent the most recent errors.' }
                ];
                
                // PowerShell snippets
                const snippetSuggestions = [
                    {
                        label: 'function',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'function ${1:FunctionName} {',
                            '    [CmdletBinding()]',
                            '    param(',
                            '        [Parameter(Mandatory=$true)]',
                            '        [string]$${2:Parameter}',
                            '    )',
                            '    ',
                            '    ${0:# Function body}',
                            '}'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'Create a new function with parameters',
                        documentation: 'Creates a new PowerShell function with CmdletBinding and parameters.'
                    },
                    {
                        label: 'if-else',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'if (${1:condition}) {',
                            '    ${2:# True condition}',
                            '} else {',
                            '    ${0:# False condition}',
                            '}'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'Create an if-else statement',
                        documentation: 'Creates an if-else statement block.'
                    },
                    {
                        label: 'foreach',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'foreach ($${1:item} in $${2:collection}) {',
                            '    ${0:# Code to process each item}',
                            '}'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'Create a foreach loop',
                        documentation: 'Creates a foreach loop to iterate through a collection.'
                    },
                    {
                        label: 'try-catch',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'try {',
                            '    ${1:# Code that might throw an exception}',
                            '} catch {',
                            '    ${2:# Error handling code}',
                            '    Write-Error $_.Exception.Message',
                            '} finally {',
                            '    ${0:# Cleanup code that always runs}',
                            '}'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'Create a try-catch-finally block',
                        documentation: 'Creates a try-catch-finally block for exception handling.'
                    },
                    {
                        label: 'param-block',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'param(',
                            '    [Parameter(Mandatory=$true)]',
                            '    [string]$${1:Parameter1},',
                            '    ',
                            '    [Parameter(Mandatory=$false)]',
                            '    [int]$${2:Parameter2} = ${3:DefaultValue}',
                            ')'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'Create a parameter block',
                        documentation: 'Creates a parameter block for script or function parameters.'
                    },
                    {
                        label: 'gui-form',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'Add-Type -AssemblyName System.Windows.Forms',
                            'Add-Type -AssemblyName System.Drawing',
                            '',
                            '$form = New-Object System.Windows.Forms.Form',
                            '$form.Text = "${1:Form Title}"',
                            '$form.Size = New-Object System.Drawing.Size(${2:500}, ${3:300})',
                            '$form.StartPosition = "CenterScreen"',
                            '',
                            '# Add controls here',
                            '${0:# Your controls}',
                            '',
                            '# Show form',
                            '$form.ShowDialog() | Out-Null'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'Create a Windows Forms GUI',
                        documentation: 'Creates a basic Windows Forms GUI application.'
                    }
                ];
                
                // Context-aware suggestions
                let suggestions = [];
                
                // If typing a cmdlet (at the start of a line or after a pipe)
                if (/^(\s*|\s*\|?\s*)[\w\-]*$/.test(textUntilPosition)) {
                    suggestions = suggestions.concat(cmdletSuggestions);
                }
                
                // If typing a parameter (after a cmdlet and a space)
                if (/\w+\s+\-\w*$/.test(textUntilPosition)) {
                    suggestions = suggestions.concat(parameterSuggestions);
                }
                
                // If typing a variable
                if (/.*\$\w*$/.test(textUntilPosition)) {
                    suggestions = suggestions.concat(variableSuggestions);
                }
                
                // Always include snippets
                suggestions = suggestions.concat(snippetSuggestions);
                
                return { suggestions: suggestions };
            }
        });
        
        // Define Batch file completion items
        monaco.languages.registerCompletionItemProvider('batch', {
            provideCompletionItems: function(model, position) {
                var suggestions = [
                    {
                        label: 'echo',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'echo ',
                        detail: 'Displays messages, or turns command echoing on or off.'
                    },
                    {
                        label: 'set',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'set ',
                        detail: 'Displays, sets, or removes cmd.exe environment variables.'
                    },
                    {
                        label: 'if',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'if ',
                        detail: 'Performs conditional processing in batch programs.'
                    },
                    {
                        label: 'for',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'for ',
                        detail: 'Runs a specified command for each file in a set of files.'
                    },
                    {
                        label: 'goto',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'goto ',
                        detail: 'Directs batch processing to a labeled line in the script.'
                    },
                    {
                        label: 'call',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'call ',
                        detail: 'Calls one batch program from another without stopping the parent batch program.'
                    },
                    {
                        label: 'rem',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'rem ',
                        detail: 'Records comments in a batch file.'
                    },
                    {
                        label: 'exit',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'exit ',
                        detail: 'Exits the current batch script or the CMD.EXE program.'
                    },
                    {
                        label: 'if-else',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'if ${1:condition} (',
                            '    ${2:command}',
                            ') else (',
                            '    ${0:command}',
                            ')'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'If-else statement'
                    },
                    {
                        label: 'for-loop',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'for %%${1:i} in (${2:set}) do (',
                            '    ${0:command}',
                            ')'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: 'For loop'
                    }
                ];
                return { suggestions: suggestions };
            }
        });
        
        // Add parameter hints for PowerShell cmdlets
        monaco.languages.registerSignatureHelpProvider('powershell', {
            signatureHelpTriggerCharacters: ['-', ' '],
            provideSignatureHelp: function(model, position) {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                
                // Check if we're typing a cmdlet parameter
                const cmdletMatch = textUntilPosition.match(/(\w+-\w+)\s+(.*)$/);
                if (!cmdletMatch) return null;
                
                const cmdlet = cmdletMatch[1];
                
                // Define parameter signatures for common cmdlets
                const signatures = {
                    'Get-Process': {
                        label: 'Get-Process [-Name] <String[]> [-ComputerName <String[]>] [-Module] [-FileVersionInfo]',
                        documentation: 'Gets the processes that are running on the local computer.',
                        parameters: [
                            { label: '-Name', documentation: 'Specifies the process names to retrieve.' },
                            { label: '-ComputerName', documentation: 'Specifies the computers to retrieve processes from.' },
                            { label: '-Module', documentation: 'Gets the modules that have been loaded by the processes.' },
                            { label: '-FileVersionInfo', documentation: 'Gets the file version information for the program.' }
                        ]
                    },
                    'Get-Content': {
                        label: 'Get-Content [-Path] <String[]> [-ReadCount <Int64>] [-TotalCount <Int64>] [-Tail <Int32>] [-Encoding <Encoding>]',
                        documentation: 'Gets the content of the item at the specified location.',
                        parameters: [
                            { label: '-Path', documentation: 'Specifies the path to the item.' },
                            { label: '-ReadCount', documentation: 'Specifies how many lines of content are sent through the pipeline at a time.' },
                            { label: '-TotalCount', documentation: 'Specifies the number of lines from the beginning of a file or other item.' },
                            { label: '-Tail', documentation: 'Specifies the number of lines from the end of a file or other item.' },
                            { label: '-Encoding', documentation: 'Specifies the type of encoding for the target file.' }
                        ]
                    },
                    'Write-Host': {
                        label: 'Write-Host [[-Object] <Object>] [-NoNewline] [-Separator <Object>] [-ForegroundColor <ConsoleColor>] [-BackgroundColor <ConsoleColor>]',
                        documentation: 'Writes customized output to a host.',
                        parameters: [
                            { label: '-Object', documentation: 'Objects to display in the host.' },
                            { label: '-NoNewline', documentation: 'The string representations of the input objects are concatenated to form the output, no newline is added.' },
                            { label: '-Separator', documentation: 'Specifies a separator string to insert between objects displayed by the host.' },
                            { label: '-ForegroundColor', documentation: 'Specifies the text color.' },
                            { label: '-BackgroundColor', documentation: 'Specifies the background color.' }
                        ]
                    }
                };
                
                // Return signature help if we have it for this cmdlet
                if (signatures[cmdlet]) {
                    return {
                        signatures: [
                            {
                                label: signatures[cmdlet].label,
                                documentation: signatures[cmdlet].documentation,
                                parameters: signatures[cmdlet].parameters
                            }
                        ],
                        activeSignature: 0,
                        activeParameter: 0
                    };
                }
                
                return null;
            }
        });
    });
}

// Set up event listeners for UI elements
function setupEventListeners() {
    // File menu button
    document.getElementById('fileMenuBtn').addEventListener('click', function() {
        document.getElementById('newFileModal').style.display = 'flex';
    });
    
    // Project menu button
    document.getElementById('projectMenuBtn').addEventListener('click', function() {
        document.getElementById('newProjectModal').style.display = 'flex';
    });
    
    // Open file button
    document.getElementById('openFileBtn').addEventListener('click', function() {
        openFile();
    });
    
    // Save file button
    document.getElementById('saveFileBtn').addEventListener('click', function() {
        saveFile();
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Cancel new file button
    document.getElementById('cancelNewFileBtn').addEventListener('click', function() {
        document.getElementById('newFileModal').style.display = 'none';
    });
    
    // Create new file button
    document.getElementById('createNewFileBtn').addEventListener('click', function() {
        createNewFile();
    });
    
    // Module manager button
    document.getElementById('moduleManagerBtn').addEventListener('click', function() {
        openModuleManager();
    });
    
    // Close module manager button
    document.getElementById('closeModuleManagerBtn').addEventListener('click', function() {
        document.getElementById('moduleManagerModal').style.display = 'none';
    });
    
    // GUI Builder button
    document.getElementById('guiBuilderBtn').addEventListener('click', function() {
        openGuiBuilder();
    });
    
    // Editor tab switching
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchEditorTab(this);
        });
    });
    
    // Run button
    document.getElementById('runBtn').addEventListener('click', function() {
        runScript();
    });
    
    // Debug button
    document.getElementById('debugBtn').addEventListener('click', function() {
        debugScript();
    });
    
    // Stop button
    document.getElementById('stopBtn').addEventListener('click', function() {
        stopScript();
    });
    
    // Clear output button
    document.querySelector('.output-content').addEventListener('click', function() {
        clearOutput();
    });
    
    // Sidebar item selection
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            selectSidebarItem(this);
        });
    });
    
    // GUI component selection
    document.querySelectorAll('.gui-component').forEach(component => {
        component.addEventListener('click', function() {
            selectGuiComponent(this);
        });
    });
    
    // Template item selection
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            // Highlight selected template
            document.querySelectorAll('.template-item').forEach(i => {
                i.style.borderColor = '';
            });
            this.style.borderColor = var(--accent-light);
        });
    });
    
    // Create project button
    document.getElementById('createProjectBtn').addEventListener('click', function() {
        createProject();
    });
    
    // Cancel new project button
    document.getElementById('cancelNewProjectBtn').addEventListener('click', function() {
        document.getElementById('newProjectModal').style.display = 'none';
    });
}

// Switch between editor tabs
function switchEditorTab(tabElement) {
    // Remove active class from all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    tabElement.classList.add('active');
    
    // Change editor language based on tab
    if (tabElement.textContent.includes('.ps1')) {
        currentLanguage = 'powershell';
        monaco.editor.setModelLanguage(editor.getModel(), 'powershell');
        document.querySelector('.status-bar div:first-child').innerHTML = '<i class="fas fa-code"></i> PowerShell Mode';
    } else if (tabElement.textContent.includes('.cmd') || tabElement.textContent.includes('.bat')) {
        currentLanguage = 'batch';
        monaco.editor.setModelLanguage(editor.getModel(), 'batch');
        document.querySelector('.status-bar div:first-child').innerHTML = '<i class="fas fa-code"></i> Batch Mode';
    }
    
    // Apply linting for the current language
    if (typeof analyzeScript === 'function') {
        const content = editor.getValue();
        const markers = analyzeScript(content, currentLanguage);
        monaco.editor.setModelMarkers(editor.getModel(), 'linting', markers);
    }
}

// Create a new file
function createNewFile() {
    const fileName = document.getElementById('fileName').value;
    const fileType = document.getElementById('fileType').value;
    const template = document.getElementById('template').value;
    
    if (!fileName) {
        alert('Please enter a file name');
        return;
    }
    
    // Add file extension if not provided
    let fullFileName = fileName;
    if (!fileName.includes('.')) {
        fullFileName = fileName + '.' + fileType;
    }
    
    let content = '';
    let language = 'powershell';
    
    // Set content based on template
    switch (template) {
        case 'empty':
            content = '';
            break;
        case 'cli':
            if (fileType === 'ps1') {
                content = [
                    '# CLI PowerShell Script',
                    'param(',
                    '    [string]$Parameter1,',
                    '    [int]$Parameter2',
                    ')',
                    '',
                    'Write-Host "Parameter1: $Parameter1"',
                    'Write-Host "Parameter2: $Parameter2"',
                    '',
                    '# Your code here',
                    ''
                ].join('\n');
                language = 'powershell';
            } else {
                content = [
                    '@echo off',
                    'REM CLI Batch Script',
                    'set Parameter1=%1',
                    'set Parameter2=%2',
                    '',
                    'echo Parameter1: %Parameter1%',
                    'echo Parameter2: %Parameter2%',
                    '',
                    'REM Your code here',
                    'pause',
                    ''
                ].join('\n');
                language = 'batch';
            }
            break;
        case 'gui':
            if (fileType === 'ps1') {
                content = [
                    '# GUI PowerShell Application',
                    'Add-Type -AssemblyName System.Windows.Forms',
                    '',
                    '# Create form',
                    '$form = New-Object System.Windows.Forms.Form',
                    '$form.Text = "My Application"',
                    '$form.Size = New-Object System.Drawing.Size(400,300)',
                    '$form.StartPosition = "CenterScreen"',
                    '',
                    '# Add controls here',
                    '# Example:',
                    '# $button = New-Object System.Windows.Forms.Button',
                    '# $button.Text = "Click Me"',
                    '# $button.Location = New-Object System.Drawing.Point(150,100)',
                    '# $form.Controls.Add($button)',
                    '',
                    '# Show form',
                    '$form.ShowDialog() | Out-Null',
                    ''
                ].join('\n');
                language = 'powershell';
            } else {
                content = [
                    '@echo off',
                    'REM GUI Batch Application is limited',
                    'REM Batch files are primarily CLI-based',
                    'REM For GUI applications, PowerShell is recommended',
                    '',
                    'echo This is a batch file - GUI creation is limited',
                    'echo Consider using PowerShell for GUI applications',
                    'pause',
                    ''
                ].join('\n');
                language = 'batch';
            }
            break;
        case 'module':
            if (fileType === 'ps1') {
                content = [
                    '# PowerShell Module',
                    'function Get-MyFunction {',
                    '    [CmdletBinding()]',
                    '    param(',
                    '        [Parameter(Mandatory=$true)]',
                    '        [string]$InputParameter',
                    '    )',
                    '    ',
                    '    # Your code here',
                    '    Write-Host "Processing $InputParameter"',
                    '}',
                    '',
                    'Export-ModuleMember -Function Get-MyFunction',
                    ''
                ].join('\n');
                language = 'powershell';
            } else {
                content = [
                    '@echo off',
                    'REM Batch Module (Subroutine)',
                    'goto :eof',
                    '',
                    ':MyFunction',
                    'REM Your code here',
                    'echo Processing %1',
                    'goto :eof',
                    ''
                ].join('\n');
                language = 'batch';
            }
            break;
    }
    
    // Add file to project
    projectFiles[fullFileName] = {
        content: content,
        language: language
    };
    
    // Update editor with new content
    editor.setValue(content);
    currentFileName = fullFileName;
    
    // Update sidebar
    updateSidebar();
    
    // Close modal
    document.getElementById('newFileModal').style.display = 'none';
    
    // Reset form
    document.getElementById('fileName').value = '';
    document.getElementById('fileType').value = 'ps1';
    document.getElementById('template').value = 'empty';
    
    // Update status bar
    updateStatusBar();
    
    // Update editor tab
    updateEditorTab(fullFileName);
}

// Create project from template
function createProjectFromTemplate(templateName) {
    // Clear existing project files
    projectFiles = {};
    
    // Add template files based on project type
    switch (templateName) {
        case 'cli-app':
            projectFiles['main.ps1'] = {
                content: [
                    '# CLI PowerShell Application',
                    'param(',
                    '    [string]$Action,',
                    '    [string]$Target',
                    ')',
                    '',
                    'function Show-Usage {',
                    '    Write-Host "CLI PowerShell Application Template"',
                    '    Write-Host "Usage: .\\main.ps1 -Action [action] -Target [target]"',
                    '    Write-Host "Actions: get, set, remove"',
                    '}',
                    '',
                    'if (-not $Action) {',
                    '    Show-Usage',
                    '    exit',
                    '}',
                    '',
                    'switch ($Action) {',
                    '    "get" {',
                    '        Write-Host "Getting information from $Target"',
                    '        # Add your get logic here',
                    '    }',
                    '    "set" {',
                    '        Write-Host "Setting information for $Target"',
                    '        # Add your set logic here',
                    '    }',
                    '    "remove" {',
                    '        Write-Host "Removing $Target"',
                    '        # Add your remove logic here',
                    '    }',
                    '    default {',
                    '        Show-Usage',
                    '    }',
                    '}',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            break;
            
        case 'gui-app':
            projectFiles['main.ps1'] = {
                content: [
                    '# GUI PowerShell Application',
                    'Add-Type -AssemblyName System.Windows.Forms',
                    '',
                    '# Create form',
                    '$form = New-Object System.Windows.Forms.Form',
                    '$form.Text = "My Application"',
                    '$form.Size = New-Object System.Drawing.Size(500,400)',
                    '$form.StartPosition = "CenterScreen"',
                    '$form.BackColor = "White"',
                    '',
                    '# Create label',
                    '$label = New-Object System.Windows.Forms.Label',
                    '$label.Text = "Welcome to PowerShell GUI App"',
                    '$label.Location = New-Object System.Drawing.Point(20,20)',
                    '$label.Size = New-Object System.Drawing.Size(400,20)',
                    '$label.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)',
                    '$form.Controls.Add($label)',
                    '',
                    '# Create button',
                    '$button = New-Object System.Windows.Forms.Button',
                    '$button.Text = "Click Me"',
                    '$button.Location = New-Object System.Drawing.Point(200,100)',
                    '$button.Size = New-Object System.Drawing.Size(100,30)',
                    '$button.BackColor = "LightBlue"',
                    '$button.FlatStyle = "Flat"',
                    '$button.Add_Click({',
                    '    [System.Windows.Forms.MessageBox]::Show("Hello from PowerShell GUI!", "Message")',
                    '})',
                    '$form.Controls.Add($button)',
                    '',
                    '# Create textbox',
                    '$textbox = New-Object System.Windows.Forms.TextBox',
                    '$textbox.Location = New-Object System.Drawing.Point(20,150)',
                    '$textbox.Size = New-Object System.Drawing.Size(450,20)',
                    '$textbox.Text = "Enter text here"',
                    '$form.Controls.Add($textbox)',
                    '',
                    '# Show form',
                    '$form.ShowDialog() | Out-Null',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            break;
            
        case 'batch-utility':
            projectFiles['utility.bat'] = {
                content: [
                    '@echo off',
                    'REM Batch Utility Script',
                    'REM This template provides common batch utility functions',
                    '',
                    ':menu',
                    'cls',
                    'echo ================================',
                    'echo     Batch Utility Menu',
                    'echo ================================',
                    'echo 1. List files in directory',
                    'echo 2. Create backup of file',
                    'echo 3. Show system information',
                    'echo 4. Exit',
                    'echo ================================',
                    'set /p choice="Enter choice: "',
                    '',
                    'if "%choice%"=="1" goto list_files',
                    'if "%choice%"=="2" goto backup_file',
                    'if "%choice%"=="3" goto system_info',
                    'if "%choice%"=="4" goto exit',
                    'goto menu',
                    '',
                    ':list_files',
                    'echo Listing files in current directory:',
                    'dir',
                    'pause',
                    'goto menu',
                    '',
                    ':backup_file',
                    'set /p filename="Enter filename to backup: "',
                    'if exist "%filename%" (',
                    '    copy "%filename%" "%filename%.bak"',
                    '    echo Backup created as %filename%.bak',
                    ') else (',
                    '    echo File not found!',
                    ')',
                    'pause',
                    'goto menu',
                    '',
                    ':system_info',
                    'echo System Information:',
                    'systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"System Type"',
                    'pause',
                    'goto menu',
                    '',
                    ':exit',
                    'echo Exiting utility...',
                    'exit /b',
                    ''
                ].join('\n'),
                language: 'batch'
            };
            break;
            
        case 'module-project':
            projectFiles['MyModule.psm1'] = {
                content: [
                    '# My PowerShell Module',
                    '',
                    'function Get-MyData {',
                    '    [CmdletBinding()]',
                    '    param(',
                    '        [Parameter(Mandatory=$true)]',
                    '        [string]$InputParameter',
                    '    )',
                    '    ',
                    '    Write-Host "Getting data for $InputParameter"',
                    '    # Add your logic here',
                    '}',
                    '',
                    'function Set-MyData {',
                    '    [CmdletBinding()]',
                    '    param(',
                    '        [Parameter(Mandatory=$true)]',
                    '        [string]$InputParameter',
                    '    )',
                    '    ',
                    '    Write-Host "Setting data for $InputParameter"',
                    '    # Add your logic here',
                    '}',
                    '',
                    'Export-ModuleMember -Function Get-MyData, Set-MyData',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            
            projectFiles['MyModule.psd1'] = {
                content: [
                    '@{',
                    '    ModuleToProcess = "MyModule.psm1"',
                    '    ModuleVersion = "1.0.0"',
                    '    GUID = "12345678-1234-1234-1234-123456789012"',
                    '    Author = "Your Name"',
                    '    CompanyName = "Your Company"',
                    '    Copyright = "(c) 2025 Your Name. All rights reserved."',
                    '    Description = "A sample PowerShell module"',
                    '    PowerShellVersion = "5.1"',
                    '    FunctionsToExport = @("Get-MyData", "Set-MyData")',
                    '    CmdletsToExport = @()',
                    '    VariablesToExport = @()',
                    '    AliasesToExport = @()',
                    '}',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            break;
            
        default:
            // Create a simple default file
            projectFiles['script.ps1'] = {
                content: '# PowerShell Script\nWrite-Host "Hello, World!"\n',
                language: 'powershell'
            };
    }
    
    // Update sidebar
    updateSidebar();
    
    // Load first file in editor
    const firstFile = Object.keys(projectFiles)[0];
    if (firstFile) {
        currentFileName = firstFile;
        editor.setValue(projectFiles[firstFile].content);
        currentLanguage = projectFiles[firstFile].language;
        monaco.editor.setModelLanguage(editor.getModel(), currentLanguage);
        document.querySelector('.status-bar div:first-child').innerHTML = 
            currentLanguage === 'powershell' ? 
            '<i class="fas fa-code"></i> PowerShell Mode' : 
            '<i class="fas fa-code"></i> Batch Mode';
    }
    
    // Show creation confirmation
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Project template '${templateName}' created successfully\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Update editor tab
function updateEditorTab(fileName) {
    const tabs = document.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
        if (tab.textContent === fileName) {
            switchEditorTab(tab);
        }
    });
}

// Update sidebar with project files
function updateSidebar() {
    const sidebarContent = document.querySelector('.sidebar-content');
    
    // Clear current sidebar content except project folder
    while (sidebarContent.children.length > 1) {
        sidebarContent.removeChild(sidebarContent.lastChild);
    }
    
    // Add files to sidebar
    for (const fileName in projectFiles) {
        const fileItem = document.createElement('div');
        fileItem.className = 'sidebar-item';
        fileItem.innerHTML = '<i class="fas fa-file-code"></i> <span>' + fileName + '</span>';
        fileItem.addEventListener('click', function() {
            selectSidebarItem(this, fileName);
        });
        sidebarContent.appendChild(fileItem);
    }
}

// Save file
function saveFile() {
    // Get current content from editor
    const content = editor.getValue();
    
    // Update project file
    if (projectFiles[currentFileName]) {
        projectFiles[currentFileName].content = content;
    } else {
        // Create new file entry
        projectFiles[currentFileName] = {
            content: content,
            language: currentLanguage
        };
    }
    
    // Show save confirmation
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> File ${currentFileName} saved successfully\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Open file
function openFile() {
    // In a real implementation, this would open a file dialog
    // For this demo, we'll just show a message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Open file dialog would appear here\n`;
    outputContent.innerHTML += `> Select a .ps1 or .cmd/.bat file to open\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Run script
function runScript() {
    const outputContent = document.querySelector('.output-content');
    const scriptContent = editor.getValue();
    
    // Add execution message to output
    outputContent.innerHTML += `\n\n> Executing script...\n`;
    outputContent.innerHTML += `> Script content:\n${scriptContent}\n`;
    outputContent.innerHTML += `\n> Script executed successfully (simulated output)\n`;
    outputContent.innerHTML += `Hello from PowerShell/Batch Visual IDE!\n`;
    outputContent.innerHTML += `Execution completed at ${new Date().toLocaleTimeString()}\n`;
    
    // Scroll to bottom of output
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Debug script
function debugScript() {
    const outputContent = document.querySelector('.output-content');
    const scriptContent = editor.getValue();
    
    // Check if it's a PowerShell script
    if (currentLanguage !== 'powershell') {
        outputContent.innerHTML += `\n\n> Debugging is only available for PowerShell scripts\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
        return;
    }
    
    // Load debugger script if not already loaded
    if (typeof initializeDebugger !== 'function') {
        const debuggerScript = document.createElement('script');
        debuggerScript.src = 'debugger.js';
        debuggerScript.onload = function() {
            // Initialize and start debugger after script is loaded
            initializeDebugger();
            startDebug();
        };
        document.head.appendChild(debuggerScript);
    } else {
        // Debugger script already loaded, just start debugging
        startDebug();
    }
    
    // Add debugging message to output
    outputContent.innerHTML += `\n\n> Initializing debugger...\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Stop script
function stopScript() {
    const outputContent = document.querySelector('.output-content');
    
    // Add stop message to output
    outputContent.innerHTML += `\n\n> Stopping script execution...\n`;
    outputContent.innerHTML += `> Script execution stopped\n`;
    
    // Scroll to bottom of output
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Clear output
function clearOutput() {
    document.querySelector('.output-content').innerHTML = '';
}

// Open Module Manager
function openModuleManager() {
    document.getElementById('moduleManagerModal').style.display = 'flex';
    
    // Add event listeners to import buttons
    document.querySelectorAll('.module-item .btn').forEach(button => {
        button.addEventListener('click', function() {
            importModule(this);
        });
    });
}

// Import module into current script
function importModule(button) {
    const moduleItem = button.closest('.module-item');
    const moduleName = moduleItem.querySelector('h5').textContent;
    
    // Get current content from editor
    const content = editor.getValue();
    
    // Add import statement at the beginning of the script
    const importStatement = `Import-Module ${moduleName}\n`;
    const newContent = importStatement + content;
    
    // Update editor
    editor.setValue(newContent);
    
    // Show import confirmation
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Module ${moduleName} imported successfully\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
    
    // Close modal
    document.getElementById('moduleManagerModal').style.display = 'none';
}

// Select sidebar item
function selectSidebarItem(item, fileName) {
    // Remove active class from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(i => {
        i.classList.remove('active');
    });
    
    // Add active class to selected item
    item.classList.add('active');
    
    // If it's a file, load it in the editor
    if (item.querySelector('i').classList.contains('fa-file-code')) {
        // Use fileName parameter if provided, otherwise extract from item
        const fileToLoad = fileName || item.querySelector('span').textContent;
        currentFileName = fileToLoad;
        
        // Load file content in editor
        if (projectFiles[fileToLoad]) {
            editor.setValue(projectFiles[fileToLoad].content);
            
            // Switch language mode
            if (fileToLoad.includes('.ps1')) {
                currentLanguage = 'powershell';
                monaco.editor.setModelLanguage(editor.getModel(), 'powershell');
                document.querySelector('.status-bar div:first-child').innerHTML = '<i class="fas fa-code"></i> PowerShell Mode';
            } else if (fileToLoad.includes('.cmd') || fileToLoad.includes('.bat')) {
                currentLanguage = 'batch';
                monaco.editor.setModelLanguage(editor.getModel(), 'batch');
                document.querySelector('.status-bar div:first-child').innerHTML = '<i class="fas fa-code"></i> Batch Mode';
            }
        }
    }
}

// Select GUI component
function selectGuiComponent(component) {
    const componentName = component.getAttribute('data-component');
    
    // Add component to editor at cursor position
    const editorContent = editor.getValue();
    let newContent = editorContent;
    
    switch (componentName) {
        case 'window':
            newContent += '\n# Window Component\n$form = New-Object System.Windows.Forms.Form\n';
            break;
        case 'button':
            newContent += '\n# Button Component\n$button = New-Object System.Windows.Forms.Button\n';
            break;
        case 'textbox':
            newContent += '\n# TextBox Component\n$textbox = New-Object System.Windows.Forms.TextBox\n';
            break;
        case 'label':
            newContent += '\n# Label Component\n$label = New-Object System.Windows.Forms.Label\n';
            break;
        case 'checkbox':
            newContent += '\n# CheckBox Component\n$checkbox = New-Object System.Windows.Forms.CheckBox\n';
            break;
        case 'listbox':
            newContent += '\n# ListBox Component\n$listbox = New-Object System.Windows.Forms.ListBox\n';
            break;
        case 'combobox':
            newContent += '\n# ComboBox Component\n$combobox = New-Object System.Windows.Forms.ComboBox\n';
            break;
        case 'datagrid':
            newContent += '\n# DataGrid Component\n$datagrid = New-Object System.Windows.Forms.DataGridView\n';
            break;
    }
    
    editor.setValue(newContent);
}

// Open GUI Builder
function openGuiBuilder() {
    // Create a new GUI script if one doesn't exist
    if (!projectFiles['gui_app.ps1']) {
        projectFiles['gui_app.ps1'] = {
            content: [
                '# PowerShell GUI Application',
                'Add-Type -AssemblyName System.Windows.Forms',
                'Add-Type -AssemblyName System.Drawing',
                '',
                '# Create form',
                '$form = New-Object System.Windows.Forms.Form',
                '$form.Text = "My Application"',
                '$form.Size = New-Object System.Drawing.Size(500,400)',
                '$form.StartPosition = "CenterScreen"',
                '$form.BackColor = "#FFFFFF"',
                '$form.Font = New-Object System.Drawing.Font("Segoe UI", 9)',
                '',
                '# Show form',
                '$form.ShowDialog() | Out-Null',
                ''
            ].join('\n'),
            language: 'powershell'
        };
        
        // Update sidebar
        updateSidebar();
    }
    
    // Load the GUI script in the editor
    currentFileName = 'gui_app.ps1';
    editor.setValue(projectFiles['gui_app.ps1'].content);
    currentLanguage = 'powershell';
    monaco.editor.setModelLanguage(editor.getModel(), 'powershell');
    document.querySelector('.status-bar div:first-child').innerHTML = '<i class="fas fa-code"></i> PowerShell Mode';
    
    // Load GUI Builder script if not already loaded
    if (typeof initializeGuiBuilder !== 'function') {
        const guiBuilderScript = document.createElement('script');
        guiBuilderScript.src = 'gui-builder.js';
        guiBuilderScript.onload = function() {
            // Initialize and show GUI Builder after script is loaded
            initializeGuiBuilder();
            toggleGuiBuilder();
            
            // Show message in output
            const outputContent = document.querySelector('.output-content');
            outputContent.innerHTML += `\n> Advanced GUI Builder activated\n`;
            outputContent.innerHTML += `> Visual designer loaded for gui_app.ps1\n`;
            outputContent.innerHTML += `> Drag components from the toolbox to the canvas\n`;
            outputContent.innerHTML += `> Modify properties in the property panel\n`;
            outputContent.scrollTop = outputContent.scrollHeight;
        };
        document.head.appendChild(guiBuilderScript);
    } else {
        // GUI Builder script already loaded, just toggle it
        toggleGuiBuilder();
        
        // Show message in output
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `\n> Advanced GUI Builder activated\n`;
        outputContent.innerHTML += `> Visual designer loaded for gui_app.ps1\n`;
        outputContent.innerHTML += `> Drag components from the toolbox to the canvas\n`;
        outputContent.innerHTML += `> Modify properties in the property panel\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
    }
}

// Create project from selected template
function createProject() {
    // Get selected template
    const selectedTemplate = document.querySelector('.template-item[style*="border-color"]');
    if (!selectedTemplate) {
        alert('Please select a template');
        return;
    }
    
    const templateName = selectedTemplate.getAttribute('data-template');
    
    // Clear existing project files
    projectFiles = {};
    
    // Add template files based on project type
    switch (templateName) {
        case 'cli-app':
            projectFiles['main.ps1'] = {
                content: [
                    '# CLI PowerShell Application',
                    'param(',
                    '    [string]$Action,',
                    '    [string]$Target',
                    ')',
                    '',
                    'function Show-Usage {',
                    '    Write-Host "CLI PowerShell Application Template"',
                    '    Write-Host "Usage: .\\main.ps1 -Action [action] -Target [target]"',
                    '    Write-Host "Actions: get, set, remove"',
                    '}',
                    '',
                    'if (-not $Action) {',
                    '    Show-Usage',
                    '    exit',
                    '}',
                    '',
                    'switch ($Action) {',
                    '    "get" {',
                    '        Write-Host "Getting information from $Target"',
                    '        # Add your get logic here',
                    '    }',
                    '    "set" {',
                    '        Write-Host "Setting information for $Target"',
                    '        # Add your set logic here',
                    '    }',
                    '    "remove" {',
                    '        Write-Host "Removing $Target"',
                    '        # Add your remove logic here',
                    '    }',
                    '    default {',
                    '        Show-Usage',
                    '    }',
                    '}',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            break;
            
        case 'gui-app':
            projectFiles['main.ps1'] = {
                content: [
                    '# GUI PowerShell Application',
                    'Add-Type -AssemblyName System.Windows.Forms',
                    '',
                    '# Create form',
                    '$form = New-Object System.Windows.Forms.Form',
                    '$form.Text = "My Application"',
                    '$form.Size = New-Object System.Drawing.Size(500,400)',
                    '$form.StartPosition = "CenterScreen"',
                    '$form.BackColor = "White"',
                    '',
                    '# Create label',
                    '$label = New-Object System.Windows.Forms.Label',
                    '$label.Text = "Welcome to PowerShell GUI App"',
                    '$label.Location = New-Object System.Drawing.Point(20,20)',
                    '$label.Size = New-Object System.Drawing.Size(400,20)',
                    '$label.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)',
                    '$form.Controls.Add($label)',
                    '',
                    '# Create button',
                    '$button = New-Object System.Windows.Forms.Button',
                    '$button.Text = "Click Me"',
                    '$button.Location = New-Object System.Drawing.Point(200,100)',
                    '$button.Size = New-Object System.Drawing.Size(100,30)',
                    '$button.BackColor = "LightBlue"',
                    '$button.FlatStyle = "Flat"',
                    '$button.Add_Click({',
                    '    [System.Windows.Forms.MessageBox]::Show("Hello from PowerShell GUI!", "Message")',
                    '})',
                    '$form.Controls.Add($button)',
                    '',
                    '# Create textbox',
                    '$textbox = New-Object System.Windows.Forms.TextBox',
                    '$textbox.Location = New-Object System.Drawing.Point(20,150)',
                    '$textbox.Size = New-Object System.Drawing.Size(450,20)',
                    '$textbox.Text = "Enter text here"',
                    '$form.Controls.Add($textbox)',
                    '',
                    '# Show form',
                    '$form.ShowDialog() | Out-Null',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            break;
            
        case 'batch-utility':
            projectFiles['utility.bat'] = {
                content: [
                    '@echo off',
                    'REM Batch Utility Script',
                    'REM This template provides common batch utility functions',
                    '',
                    ':menu',
                    'cls',
                    'echo ================================',
                    'echo     Batch Utility Menu',
                    'echo ================================',
                    'echo 1. List files in directory',
                    'echo 2. Create backup of file',
                    'echo 3. Show system information',
                    'echo 4. Exit',
                    'echo ================================',
                    'set /p choice="Enter choice: "',
                    '',
                    'if "%choice%"=="1" goto list_files',
                    'if "%choice%"=="2" goto backup_file',
                    'if "%choice%"=="3" goto system_info',
                    'if "%choice%"=="4" goto exit',
                    'goto menu',
                    '',
                    ':list_files',
                    'echo Listing files in current directory:',
                    'dir',
                    'pause',
                    'goto menu',
                    '',
                    ':backup_file',
                    'set /p filename="Enter filename to backup: "',
                    'if exist "%filename%" (',
                    '    copy "%filename%" "%filename%.bak"',
                    '    echo Backup created as %filename%.bak',
                    ') else (',
                    '    echo File not found!',
                    ')',
                    'pause',
                    'goto menu',
                    '',
                    ':system_info',
                    'echo System Information:',
                    'systeminfo | findstr /C:"OS Name" /C:"OS Version" /C:"System Type"',
                    'pause',
                    'goto menu',
                    '',
                    ':exit',
                    'echo Exiting utility...',
                    'exit /b',
                    ''
                ].join('\n'),
                language: 'batch'
            };
            break;
            
        case 'module-project':
            projectFiles['MyModule.psm1'] = {
                content: [
                    '# My PowerShell Module',
                    '',
                    'function Get-MyData {',
                    '    [CmdletBinding()]',
                    '    param(',
                    '        [Parameter(Mandatory=$true)]',
                    '        [string]$InputParameter',
                    '    )',
                    '    ',
                    '    Write-Host "Getting data for $InputParameter"',
                    '    # Add your logic here',
                    '}',
                    '',
                    'function Set-MyData {',
                    '    [CmdletBinding()]',
                    '    param(',
                    '        [Parameter(Mandatory=$true)]',
                    '        [string]$InputParameter',
                    '    )',
                    '    ',
                    '    Write-Host "Setting data for $InputParameter"',
                    '    # Add your logic here',
                    '}',
                    '',
                    'Export-ModuleMember -Function Get-MyData, Set-MyData',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            
            projectFiles['MyModule.psd1'] = {
                content: [
                    '@{',
                    '    ModuleToProcess = "MyModule.psm1"',
                    '    ModuleVersion = "1.0.0"',
                    '    GUID = "12345678-1234-1234-1234-123456789012"',
                    '    Author = "Your Name"',
                    '    CompanyName = "Your Company"',
                    '    Copyright = "(c) 2025 Your Name. All rights reserved."',
                    '    Description = "A sample PowerShell module"',
                    '    PowerShellVersion = "5.1"',
                    '    FunctionsToExport = @("Get-MyData", "Set-MyData")',
                    '    CmdletsToExport = @()',
                    '    VariablesToExport = @()',
                    '    AliasesToExport = @()',
                    '}',
                    ''
                ].join('\n'),
                language: 'powershell'
            };
            break;
            
        default:
            // Create a simple default file
            projectFiles['script.ps1'] = {
                content: '# PowerShell Script\nWrite-Host "Hello, World!"\n',
                language: 'powershell'
            };
    }
    
    // Update sidebar
    updateSidebar();
    
    // Load first file in editor
    const firstFile = Object.keys(projectFiles)[0];
    if (firstFile) {
        currentFileName = firstFile;
        editor.setValue(projectFiles[firstFile].content);
        currentLanguage = projectFiles[firstFile].language;
        monaco.editor.setModelLanguage(editor.getModel(), currentLanguage);
        document.querySelector('.status-bar div:first-child').innerHTML = 
            currentLanguage === 'powershell' ? 
            '<i class="fas fa-code"></i> PowerShell Mode' : 
            '<i class="fas fa-code"></i> Batch Mode';
    }
    
    // Close modal
    document.getElementById('newProjectModal').style.display = 'none';
    
    // Show creation confirmation
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Project template '${templateName}' created successfully\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Update status bar with current line/column
function updateStatusBar() {
    editor.onDidChangeCursorPosition(function(e) {
        const position = e.position;
        document.querySelector('.status-bar div:last-child').innerHTML = 
            `<i class="fas fa-code-branch"></i> Line ${position.lineNumber}, Column ${position.column}`;
    });
}