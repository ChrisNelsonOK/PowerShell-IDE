// PowerShell/Batch Visual IDE - Enhanced Module Management

// Module state
let installedModules = [];
let moduleDependencies = {};

// Initialize module manager
function initializeModuleManager() {
    // Load installed modules
    loadInstalledModules();
    
    // Create module visualization UI
    createModuleVisualizationUI();
    
    // Update module list in property panel
    updateModuleList();
}

// Load installed modules
function loadInstalledModules() {
    // In a real implementation, this would query the PowerShell environment
    // For this prototype, we'll use sample data
    installedModules = [
        {
            name: "Microsoft.PowerShell.Utility",
            version: "7.0.0.0",
            description: "Provides utilities for data manipulation, debugging, and other basic operations",
            author: "Microsoft",
            dependencies: []
        },
        {
            name: "Microsoft.PowerShell.Management",
            version: "7.0.0.0",
            description: "Provides cmdlets for managing Windows and Linux systems",
            author: "Microsoft",
            dependencies: []
        },
        {
            name: "Microsoft.PowerShell.Security",
            version: "7.0.0.0",
            description: "Provides cmdlets for managing security features",
            author: "Microsoft",
            dependencies: ["Microsoft.PowerShell.Utility"]
        },
        {
            name: "Microsoft.WSMan.Management",
            version: "7.0.0.0",
            description: "Provides cmdlets for managing WSMan sessions",
            author: "Microsoft",
            dependencies: ["Microsoft.PowerShell.Utility", "Microsoft.PowerShell.Management"]
        },
        {
            name: "PSReadLine",
            version: "2.2.6",
            description: "Provides an improved command-line editing experience in the PowerShell console",
            author: "Microsoft",
            dependencies: []
        }
    ];
    
    // Build dependency map
    buildDependencyMap();
}

// Build dependency map
function buildDependencyMap() {
    moduleDependencies = {};
    
    installedModules.forEach(module => {
        moduleDependencies[module.name] = module.dependencies;
    });
}

// Create module visualization UI
function createModuleVisualizationUI() {
    // Create dependency visualization container
    const dependencyContainer = document.createElement('div');
    dependencyContainer.id = 'module-dependency-container';
    dependencyContainer.className = 'module-dependency-container';
    
    // Create dependency graph
    const dependencyGraph = document.createElement('div');
    dependencyGraph.id = 'module-dependency-graph';
    dependencyGraph.className = 'module-dependency-graph';
    
    // Add to dependency container
    dependencyContainer.appendChild(dependencyGraph);
    
    // Add dependency container to module manager modal
    const moduleManagerModal = document.getElementById('moduleManagerModal');
    if (moduleManagerModal) {
        // Find the modal body and add our container
        const modalBody = moduleManagerModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.appendChild(dependencyContainer);
        }
    }
}

// Update module list in UI
function updateModuleList() {
    // Create module list HTML
    let moduleListHtml = '<div class="module-list-header"><h4>Installed Modules</h4></div>';
    
    installedModules.forEach(module => {
        moduleListHtml += `
            <div class="module-item">
                <h5>${module.name} (${module.version})</h5>
                <p>${module.description}</p>
                <div class="module-actions">
                    <button class="btn btn-sm btn-primary import-module-btn" data-module="${module.name}">Import</button>
                    <button class="btn btn-sm btn-secondary view-dependencies-btn" data-module="${module.name}">View Dependencies</button>
                    <button class="btn btn-sm btn-info view-docs-btn" data-module="${module.name}">View Docs</button>
                </div>
            </div>
        `;
    });
    
    // Add module search functionality
    moduleListHtml = `
        <div class="form-group">
            <label for="moduleSearch">Search Modules:</label>
            <input type="text" id="moduleSearch" placeholder="Enter module name">
        </div>
        ${moduleListHtml}
        <div class="module-actions">
            <button class="btn btn-sm btn-success" id="installModuleBtn">Install New Module</button>
        </div>
    `;
    
    // Update module list in modal
    const moduleManagerModal = document.getElementById('moduleManagerModal');
    if (moduleManagerModal) {
        const modalBody = moduleManagerModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = moduleListHtml;
            
            // Add event listeners
            document.querySelectorAll('.import-module-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const moduleName = this.getAttribute('data-module');
                    importModule(moduleName);
                });
            });
            
            document.querySelectorAll('.view-dependencies-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const moduleName = this.getAttribute('data-module');
                    visualizeDependencies(moduleName);
                });
            });
            
            document.querySelectorAll('.view-docs-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const moduleName = this.getAttribute('data-module');
                    viewModuleDocumentation(moduleName);
                });
            });
            
            document.getElementById('installModuleBtn').addEventListener('click', installNewModule);
        }
    }
}

