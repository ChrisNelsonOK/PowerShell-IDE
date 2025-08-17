// PowerShell/Batch Visual IDE - Advanced GUI Builder

// GUI Builder state
let guiBuilderActive = false;
let guiDesignerCanvas = null;
let selectedComponent = null;
let componentCounter = 0;
let formProperties = {
    title: "My Application",
    width: 500,
    height: 400,
    startPosition: "CenterScreen",
    backColor: "#FFFFFF",
    font: "Segoe UI, 9pt"
};

// Component types and their default properties
const componentTypes = {
    form: {
        type: "form",
        icon: "window-maximize",
        displayName: "Form",
        defaultSize: { width: 500, height: 400 },
        properties: {
            name: "form",
            text: "My Application",
            width: 500,
            height: 400,
            startPosition: "CenterScreen",
            backColor: "#FFFFFF",
            font: "Segoe UI, 9pt"
        },
        template: "$form = New-Object System.Windows.Forms.Form\n$form.Text = &quot;{{text}}&quot;\n$form.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n$form.StartPosition = &quot;{{startPosition}}&quot;\n$form.BackColor = &quot;{{backColor}}&quot;\n"
    },
    button: {
        type: "button",
        icon: "square",
        displayName: "Button",
        defaultSize: { width: 100, height: 30 },
        properties: {
            name: "button",
            text: "Button",
            width: 100,
            height: 30,
            location: { x: 50, y: 50 },
            backColor: "#E1E1E1",
            foreColor: "#000000",
            enabled: true,
            visible: true
        },
        template: "${{name}} = New-Object System.Windows.Forms.Button\n${{name}}.Text = &quot;{{text}}&quot;\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n${{name}}.Add_Click({\n    # Add your click event handler code here\n    [System.Windows.Forms.MessageBox]::Show(&quot;Button clicked&quot;, &quot;Event&quot;)\n})\n$form.Controls.Add(${{name}})\n"
    },
    label: {
        type: "label",
        icon: "tag",
        displayName: "Label",
        defaultSize: { width: 150, height: 20 },
        properties: {
            name: "label",
            text: "Label",
            width: 150,
            height: 20,
            location: { x: 50, y: 50 },
            backColor: "Transparent",
            foreColor: "#000000",
            enabled: true,
            visible: true,
            autoSize: true
        },
        template: "${{name}} = New-Object System.Windows.Forms.Label\n${{name}}.Text = &quot;{{text}}&quot;\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n${{name}}.AutoSize = ${{autoSize}}\n$form.Controls.Add(${{name}})\n"
    },
    textbox: {
        type: "textbox",
        icon: "font",
        displayName: "TextBox",
        defaultSize: { width: 200, height: 20 },
        properties: {
            name: "textbox",
            text: "",
            width: 200,
            height: 20,
            location: { x: 50, y: 50 },
            backColor: "#FFFFFF",
            foreColor: "#000000",
            enabled: true,
            visible: true,
            multiline: false,
            passwordChar: "",
            readOnly: false
        },
        template: "${{name}} = New-Object System.Windows.Forms.TextBox\n${{name}}.Text = &quot;{{text}}&quot;\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n${{name}}.Multiline = ${{multiline}}\n{{#passwordChar}}${{name}}.PasswordChar = '{{passwordChar}}'{{/passwordChar}}\n${{name}}.ReadOnly = ${{readOnly}}\n$form.Controls.Add(${{name}})\n"
    },
    checkbox: {
        type: "checkbox",
        icon: "check-square",
        displayName: "CheckBox",
        defaultSize: { width: 150, height: 20 },
        properties: {
            name: "checkbox",
            text: "CheckBox",
            width: 150,
            height: 20,
            location: { x: 50, y: 50 },
            backColor: "Transparent",
            foreColor: "#000000",
            enabled: true,
            visible: true,
            checked: false
        },
        template: "${{name}} = New-Object System.Windows.Forms.CheckBox\n${{name}}.Text = &quot;{{text}}&quot;\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n${{name}}.Checked = ${{checked}}\n${{name}}.Add_CheckedChanged({\n    # Add your checked changed event handler code here\n})\n$form.Controls.Add(${{name}})\n"
    },
    listbox: {
        type: "listbox",
        icon: "list",
        displayName: "ListBox",
        defaultSize: { width: 200, height: 100 },
        properties: {
            name: "listbox",
            width: 200,
            height: 100,
            location: { x: 50, y: 50 },
            backColor: "#FFFFFF",
            foreColor: "#000000",
            enabled: true,
            visible: true,
            items: ["Item 1", "Item 2", "Item 3"]
        },
        template: "${{name}} = New-Object System.Windows.Forms.ListBox\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n{{#items}}${{name}}.Items.Add(&quot;{{.}}&quot;){{/items}}\n${{name}}.Add_SelectedIndexChanged({\n    # Add your selection changed event handler code here\n})\n$form.Controls.Add(${{name}})\n"
    },
    combobox: {
        type: "combobox",
        icon: "caret-square-down",
        displayName: "ComboBox",
        defaultSize: { width: 200, height: 20 },
        properties: {
            name: "combobox",
            width: 200,
            height: 20,
            location: { x: 50, y: 50 },
            backColor: "#FFFFFF",
            foreColor: "#000000",
            enabled: true,
            visible: true,
            items: ["Item 1", "Item 2", "Item 3"],
            dropDownStyle: "DropDown"
        },
        template: "${{name}} = New-Object System.Windows.Forms.ComboBox\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n${{name}}.DropDownStyle = [System.Windows.Forms.ComboBoxStyle]::{{dropDownStyle}}\n{{#items}}${{name}}.Items.Add(&quot;{{.}}&quot;){{/items}}\n${{name}}.Add_SelectedIndexChanged({\n    # Add your selection changed event handler code here\n})\n$form.Controls.Add(${{name}})\n"
    },
    datagrid: {
        type: "datagrid",
        icon: "table",
        displayName: "DataGrid",
        defaultSize: { width: 300, height: 200 },
        properties: {
            name: "datagrid",
            width: 300,
            height: 200,
            location: { x: 50, y: 50 },
            backColor: "#FFFFFF",
            foreColor: "#000000",
            enabled: true,
            visible: true,
            columns: ["Column 1", "Column 2", "Column 3"]
        },
        template: "${{name}} = New-Object System.Windows.Forms.DataGridView\n${{name}}.Size = New-Object System.Drawing.Size({{width}}, {{height}})\n${{name}}.Location = New-Object System.Drawing.Point({{location.x}}, {{location.y}})\n${{name}}.BackColor = &quot;{{backColor}}&quot;\n${{name}}.ForeColor = &quot;{{foreColor}}&quot;\n${{name}}.Enabled = ${{enabled}}\n${{name}}.Visible = ${{visible}}\n{{#columns}}${{name}}.Columns.Add(&quot;col{{@index}}&quot;, &quot;{{.}}&quot;){{/columns}}\n$form.Controls.Add(${{name}})\n"
    }
};

