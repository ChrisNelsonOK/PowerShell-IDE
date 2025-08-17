// PowerShell/Batch Visual IDE - Enhanced Debugging System

// Debugging state
let debuggerActive = false;
let currentBreakpoints = [];
let currentLine = 0;
let debugVariables = {};
let debugCallStack = [];
let debugStepMode = 'none'; // none, over, into, out

// Initialize debugger
function initializeDebugger() {
    // Create debugger UI
    createDebuggerUI();
    
    // Set up editor for debugging
    setupEditorForDebugging();
}

// Create debugger UI
function createDebuggerUI() {
    // Create debugger container
    const debuggerContainer = document.createElement('div');
    debuggerContainer.id = 'debugger-container';
    debuggerContainer.className = 'debugger-container';
    
    // Create debugger toolbar
    const debuggerToolbar = document.createElement('div');
    debuggerToolbar.className = 'debugger-toolbar';
    debuggerToolbar.innerHTML = `
        <button id="debug-continue" class="debug-button" title="Continue (F5)">
            <i class="fas fa-play"></i>
        </button>
        <button id="debug-pause" class="debug-button" title="Pause">
            <i class="fas fa-pause"></i>
        </button>
        <button id="debug-step-over" class="debug-button" title="Step Over (F10)">
            <i class="fas fa-arrow-right"></i>
        </button>
        <button id="debug-step-into" class="debug-button" title="Step Into (F11)">
            <i class="fas fa-arrow-down"></i>
        </button>
        <button id="debug-step-out" class="debug-button" title="Step Out (Shift+F11)">
            <i class="fas fa-arrow-up"></i>
        </button>
        <button id="debug-restart" class="debug-button" title="Restart">
            <i class="fas fa-redo"></i>
        </button>
        <button id="debug-stop" class="debug-button" title="Stop (Shift+F5)">
            <i class="fas fa-stop"></i>
        </button>
    `;
    
    // Create debugger panels
    const debuggerPanels = document.createElement('div');
    debuggerPanels.className = 'debugger-panels';
    
    // Create variables panel
    const variablesPanel = document.createElement('div');
    variablesPanel.className = 'debugger-panel';
    variablesPanel.innerHTML = `
        <div class="panel-header">
            <h3>Variables</h3>
        </div>
        <div id="variables-content" class="panel-content">
            <table class="variables-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody id="variables-list">
                    <tr>
                        <td colspan="3" class="empty-message">No variables to display</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Create call stack panel
    const callStackPanel = document.createElement('div');
    callStackPanel.className = 'debugger-panel';
    callStackPanel.innerHTML = `
        <div class="panel-header">
            <h3>Call Stack</h3>
        </div>
        <div id="call-stack-content" class="panel-content">
            <table class="call-stack-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Line</th>
                        <th>File</th>
                    </tr>
                </thead>
                <tbody id="call-stack-list">
                    <tr>
                        <td colspan="3" class="empty-message">No call stack to display</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Create breakpoints panel
    const breakpointsPanel = document.createElement('div');
    breakpointsPanel.className = 'debugger-panel';
    breakpointsPanel.innerHTML = `
        <div class="panel-header">
            <h3>Breakpoints</h3>
        </div>
        <div id="breakpoints-content" class="panel-content">
            <table class="breakpoints-table">
                <thead>
                    <tr>
                        <th>Line</th>
                        <th>File</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="breakpoints-list">
                    <tr>
                        <td colspan="3" class="empty-message">No breakpoints set</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Add panels to debugger panels container
    debuggerPanels.appendChild(variablesPanel);
    debuggerPanels.appendChild(callStackPanel);
    debuggerPanels.appendChild(breakpointsPanel);
    
    // Add toolbar and panels to debugger container
    debuggerContainer.appendChild(debuggerToolbar);
    debuggerContainer.appendChild(debuggerPanels);
    
    // Add debugger container to output panel
    const outputPanel = document.querySelector('.output-panel');
    outputPanel.appendChild(debuggerContainer);
    
    // Hide debugger container initially
    debuggerContainer.style.display = 'none';
    
    // Add event listeners for debugger buttons
    document.getElementById('debug-continue').addEventListener('click', continueDebug);
    document.getElementById('debug-pause').addEventListener('click', pauseDebug);
    document.getElementById('debug-step-over').addEventListener('click', stepOverDebug);
    document.getElementById('debug-step-into').addEventListener('click', stepIntoDebug);
    document.getElementById('debug-step-out').addEventListener('click', stepOutDebug);
    document.getElementById('debug-restart').addEventListener('click', restartDebug);
    document.getElementById('debug-stop').addEventListener('click', stopDebug);
}

// Set up editor for debugging
function setupEditorForDebugging() {
    // Add gutter for breakpoints
    editor.updateOptions({
        glyphMargin: true
    });
    
    // Add event listener for setting breakpoints
    editor.onMouseDown(function(e) {
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
            toggleBreakpoint(e.target.position.lineNumber);
        }
    });
    
    // Add keyboard shortcuts for debugging
    editor.addCommand(monaco.KeyCode.F5, startDebug);
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.F5, stopDebug);
    editor.addCommand(monaco.KeyCode.F10, stepOverDebug);
    editor.addCommand(monaco.KeyCode.F11, stepIntoDebug);
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.F11, stepOutDebug);
}

// Toggle breakpoint at line
function toggleBreakpoint(lineNumber) {
    const model = editor.getModel();
    const breakpointIndex = currentBreakpoints.findIndex(bp => bp.lineNumber === lineNumber);
    
    if (breakpointIndex === -1) {
        // Add breakpoint
        currentBreakpoints.push({
            id: Date.now(),
            lineNumber: lineNumber,
            fileName: currentFileName,
            enabled: true
        });
        
        // Add breakpoint decoration
        const decorations = editor.deltaDecorations([], [
            {
                range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                options: {
                    isWholeLine: false,
                    glyphMarginClassName: 'breakpoint-glyph'
                }
            }
        ]);
        
        // Store decoration ID with breakpoint
        currentBreakpoints[currentBreakpoints.length - 1].decorationId = decorations[0];
    } else {
        // Remove breakpoint
        const breakpoint = currentBreakpoints[breakpointIndex];
        editor.deltaDecorations([breakpoint.decorationId], []);
        currentBreakpoints.splice(breakpointIndex, 1);
    }
    
    // Update breakpoints list
    updateBreakpointsList();
}

// Update breakpoints list in UI
function updateBreakpointsList() {
    const breakpointsList = document.getElementById('breakpoints-list');
    
    if (currentBreakpoints.length === 0) {
        breakpointsList.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">No breakpoints set</td>
            </tr>
        `;
        return;
    }
    
    breakpointsList.innerHTML = currentBreakpoints.map(bp => `
        <tr>
            <td>${bp.lineNumber}</td>
            <td>${bp.fileName}</td>
            <td>
                <button class="small-button" onclick="toggleBreakpointEnabled(${bp.id})">
                    <i class="fas fa-${bp.enabled ? 'check-circle' : 'circle'}"></i>
                </button>
                <button class="small-button" onclick="removeBreakpoint(${bp.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Toggle breakpoint enabled state
function toggleBreakpointEnabled(breakpointId) {
    const breakpoint = currentBreakpoints.find(bp => bp.id === breakpointId);
    if (breakpoint) {
        breakpoint.enabled = !breakpoint.enabled;
        
        // Update breakpoint decoration
        editor.deltaDecorations([breakpoint.decorationId], [
            {
                range: new monaco.Range(breakpoint.lineNumber, 1, breakpoint.lineNumber, 1),
                options: {
                    isWholeLine: false,
                    glyphMarginClassName: breakpoint.enabled ? 'breakpoint-glyph' : 'breakpoint-disabled-glyph'
                }
            }
        ]);
        
        // Update breakpoints list
        updateBreakpointsList();
    }
}

// Remove breakpoint
function removeBreakpoint(breakpointId) {
    const breakpointIndex = currentBreakpoints.findIndex(bp => bp.id === breakpointId);
    if (breakpointIndex !== -1) {
        const breakpoint = currentBreakpoints[breakpointIndex];
        editor.deltaDecorations([breakpoint.decorationId], []);
        currentBreakpoints.splice(breakpointIndex, 1);
        
        // Update breakpoints list
        updateBreakpointsList();
    }
}

// Start debugging
function startDebug() {
    if (debuggerActive) return;
    
    // Check if we're in PowerShell mode
    if (currentLanguage !== 'powershell') {
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `\n\n> Debugging is only available for PowerShell scripts\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
        return;
    }
    
    // Show debugger container
    document.getElementById('debugger-container').style.display = 'flex';
    
    // Set debugger active flag
    debuggerActive = true;
    
    // Reset debug state
    currentLine = 1;
    debugVariables = {};
    debugCallStack = [];
    
    // Add initial variables for simulation
    debugVariables = {
        '$PSVersionTable': {
            value: {
                'PSVersion': '7.3.0',
                'PSEdition': 'Core',
                'GitCommitId': '7.3.0',
                'OS': 'Microsoft Windows 10.0.19044',
                'Platform': 'Win32NT',
                'PSCompatibleVersions': ['1.0', '2.0', '3.0', '4.0', '5.0', '5.1', '6.0', '7.0', '7.3'],
                'PSRemotingProtocolVersion': '2.3',
                'SerializationVersion': '1.1.0.1',
                'WSManStackVersion': '3.0'
            },
            type: 'System.Management.Automation.PSVersionTable'
        },
        '$PWD': {
            value: 'C:\\Users\\User\\Documents',
            type: 'System.Management.Automation.PathInfo'
        },
        '$Host': {
            value: 'PowerShell Visual IDE Host',
            type: 'System.Management.Automation.Internal.Host.InternalHost'
        }
    };
    
    // Add initial call stack
    debugCallStack = [
        {
            name: 'Global scope',
            line: 1,
            file: currentFileName
        }
    ];
    
    // Update UI
    updateVariablesList();
    updateCallStackList();
    
    // Add current line decoration
    highlightCurrentLine();
    
    // Show debug started message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n\n> Debugging started\n`;
    outputContent.innerHTML += `> Script: ${currentFileName}\n`;
    outputContent.innerHTML += `> Breakpoints: ${currentBreakpoints.length}\n`;
    outputContent.innerHTML += `> Use the debug controls to navigate through the script\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Continue debug execution
function continueDebug() {
    if (!debuggerActive) return;
    
    // Find next breakpoint
    const nextBreakpoint = currentBreakpoints
        .filter(bp => bp.enabled && bp.lineNumber > currentLine)
        .sort((a, b) => a.lineNumber - b.lineNumber)[0];
    
    if (nextBreakpoint) {
        // Move to next breakpoint
        currentLine = nextBreakpoint.lineNumber;
        
        // Simulate variable changes
        simulateVariableChanges();
        
        // Update UI
        highlightCurrentLine();
        updateVariablesList();
        updateCallStackList();
        
        // Show debug continued message
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `> Execution continued to line ${currentLine}\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
    } else {
        // No more breakpoints, finish debugging
        finishDebug();
    }
}