// Import module into current script
function importModule(moduleName) {
    // Get current content from editor
    const content = editor.getValue();
    
    // Check if module is already imported
    if (content.includes(`Import-Module ${moduleName}`)) {
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `\n> Module ${moduleName} is already imported\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
        return;
    }
    
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

// Visualize dependencies for a module
function visualizeDependencies(moduleName) {
    // Create dependency visualization
    const dependencyGraph = document.getElementById('module-dependency-graph');
    if (!dependencyGraph) return;
    
    // Clear previous visualization
    dependencyGraph.innerHTML = '';
    
    // Find the module
    const module = installedModules.find(m => m.name === moduleName);
    if (!module) return;
    
    // Create module node
    const moduleNode = document.createElement('div');
    moduleNode.className = 'module-node main-module';
    moduleNode.innerHTML = `
        <div class="module-name">${module.name}</div>
        <div class="module-version">${module.version}</div>
    `;
    dependencyGraph.appendChild(moduleNode);
    
    // Create dependency nodes
    module.dependencies.forEach(depName => {
        const depModule = installedModules.find(m => m.name === depName);
        if (depModule) {
            const depNode = document.createElement('div');
            depNode.className = 'module-node dependency-module';
            depNode.innerHTML = `
                <div class="module-name">${depModule.name}</div>
                <div class="module-version">${depModule.version}</div>
            `;
            dependencyGraph.appendChild(depNode);
            
            // Create connection line
            const connection = document.createElement('div');
            connection.className = 'module-connection';
            dependencyGraph.appendChild(connection);
        }
    });
    
    // Show dependency visualization
    document.getElementById('module-dependency-container').style.display = 'block';
    
    // Add message to output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Showing dependencies for module ${moduleName}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// View module documentation
function viewModuleDocumentation(moduleName) {
    // In a real implementation, this would fetch documentation from a repository
    // For this prototype, we'll show a simulated documentation view
    
    const module = installedModules.find(m => m.name === moduleName);
    if (!module) return;
    
    // Create documentation modal
    const docModal = document.createElement('div');
    docModal.id = 'module-doc-modal';
    docModal.className = 'modal';
    docModal.style.display = 'flex';
    docModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${module.name} Documentation</h2>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="module-info">
                    <h4>Module Information</h4>
                    <p><strong>Version:</strong> ${module.version}</p>
                    <p><strong>Author:</strong> ${module.author}</p>
                    <p><strong>Description:</strong> ${module.description}</p>
                </div>
                <div class="module-cmdlets">
                    <h4>Available Cmdlets</h4>
                    <ul>
                        <li>Get-Command -Module ${module.name}</li>
                        <li>Get-Help -Module ${module.name}</li>
                        <li>Get-Module -Name ${module.name} -ListAvailable</li>
                    </ul>
                </div>
                <div class="module-examples">
                    <h4>Usage Examples</h4>
                    <pre class="code-example"># Import the module
Import-Module ${module.name}

# List all commands in the module
Get-Command -Module ${module.name}

# Get help for a specific command
Get-Help Get-Command</pre>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="closeDocModalBtn">Close</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(docModal);
    
    // Add event listeners
    docModal.querySelector('.close-button').addEventListener('click', function() {
        document.body.removeChild(docModal);
    });
    
    document.getElementById('closeDocModalBtn').addEventListener('click', function() {
        document.body.removeChild(docModal);
    });
    
    // Add message to output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Opening documentation for module ${moduleName}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Install new module
function installNewModule() {
    // Create installation modal
    const installModal = document.createElement('div');
    installModal.id = 'install-module-modal';
    installModal.className = 'modal';
    installModal.style.display = 'flex';
    installModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Install PowerShell Module</h2>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="moduleNameInput">Module Name:</label>
                    <input type="text" id="moduleNameInput" placeholder="Enter module name">
                </div>
                <div class="form-group">
                    <label for="moduleGallery">Gallery:</label>
                    <select id="moduleGallery">
                        <option value="PSGallery">PowerShell Gallery</option>
                        <option value="NuGet">NuGet</option>
                        <option value="Local">Local Repository</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="moduleVersion">Version (optional):</label>
                    <input type="text" id="moduleVersion" placeholder="Enter version">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelInstallBtn">Cancel</button>
                <button class="btn btn-primary" id="confirmInstallBtn">Install</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(installModal);
    
    // Add event listeners
    installModal.querySelector('.close-button').addEventListener('click', function() {
        document.body.removeChild(installModal);
    });
    
    document.getElementById('cancelInstallBtn').addEventListener('click', function() {
        document.body.removeChild(installModal);
    });
    
    document.getElementById('confirmInstallBtn').addEventListener('click', function() {
        const moduleName = document.getElementById('moduleNameInput').value;
        const gallery = document.getElementById('moduleGallery').value;
        const version = document.getElementById('moduleVersion').value;
        
        if (!moduleName) {
            alert('Please enter a module name');
            return;
        }
        
        // Simulate installation
        installModule(moduleName, gallery, version);
        
        // Close modal
        document.body.removeChild(installModal);
    });
}

// Install module (simulated)
function installModule(moduleName, gallery, version) {
    // Add to installed modules
    installedModules.push({
        name: moduleName,
        version: version || "1.0.0",
        description: `Module ${moduleName} installed from ${gallery}`,
        author: "Community",
        dependencies: []
    });
    
    // Update module list
    updateModuleList();
    
    // Show installation confirmation
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Module ${moduleName} installed successfully from ${gallery}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}