// Initialize GUI Builder
function initializeGuiBuilder() {
    // Create GUI designer canvas
    guiDesignerCanvas = document.createElement('div');
    guiDesignerCanvas.id = 'gui-designer-canvas';
    guiDesignerCanvas.className = 'gui-designer-canvas';
    guiDesignerCanvas.style.width = formProperties.width + 'px';
    guiDesignerCanvas.style.height = formProperties.height + 'px';
    guiDesignerCanvas.style.backgroundColor = formProperties.backColor;
    guiDesignerCanvas.style.position = 'relative';
    guiDesignerCanvas.style.border = '1px solid #ccc';
    guiDesignerCanvas.style.overflow = 'hidden';
    guiDesignerCanvas.style.margin = '20px auto';
    guiDesignerCanvas.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    
    // Create property panel
    const propertyPanel = document.createElement('div');
    propertyPanel.id = 'property-panel';
    propertyPanel.className = 'property-panel';
    propertyPanel.innerHTML = `
        <div class="property-panel-header">
            <h3>Properties</h3>
        </div>
        <div class="property-panel-content">
            <div class="property-group">
                <h4>Form Properties</h4>
                <div class="property-item">
                    <label for="form-title">Title:</label>
                    <input type="text" id="form-title" value="${formProperties.title}">
                </div>
                <div class="property-item">
                    <label for="form-width">Width:</label>
                    <input type="number" id="form-width" value="${formProperties.width}">
                </div>
                <div class="property-item">
                    <label for="form-height">Height:</label>
                    <input type="number" id="form-height" value="${formProperties.height}">
                </div>
                <div class="property-item">
                    <label for="form-backcolor">Background:</label>
                    <input type="color" id="form-backcolor" value="${formProperties.backColor}">
                </div>
            </div>
            <div id="component-properties" class="property-group" style="display: none;">
                <h4>Component Properties</h4>
                <div id="component-properties-content"></div>
            </div>
        </div>
    `;
    
    // Create toolbox panel
    const toolboxPanel = document.createElement('div');
    toolboxPanel.id = 'toolbox-panel';
    toolboxPanel.className = 'toolbox-panel';
    toolboxPanel.innerHTML = `
        <div class="toolbox-panel-header">
            <h3>Toolbox</h3>
        </div>
        <div class="toolbox-panel-content">
            ${Object.keys(componentTypes).filter(type => type !== 'form').map(type => {
                const component = componentTypes[type];
                return `
                    <div class="toolbox-item" data-component="${component.type}">
                        <i class="fas fa-${component.icon}"></i>
                        <span>${component.displayName}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // Create GUI builder container
    const guiBuilderContainer = document.createElement('div');
    guiBuilderContainer.id = 'gui-builder-container';
    guiBuilderContainer.className = 'gui-builder-container';
    guiBuilderContainer.appendChild(toolboxPanel);
    guiBuilderContainer.appendChild(guiDesignerCanvas);
    guiBuilderContainer.appendChild(propertyPanel);
    
    // Add GUI builder container to the editor area
    document.querySelector('.editor-container').appendChild(guiBuilderContainer);
    
    // Hide GUI builder container initially
    guiBuilderContainer.style.display = 'none';
    
    // Add event listeners for property changes
    document.getElementById('form-title').addEventListener('change', function() {
        formProperties.title = this.value;
        updateFormCode();
    });
    
    document.getElementById('form-width').addEventListener('change', function() {
        formProperties.width = parseInt(this.value);
        guiDesignerCanvas.style.width = formProperties.width + 'px';
        updateFormCode();
    });
    
    document.getElementById('form-height').addEventListener('change', function() {
        formProperties.height = parseInt(this.value);
        guiDesignerCanvas.style.height = formProperties.height + 'px';
        updateFormCode();
    });
    
    document.getElementById('form-backcolor').addEventListener('change', function() {
        formProperties.backColor = this.value;
        guiDesignerCanvas.style.backgroundColor = formProperties.backColor;
        updateFormCode();
    });
    
    // Add event listeners for toolbox items
    document.querySelectorAll('.toolbox-item').forEach(item => {
        item.addEventListener('click', function() {
            const componentType = this.getAttribute('data-component');
            addComponent(componentType);
        });
    });
}