// Pause debug execution
function pauseDebug() {
    if (!debuggerActive) return;
    
    // Show debug paused message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `> Execution paused at line ${currentLine}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Step over in debug
function stepOverDebug() {
    if (!debuggerActive) return;
    
    // Move to next line
    currentLine++;
    
    // Simulate variable changes
    simulateVariableChanges();
    
    // Update UI
    highlightCurrentLine();
    updateVariablesList();
    updateCallStackList();
    
    // Show debug step over message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `> Stepped over to line ${currentLine}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
    
    // Check if we've reached the end of the script
    const model = editor.getModel();
    if (currentLine > model.getLineCount()) {
        finishDebug();
    }
}

// Step into in debug
function stepIntoDebug() {
    if (!debuggerActive) return;
    
    // Check if current line contains a function call
    const model = editor.getModel();
    const lineContent = model.getLineContent(currentLine);
    
    if (lineContent.match(/\w+\-\w+/)) {
        // Simulate stepping into a function
        debugCallStack.unshift({
            name: lineContent.match(/(\w+\-\w+)/)[1],
            line: currentLine,
            file: currentFileName
        });
        
        // Move to first line of "function"
        currentLine++;
        
        // Simulate variable changes
        simulateVariableChanges();
        
        // Update UI
        highlightCurrentLine();
        updateVariablesList();
        updateCallStackList();
        
        // Show debug step into message
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `> Stepped into function at line ${currentLine}\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
    } else {
        // No function call, just step over
        stepOverDebug();
    }
}

// Step out in debug
function stepOutDebug() {
    if (!debuggerActive || debugCallStack.length <= 1) return;
    
    // Remove top call stack entry
    debugCallStack.shift();
    
    // Move to line after the function call
    currentLine = debugCallStack[0].line + 1;
    
    // Simulate variable changes
    simulateVariableChanges();
    
    // Update UI
    highlightCurrentLine();
    updateVariablesList();
    updateCallStackList();
    
    // Show debug step out message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `> Stepped out to line ${currentLine}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Restart debug
function restartDebug() {
    if (!debuggerActive) return;
    
    // Stop current debug session
    stopDebug();
    
    // Start new debug session
    startDebug();
}

// Stop debug
function stopDebug() {
    if (!debuggerActive) return;
    
    // Hide debugger container
    document.getElementById('debugger-container').style.display = 'none';
    
    // Set debugger inactive flag
    debuggerActive = false;
    
    // Remove current line decoration
    editor.deltaDecorations(['current-line-decoration'], []);
    
    // Show debug stopped message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `> Debugging stopped\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Finish debug
function finishDebug() {
    // Show debug finished message
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `> Script execution completed\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
    
    // Stop debugging
    stopDebug();
}

// Highlight current line
function highlightCurrentLine() {
    editor.deltaDecorations(['current-line-decoration'], [
        {
            id: 'current-line-decoration',
            range: new monaco.Range(currentLine, 1, currentLine, 1),
            options: {
                isWholeLine: true,
                className: 'current-line-highlight',
                glyphMarginClassName: 'current-line-glyph'
            }
        }
    ]);
    
    // Reveal the current line
    editor.revealLineInCenter(currentLine);
}

// Update variables list in UI
function updateVariablesList() {
    const variablesList = document.getElementById('variables-list');
    
    if (Object.keys(debugVariables).length === 0) {
        variablesList.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">No variables to display</td>
            </tr>
        `;
        return;
    }
    
    variablesList.innerHTML = Object.entries(debugVariables).map(([name, variable]) => {
        let displayValue = '';
        
        if (typeof variable.value === 'object' && variable.value !== null) {
            displayValue = JSON.stringify(variable.value).substring(0, 50);
            if (JSON.stringify(variable.value).length > 50) {
                displayValue += '...';
            }
        } else {
            displayValue = String(variable.value);
        }
        
        return `
            <tr>
                <td>${name}</td>
                <td>${displayValue}</td>
                <td>${variable.type}</td>
            </tr>
        `;
    }).join('');
}

// Update call stack list in UI
function updateCallStackList() {
    const callStackList = document.getElementById('call-stack-list');
    
    if (debugCallStack.length === 0) {
        callStackList.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">No call stack to display</td>
            </tr>
        `;
        return;
    }
    
    callStackList.innerHTML = debugCallStack.map(frame => `
        <tr>
            <td>${frame.name}</td>
            <td>${frame.line}</td>
            <td>${frame.file}</td>
        </tr>
    `).join('');
}

// Simulate variable changes based on current line
function simulateVariableChanges() {
    const model = editor.getModel();
    const lineContent = model.getLineContent(currentLine);
    
    // Check for variable assignments
    const variableAssignment = lineContent.match(/\$(\w+)\s*=\s*(.+)/);
    if (variableAssignment) {
        const variableName = '$' + variableAssignment[1];
        const variableValue = variableAssignment[2].trim();
        
        // Simulate variable value
        let value;
        let type;
        
        if (variableValue.startsWith('"') && variableValue.endsWith('"')) {
            // String value
            value = variableValue.substring(1, variableValue.length - 1);
            type = 'System.String';
        } else if (variableValue.match(/^\d+$/)) {
            // Integer value
            value = parseInt(variableValue);
            type = 'System.Int32';
        } else if (variableValue.match(/^\d+\.\d+$/)) {
            // Double value
            value = parseFloat(variableValue);
            type = 'System.Double';
        } else if (variableValue === '$true') {
            // Boolean true
            value = true;
            type = 'System.Boolean';
        } else if (variableValue === '$false') {
            // Boolean false
            value = false;
            type = 'System.Boolean';
        } else if (variableValue === '$null') {
            // Null value
            value = null;
            type = 'System.Object';
        } else if (variableValue.startsWith('@(') && variableValue.endsWith(')')) {
            // Array value
            value = variableValue.substring(2, variableValue.length - 1).split(',').map(item => item.trim());
            type = 'System.Array';
        } else if (variableValue.startsWith('@{') && variableValue.endsWith('}')) {
            // Hashtable value
            value = {};
            const hashTableContent = variableValue.substring(2, variableValue.length - 1);
            const entries = hashTableContent.split(';');
            entries.forEach(entry => {
                const keyValue = entry.split('=');
                if (keyValue.length === 2) {
                    value[keyValue[0].trim()] = keyValue[1].trim();
                }
            });
            type = 'System.Collections.Hashtable';
        } else {
            // Default to string
            value = variableValue;
            type = 'System.String';
        }
        
        // Add or update variable
        debugVariables[variableName] = {
            value: value,
            type: type
        };
    }
    
    // Check for New-Object
    const newObjectMatch = lineContent.match(/\$(\w+)\s*=\s*New-Object\s+([^\s]+)/);
    if (newObjectMatch) {
        const variableName = '$' + newObjectMatch[1];
        const objectType = newObjectMatch[2];
        
        // Simulate object creation
        let value;
        let type;
        
        if (objectType === 'System.Windows.Forms.Form') {
            value = {
                Text: 'Form1',
                Size: { Width: 300, Height: 200 },
                StartPosition: 'CenterScreen'
            };
            type = 'System.Windows.Forms.Form';
        } else if (objectType === 'System.Windows.Forms.Button') {
            value = {
                Text: 'Button1',
                Size: { Width: 75, Height: 23 },
                Location: { X: 50, Y: 50 }
            };
            type = 'System.Windows.Forms.Button';
        } else if (objectType === 'System.Windows.Forms.TextBox') {
            value = {
                Text: '',
                Size: { Width: 100, Height: 20 },
                Location: { X: 50, Y: 80 }
            };
            type = 'System.Windows.Forms.TextBox';
        } else {
            value = {};
            type = objectType;
        }
        
        // Add or update variable
        debugVariables[variableName] = {
            value: value,
            type: type
        };
    }
    
    // Check for property assignments
    const propertyAssignment = lineContent.match(/\$(\w+)\.(\w+)\s*=\s*(.+)/);
    if (propertyAssignment) {
        const variableName = '$' + propertyAssignment[1];
        const propertyName = propertyAssignment[2];
        const propertyValue = propertyAssignment[3].trim();
        
        // Check if variable exists
        if (debugVariables[variableName]) {
            // Update property
            if (typeof debugVariables[variableName].value === 'object') {
                // Remove quotes if string
                let value = propertyValue;
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                } else if (value.match(/^\d+$/)) {
                    value = parseInt(value);
                } else if (value.match(/^\d+\.\d+$/)) {
                    value = parseFloat(value);
                }
                
                debugVariables[variableName].value[propertyName] = value;
            }
        }
    }
    
    // Check for method calls
    const methodCall = lineContent.match(/\$(\w+)\.(\w+)\(/);
    if (methodCall) {
        const variableName = '$' + methodCall[1];
        const methodName = methodCall[2];
        
        // Check if variable exists
        if (debugVariables[variableName]) {
            // Simulate method call
            if (methodName === 'Add') {
                // Simulate adding a control to a form
                const controlMatch = lineContent.match(/\$(\w+)\.Add\(\$(\w+)\)/);
                if (controlMatch && debugVariables['$' + controlMatch[2]]) {
                    if (!debugVariables[variableName].value.Controls) {
                        debugVariables[variableName].value.Controls = [];
                    }
                    debugVariables[variableName].value.Controls.push(controlMatch[2]);
                }
            }
        }
    }
}