// Add a component to the designer canvas
function addComponent(componentType) {
    if (!componentTypes[componentType]) return;
    
    const componentDef = componentTypes[componentType];
    componentCounter++;
    
    // Clone the component properties
    const componentProps = JSON.parse(JSON.stringify(componentDef.properties));
    componentProps.name = componentProps.name + componentCounter;
    
    // Create component element
    const componentElement = document.createElement('div');
    componentElement.className = 'gui-component-element';
    componentElement.setAttribute('data-component-type', componentType);
    componentElement.setAttribute('data-component-id', componentProps.name);
    componentElement.style.position = 'absolute';
    componentElement.style.left = componentProps.location.x + 'px';
    componentElement.style.top = componentProps.location.y + 'px';
    componentElement.style.width = componentProps.width + 'px';
    componentElement.style.height = componentProps.height + 'px';
    componentElement.style.backgroundColor = componentProps.backColor;
    componentElement.style.color = componentProps.foreColor || '#000';
    componentElement.style.border = '1px solid #999';
    componentElement.style.cursor = 'move';
    componentElement.style.userSelect = 'none';
    componentElement.style.display = 'flex';
    componentElement.style.alignItems = 'center';
    componentElement.style.justifyContent = 'center';
    componentElement.style.overflow = 'hidden';
    componentElement.style.fontSize = '12px';
    
    // Add component text/content
    if (componentProps.text !== undefined) {
        componentElement.textContent = componentProps.text;
    } else {
        componentElement.textContent = componentDef.displayName;
    }
    
    // Store component properties in the element
    componentElement.componentProperties = componentProps;
    
    // Add event listeners for selection and dragging
    componentElement.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        selectComponent(this);
        
        // Setup dragging
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseInt(this.style.left);
        const startTop = parseInt(this.style.top);
        
        function moveHandler(e) {
            const newLeft = startLeft + e.clientX - startX;
            const newTop = startTop + e.clientY - startY;
            
            // Ensure component stays within canvas
            const maxLeft = guiDesignerCanvas.offsetWidth - componentElement.offsetWidth;
            const maxTop = guiDesignerCanvas.offsetHeight - componentElement.offsetHeight;
            
            componentElement.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            componentElement.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            
            // Update component properties
            componentElement.componentProperties.location.x = parseInt(componentElement.style.left);
            componentElement.componentProperties.location.y = parseInt(componentElement.style.top);
            
            // Update code
            updateComponentCode(componentElement);
        }
        
        function upHandler() {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });
    
    // Add resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '0';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.width = '8px';
    resizeHandle.style.height = '8px';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.backgroundColor = '#00f';
    
    resizeHandle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(componentElement.style.width);
        const startHeight = parseInt(componentElement.style.height);
        
        function moveHandler(e) {
            const newWidth = startWidth + e.clientX - startX;
            const newHeight = startHeight + e.clientY - startY;
            
            // Ensure minimum size
            componentElement.style.width = Math.max(20, newWidth) + 'px';
            componentElement.style.height = Math.max(20, newHeight) + 'px';
            
            // Update component properties
            componentElement.componentProperties.width = parseInt(componentElement.style.width);
            componentElement.componentProperties.height = parseInt(componentElement.style.height);
            
            // Update code
            updateComponentCode(componentElement);
        }
        
        function upHandler() {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });
    
    componentElement.appendChild(resizeHandle);
    
    // Add component to canvas
    guiDesignerCanvas.appendChild(componentElement);
    
    // Select the new component
    selectComponent(componentElement);
    
    // Update code
    updateComponentCode(componentElement);
}

// Select a component
function selectComponent(componentElement) {
    // Deselect previously selected component
    if (selectedComponent) {
        selectedComponent.style.outline = 'none';
    }
    
    // Select new component
    selectedComponent = componentElement;
    selectedComponent.style.outline = '2px solid #00f';
    
    // Show component properties
    showComponentProperties(componentElement);
}

// Show component properties in the property panel
function showComponentProperties(componentElement) {
    const componentProps = componentElement.componentProperties;
    const componentType = componentElement.getAttribute('data-component-type');
    const componentDef = componentTypes[componentType];
    
    // Show component properties panel
    document.getElementById('component-properties').style.display = 'block';
    
    // Generate property inputs
    let propertiesHtml = '';
    
    // Common properties
    propertiesHtml += `
        <div class="property-item">
            <label for="component-name">Name:</label>
            <input type="text" id="component-name" value="${componentProps.name}">
        </div>
    `;
    
    if (componentProps.text !== undefined) {
        propertiesHtml += `
            <div class="property-item">
                <label for="component-text">Text:</label>
                <input type="text" id="component-text" value="${componentProps.text}">
            </div>
        `;
    }
    
    propertiesHtml += `
        <div class="property-item">
            <label for="component-width">Width:</label>
            <input type="number" id="component-width" value="${componentProps.width}">
        </div>
        <div class="property-item">
            <label for="component-height">Height:</label>
            <input type="number" id="component-height" value="${componentProps.height}">
        </div>
        <div class="property-item">
            <label for="component-x">X:</label>
            <input type="number" id="component-x" value="${componentProps.location.x}">
        </div>
        <div class="property-item">
            <label for="component-y">Y:</label>
            <input type="number" id="component-y" value="${componentProps.location.y}">
        </div>
        <div class="property-item">
            <label for="component-backcolor">Back Color:</label>
            <input type="color" id="component-backcolor" value="${componentProps.backColor}">
        </div>
    `;
    
    if (componentProps.foreColor !== undefined) {
        propertiesHtml += `
            <div class="property-item">
                <label for="component-forecolor">Fore Color:</label>
                <input type="color" id="component-forecolor" value="${componentProps.foreColor}">
            </div>
        `;
    }
    
    if (componentProps.enabled !== undefined) {
        propertiesHtml += `
            <div class="property-item">
                <label for="component-enabled">Enabled:</label>
                <input type="checkbox" id="component-enabled" ${componentProps.enabled ? 'checked' : ''}>
            </div>
        `;
    }
    
    if (componentProps.visible !== undefined) {
        propertiesHtml += `
            <div class="property-item">
                <label for="component-visible">Visible:</label>
                <input type="checkbox" id="component-visible" ${componentProps.visible ? 'checked' : ''}>
            </div>
        `;
    }
    
    // Component-specific properties
    if (componentType === 'textbox' && componentProps.multiline !== undefined) {
        propertiesHtml += `
            <div class="property-item">
                <label for="component-multiline">Multiline:</label>
                <input type="checkbox" id="component-multiline" ${componentProps.multiline ? 'checked' : ''}>
            </div>
        `;
    }
    
    if (componentType === 'checkbox' && componentProps.checked !== undefined) {
        propertiesHtml += `
            <div class="property-item">
                <label for="component-checked">Checked:</label>
                <input type="checkbox" id="component-checked" ${componentProps.checked ? 'checked' : ''}>
            </div>
        `;
    }
    
    // Delete button
    propertiesHtml += `
        <div class="property-item">
            <button id="delete-component" class="btn btn-danger">Delete Component</button>
        </div>
    `;
    
    // Set properties content
    document.getElementById('component-properties-content').innerHTML = propertiesHtml;
    
    // Add event listeners for property changes
    document.getElementById('component-name').addEventListener('change', function() {
        componentProps.name = this.value;
        updateComponentCode(componentElement);
    });
    
    if (componentProps.text !== undefined) {
        document.getElementById('component-text').addEventListener('change', function() {
            componentProps.text = this.value;
            componentElement.textContent = this.value;
            updateComponentCode(componentElement);
        });
    }
    
    document.getElementById('component-width').addEventListener('change', function() {
        componentProps.width = parseInt(this.value);
        componentElement.style.width = componentProps.width + 'px';
        updateComponentCode(componentElement);
    });
    
    document.getElementById('component-height').addEventListener('change', function() {
        componentProps.height = parseInt(this.value);
        componentElement.style.height = componentProps.height + 'px';
        updateComponentCode(componentElement);
    });
    
    document.getElementById('component-x').addEventListener('change', function() {
        componentProps.location.x = parseInt(this.value);
        componentElement.style.left = componentProps.location.x + 'px';
        updateComponentCode(componentElement);
    });
    
    document.getElementById('component-y').addEventListener('change', function() {
        componentProps.location.y = parseInt(this.value);
        componentElement.style.top = componentProps.location.y + 'px';
        updateComponentCode(componentElement);
    });
    
    document.getElementById('component-backcolor').addEventListener('change', function() {
        componentProps.backColor = this.value;
        componentElement.style.backgroundColor = componentProps.backColor;
        updateComponentCode(componentElement);
    });
    
    if (componentProps.foreColor !== undefined) {
        document.getElementById('component-forecolor').addEventListener('change', function() {
            componentProps.foreColor = this.value;
            componentElement.style.color = componentProps.foreColor;
            updateComponentCode(componentElement);
        });
    }
    
    if (componentProps.enabled !== undefined) {
        document.getElementById('component-enabled').addEventListener('change', function() {
            componentProps.enabled = this.checked;
            if (!this.checked) {
                componentElement.style.opacity = '0.5';
            } else {
                componentElement.style.opacity = '1';
            }
            updateComponentCode(componentElement);
        });
    }
    
    if (componentProps.visible !== undefined) {
        document.getElementById('component-visible').addEventListener('change', function() {
            componentProps.visible = this.checked;
            if (!this.checked) {
                componentElement.style.visibility = 'hidden';
            } else {
                componentElement.style.visibility = 'visible';
            }
            updateComponentCode(componentElement);
        });
    }
    
    // Component-specific property listeners
    if (componentType === 'textbox' && componentProps.multiline !== undefined) {
        document.getElementById('component-multiline').addEventListener('change', function() {
            componentProps.multiline = this.checked;
            updateComponentCode(componentElement);
        });
    }
    
    if (componentType === 'checkbox' && componentProps.checked !== undefined) {
        document.getElementById('component-checked').addEventListener('change', function() {
            componentProps.checked = this.checked;
            updateComponentCode(componentElement);
        });
    }
    
    // Delete button listener
    document.getElementById('delete-component').addEventListener('click', function() {
        deleteComponent(componentElement);
    });
}

// Delete a component
function deleteComponent(componentElement) {
    // Remove component from canvas
    guiDesignerCanvas.removeChild(componentElement);
    
    // Clear selection
    selectedComponent = null;
    
    // Hide component properties
    document.getElementById('component-properties').style.display = 'none';
    
    // Update code
    generateFormCode();
}

// Update component code
function updateComponentCode(componentElement) {
    generateFormCode();
}

// Update form code
function updateFormCode() {
    generateFormCode();
}

// Generate complete form code
function generateFormCode() {
    let code = [
        '# PowerShell GUI Application',
        'Add-Type -AssemblyName System.Windows.Forms',
        'Add-Type -AssemblyName System.Drawing',
        '',
        '# Create form',
        `$form = New-Object System.Windows.Forms.Form`,
        `$form.Text = "${formProperties.title}"`,
        `$form.Size = New-Object System.Drawing.Size(${formProperties.width}, ${formProperties.height})`,
        `$form.StartPosition = "${formProperties.startPosition}"`,
        `$form.BackColor = "${formProperties.backColor}"`,
        `$form.Font = New-Object System.Drawing.Font("${formProperties.font.split(',')[0]}", ${parseInt(formProperties.font.split(',')[1])})`,
        ''
    ];
    
    // Add component code
    const components = guiDesignerCanvas.querySelectorAll('.gui-component-element');
    components.forEach(component => {
        const componentType = component.getAttribute('data-component-type');
        const componentProps = component.componentProperties;
        const componentDef = componentTypes[componentType];
        
        // Generate component code using template
        let componentCode = componentDef.template;
        
        // Replace template variables with actual values
        Object.keys(componentProps).forEach(key => {
            const value = componentProps[key];
            if (typeof value === 'object' && value !== null) {
                // Handle nested objects like location
                Object.keys(value).forEach(subKey => {
                    componentCode = componentCode.replace(new RegExp(`{{${key}.${subKey}}}`, 'g'), value[subKey]);
                });
            } else if (Array.isArray(value)) {
                // Handle arrays with special template syntax
                const arrayRegex = new RegExp(`{{#${key}}}(.*?){{/${key}}}`, 'g');
                const arrayMatch = arrayRegex.exec(componentCode);
                if (arrayMatch) {
                    const template = arrayMatch[1];
                    const items = value.map((item, index) => {
                        return template.replace(/{{\.}}/g, item).replace(/{{@index}}/g, index);
                    }).join('\n');
                    componentCode = componentCode.replace(arrayRegex, items);
                }
            } else {
                // Handle simple values
                componentCode = componentCode.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
        });
        
        // Handle conditional sections
        const conditionalRegex = /{{#(\w+)}}(.*?){{\/\1}}/g;
        componentCode = componentCode.replace(conditionalRegex, (match, condition, content) => {
            if (componentProps[condition] && componentProps[condition] !== '') {
                return content;
            }
            return '';
        });
        
        code.push(componentCode);
    });
    
    // Add form show code
    code.push('');
    code.push('# Show form');
    code.push('$form.ShowDialog() | Out-Null');
    
    // Update editor with generated code
    if (editor) {
        editor.setValue(code.join('\n'));
    }
}

// Show GUI Builder
function showGuiBuilder() {
    // Hide editor
    document.getElementById('editor').style.display = 'none';
    
    // Show GUI builder container
    document.getElementById('gui-builder-container').style.display = 'flex';
    
    // Set GUI builder active flag
    guiBuilderActive = true;
    
    // Generate initial form code
    generateFormCode();
}

// Hide GUI Builder
function hideGuiBuilder() {
    // Show editor
    document.getElementById('editor').style.display = 'block';
    
    // Hide GUI builder container
    document.getElementById('gui-builder-container').style.display = 'none';
    
    // Set GUI builder active flag
    guiBuilderActive = false;
}

// Toggle GUI Builder
function toggleGuiBuilder() {
    if (guiBuilderActive) {
        hideGuiBuilder();
    } else {
        showGuiBuilder();
    }
}