// PowerShell/Batch Visual IDE - Template Marketplace

// Template marketplace state
let marketplaceTemplates = [];
let userTemplates = [];

// Initialize template marketplace
function initializeTemplateMarketplace() {
    // Load marketplace templates
    loadMarketplaceTemplates();
    
    // Create marketplace UI
    createTemplateMarketplaceUI();
}

// Load marketplace templates
function loadMarketplaceTemplates() {
    // In a real implementation, this would fetch templates from a remote repository
    // For this prototype, we'll use sample data
    marketplaceTemplates = [
        {
            id: 1,
            name: "File Manager Utility",
            description: "A PowerShell utility for managing files and directories with a GUI interface",
            author: "Community",
            type: "gui",
            rating: 4.5,
            downloads: 1240,
            tags: ["gui", "file", "utility"],
            content: `# File Manager Utility
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Create form
$form = New-Object System.Windows.Forms.Form
$form.Text = "File Manager Utility"
$form.Size = New-Object System.Drawing.Size(600, 400)
$form.StartPosition = "CenterScreen"

# Create folder browser button
$browseButton = New-Object System.Windows.Forms.Button
$browseButton.Text = "Browse Folder"
$browseButton.Size = New-Object System.Drawing.Size(100, 30)
$browseButton.Location = New-Object System.Drawing.Point(10, 10)
$form.Controls.Add($browseButton)

# Create file list
$fileList = New-Object System.Windows.Forms.ListView
$fileList.Size = New-Object System.Drawing.Size(560, 300)
$fileList.Location = New-Object System.Drawing.Point(10, 50)
$fileList.View = [System.Windows.Forms.View]::Details
$fileList.Columns.Add("Name", 200)
$fileList.Columns.Add("Size", 100)
$fileList.Columns.Add("Type", 100)
$fileList.Columns.Add("Modified", 150)
$form.Controls.Add($fileList)

# Browse button click event
$browseButton.Add_Click({
    $folderBrowser = New-Object System.Windows.Forms.FolderBrowserDialog
    if ($folderBrowser.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $folderPath = $folderBrowser.SelectedPath
        $fileList.Items.Clear()
        
        Get-ChildItem $folderPath | ForEach-Object {
            $item = New-Object System.Windows.Forms.ListViewItem($_.Name)
            $item.SubItems.Add($_.Length)
            $item.SubItems.Add($_.Extension)
            $item.SubItems.Add($_.LastWriteTime)
            $fileList.Items.Add($item)
        }
    }
})

# Show form
$form.ShowDialog() | Out-Null`
        },
        {
            id: 2,
            name: "System Information Reporter",
            description: "A PowerShell script that gathers and displays system information in a formatted report",
            author: "Community",
            type: "cli",
            rating: 4.2,
            downloads: 890,
            tags: ["cli", "system", "report"],
            content: `# System Information Reporter
param(
    [string]$OutputPath = "system-report.txt",
    [switch]$Detailed
)

function Get-SystemInfo {
    $info = @{
        ComputerName = $env:COMPUTERNAME
        UserName = $env:USERNAME
        OS = (Get-CimInstance Win32_OperatingSystem).Caption
        Architecture = (Get-CimInstance Win32_OperatingSystem).OSArchitecture
        TotalMemory = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
        Processors = (Get-CimInstance Win32_Processor).Name
        ProcessCount = (Get-Process).Count
    }
    
    if ($Detailed) {
        $info.DiskInfo = Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace
        $info.NetworkInfo = Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled } | Select-Object Description, IPAddress, MACAddress
    }
    
    return $info
}

function Format-SystemReport {
    param($SystemInfo)
    
    $report = "System Information Report
======================
Computer Name: $($SystemInfo.ComputerName)
User Name: $($SystemInfo.UserName)
Operating System: $($SystemInfo.OS)
Architecture: $($SystemInfo.Architecture)
Total Memory: $($SystemInfo.TotalMemory) GB
Processors: $($SystemInfo.Processors)
Running Processes: $($SystemInfo.ProcessCount)

"
    
    if ($SystemInfo.DiskInfo) {
        $report += "Disk Information:
"
        $SystemInfo.DiskInfo | ForEach-Object {
            $report += "  $($_.DeviceID): $([math]::Round($_.Size / 1GB, 2)) GB Total, $([math]::Round($_.FreeSpace / 1GB, 2)) GB Free
"
        }
        $report += "
"
    }
    
    if ($SystemInfo.NetworkInfo) {
        $report += "Network Information:
"
        $SystemInfo.NetworkInfo | ForEach-Object {
            $report += "  Description: $($_.Description)
  IP Address: $($_.IPAddress -join ", ")
  MAC Address: $($_.MACAddress)
"
        }
    }
    
    return $report
}

# Main execution
$systemInfo = Get-SystemInfo
$report = Format-SystemReport $systemInfo

# Output to console
Write-Host $report

# Output to file
$report | Out-File -FilePath $OutputPath -Encoding UTF8

Write-Host "System information report saved to $OutputPath"`
        },
        {
            id: 3,
            name: "Automated Backup Script",
            description: "A batch script that automates backup of important directories",
            author: "Community",
            type: "batch",
            rating: 4.0,
            downloads: 750,
            tags: ["batch", "backup", "automation"],
            content: `@echo off
REM Automated Backup Script
REM This script creates a backup of specified directories

set BACKUP_SOURCE=C:\\ImportantFiles
set BACKUP_DEST=D:\\Backups\\%date:~0,10%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set LOG_FILE=backup.log

echo Starting backup process > %LOG_FILE%
echo Source: %BACKUP_SOURCE% >> %LOG_FILE%
echo Destination: %BACKUP_DEST% >> %LOG_FILE%
echo Date: %date% %time% >> %LOG_FILE%

REM Create backup directory
if not exist "%BACKUP_DEST%" (
    mkdir "%BACKUP_DEST%"
    echo Created backup directory >> %LOG_FILE%
)

REM Copy files
xcopy "%BACKUP_SOURCE%" "%BACKUP_DEST%" /E /I /H /Y >> %LOG_FILE%

echo Backup completed >> %LOG_FILE%
echo. >> %LOG_FILE%

REM Display log
type %LOG_FILE%
pause`
        },
        {
            id: 4,
            name: "Active Directory User Manager",
            description: "A PowerShell GUI application for managing Active Directory users",
            author: "Community",
            type: "gui",
            rating: 4.7,
            downloads: 2100,
            tags: ["gui", "active-directory", "user-management"],
            content: `# Active Directory User Manager
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Create form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Active Directory User Manager"
$form.Size = New-Object System.Drawing.Size(500, 400)
$form.StartPosition = "CenterScreen"

# Create user search textbox
$searchBox = New-Object System.Windows.Forms.TextBox
$searchBox.Size = New-Object System.Drawing.Size(300, 20)
$searchBox.Location = New-Object System.Drawing.Point(10, 10)
$form.Controls.Add($searchBox)

# Create search button
$searchButton = New-Object System.Windows.Forms.Button
$searchButton.Text = "Search"
$searchButton.Size = New-Object System.Drawing.Size(75, 23)
$searchButton.Location = New-Object System.Drawing.Point(320, 10)
$form.Controls.Add($searchButton)

# Create user list
$userList = New-Object System.Windows.Forms.ListBox
$userList.Size = New-Object System.Drawing.Size(460, 250)
$userList.Location = New-Object System.Drawing.Point(10, 40)
$form.Controls.Add($userList)

# Create action buttons
$enableButton = New-Object System.Windows.Forms.Button
$enableButton.Text = "Enable"
$enableButton.Size = New-Object System.Drawing.Size(75, 23)
$enableButton.Location = New-Object System.Drawing.Point(10, 300)
$form.Controls.Add($enableButton)

$disableButton = New-Object System.Windows.Forms.Button
$disableButton.Text = "Disable"
$disableButton.Size = New-Object System.Drawing.Size(75, 23)
$disableButton.Location = New-Object System.Drawing.Point(90, 300)
$form.Controls.Add($disableButton)

$resetPasswordButton = New-Object System.Windows.Forms.Button
$resetPasswordButton.Text = "Reset Password"
$resetPasswordButton.Size = New-Object System.Drawing.Size(100, 23)
$resetPasswordButton.Location = New-Object System.Drawing.Point(170, 300)
$form.Controls.Add($resetPasswordButton)

# Search button click event
$searchButton.Add_Click({
    $searchTerm = $searchBox.Text
    $userList.Items.Clear()
    
    # In a real implementation, this would search Active Directory
    # For this prototype, we'll add sample users
    $userList.Items.Add("John Doe")
    $userList.Items.Add("Jane Smith")
    $userList.Items.Add("Bob Johnson")
    $userList.Items.Add("Alice Williams")
})

# Enable button click event
$enableButton.Add_Click({
    if ($userList.SelectedItem) {
        # In a real implementation, this would enable the user in Active Directory
        [System.Windows.Forms.MessageBox]::Show("User $($userList.SelectedItem) enabled", "Success")
    } else {
        [System.Windows.Forms.MessageBox]::Show("Please select a user", "Warning")
    }
})

# Disable button click event
$disableButton.Add_Click({
    if ($userList.SelectedItem) {
        # In a real implementation, this would disable the user in Active Directory
        [System.Windows.Forms.MessageBox]::Show("User $($userList.SelectedItem) disabled", "Success")
    } else {
        [System.Windows.Forms.MessageBox]::Show("Please select a user", "Warning")
    }
})

# Reset password button click event
$resetPasswordButton.Add_Click({
    if ($userList.SelectedItem) {
        # In a real implementation, this would reset the user's password in Active Directory
        [System.Windows.Forms.MessageBox]::Show("Password reset for $($userList.SelectedItem)", "Success")
    } else {
        [System.Windows.Forms.MessageBox]::Show("Please select a user", "Warning")
    }
})

# Show form
$form.ShowDialog() | Out-Null`
        }
    ];
}

// Create template marketplace UI
function createTemplateMarketplaceUI() {
    // Create marketplace container
    const marketplaceContainer = document.createElement('div');
    marketplaceContainer.id = 'template-marketplace-container';
    marketplaceContainer.className = 'template-marketplace-container';
    
    // Create marketplace header
    const marketplaceHeader = document.createElement('div');
    marketplaceHeader.className = 'template-marketplace-header';
    marketplaceHeader.innerHTML = `
        <h3>Template Marketplace</h3>
        <div class="template-search">
            <input type="text" id="templateSearchInput" placeholder="Search templates...">
            <button id="templateSearchBtn" class="btn btn-primary">Search</button>
        </div>
    `;
    
    // Create template list
    const templateList = document.createElement('div');
    templateList.id = 'template-list';
    templateList.className = 'template-list';
    
    // Create user templates section
    const userTemplatesSection = document.createElement('div');
    userTemplatesSection.className = 'user-templates-section';
    userTemplatesSection.innerHTML = `
        <h4>Your Templates</h4>
        <div id="user-template-list" class="user-template-list">
            <div class="empty-message">No user templates saved</div>
        </div>
    `;
    
    // Create marketplace templates section
    const marketplaceTemplatesSection = document.createElement('div');
    marketplaceTemplatesSection.className = 'marketplace-templates-section';
    marketplaceTemplatesSection.innerHTML = `
        <h4>Community Templates</h4>
        <div id="marketplace-template-list" class="marketplace-template-list">
        </div>
    `;
    
    // Add sections to template list
    templateList.appendChild(userTemplatesSection);
    templateList.appendChild(marketplaceTemplatesSection);
    
    // Add to marketplace container
    marketplaceContainer.appendChild(marketplaceHeader);
    marketplaceContainer.appendChild(templateList);
    
    // Add marketplace container to template manager modal
    const templateManagerModal = document.getElementById('templateManagerModal');
    if (templateManagerModal) {
        // Find the modal body and add our container
        const modalBody = templateManagerModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = '';
            modalBody.appendChild(marketplaceContainer);
        }
    }
    
    // Update template lists
    updateUserTemplateList();
    updateMarketplaceTemplateList();
    
    // Add event listeners
    document.getElementById('templateSearchBtn').addEventListener('click', searchTemplates);
    document.getElementById('templateSearchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchTemplates();
        }
    });
}

// Update user template list
function updateUserTemplateList() {
    const userTemplateList = document.getElementById('user-template-list');
    if (!userTemplateList) return;
    
    if (userTemplates.length === 0) {
        userTemplateList.innerHTML = '<div class="empty-message">No user templates saved</div>';
        return;
    }
    
    userTemplateList.innerHTML = userTemplates.map(template => `
        <div class="template-item" data-template-id="${template.id}">
            <h5>${template.name}</h5>
            <p>${template.description}</p>
            <div class="template-meta">
                <span class="template-author">by ${template.author}</span>
                <span class="template-type">${template.type}</span>
            </div>
            <div class="template-actions">
                <button class="btn btn-sm btn-primary use-template-btn" data-template-id="${template.id}">Use Template</button>
                <button class="btn btn-sm btn-danger delete-template-btn" data-template-id="${template.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.use-template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template-id');
            useTemplate(templateId, 'user');
        });
    });
    
    document.querySelectorAll('.delete-template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template-id');
            deleteUserTemplate(templateId);
        });
    });
}

// Update marketplace template list
function updateMarketplaceTemplateList() {
    const marketplaceTemplateList = document.getElementById('marketplace-template-list');
    if (!marketplaceTemplateList) return;
    
    marketplaceTemplateList.innerHTML = marketplaceTemplates.map(template => `
        <div class="template-item" data-template-id="${template.id}">
            <h5>${template.name}</h5>
            <p>${template.description}</p>
            <div class="template-meta">
                <span class="template-author">by ${template.author}</span>
                <span class="template-type">${template.type}</span>
                <span class="template-rating">★ ${template.rating}</span>
                <span class="template-downloads">${template.downloads} downloads</span>
            </div>
            <div class="template-actions">
                <button class="btn btn-sm btn-primary use-template-btn" data-template-id="${template.id}">Use Template</button>
                <button class="btn btn-sm btn-secondary save-template-btn" data-template-id="${template.id}">Save to My Templates</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.use-template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template-id');
            useTemplate(templateId, 'marketplace');
        });
    });
    
    document.querySelectorAll('.save-template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template-id');
            saveUserTemplate(templateId);
        });
    });
}

// Search templates
function searchTemplates() {
    const searchTerm = document.getElementById('templateSearchInput').value.toLowerCase();
    const marketplaceTemplateList = document.getElementById('marketplace-template-list');
    
    if (!searchTerm) {
        updateMarketplaceTemplateList();
        return;
    }
    
    const filteredTemplates = marketplaceTemplates.filter(template => 
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    if (filteredTemplates.length === 0) {
        marketplaceTemplateList.innerHTML = '<div class="empty-message">No templates found matching your search</div>';
        return;
    }
    
    marketplaceTemplateList.innerHTML = filteredTemplates.map(template => `
        <div class="template-item" data-template-id="${template.id}">
            <h5>${template.name}</h5>
            <p>${template.description}</p>
            <div class="template-meta">
                <span class="template-author">by ${template.author}</span>
                <span class="template-type">${template.type}</span>
                <span class="template-rating">★ ${template.rating}</span>
                <span class="template-downloads">${template.downloads} downloads</span>
            </div>
            <div class="template-actions">
                <button class="btn btn-sm btn-primary use-template-btn" data-template-id="${template.id}">Use Template</button>
                <button class="btn btn-sm btn-secondary save-template-btn" data-template-id="${template.id}">Save to My Templates</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.use-template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template-id');
            useTemplate(templateId, 'marketplace');
        });
    });
    
    document.querySelectorAll('.save-template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template-id');
            saveUserTemplate(templateId);
        });
    });
}

// Use template
function useTemplate(templateId, source) {
    let template;
    
    if (source === 'user') {
        template = userTemplates.find(t => t.id == templateId);
    } else {
        template = marketplaceTemplates.find(t => t.id == templateId);
    }
    
    if (!template) return;
    
    // Create new file with template content
    const fileName = template.name.replace(/\s+/g, '_').toLowerCase() + 
        (template.type === 'gui' || template.type === 'cli' ? '.ps1' : '.bat');
    
    projectFiles[fileName] = {
        content: template.content,
        language: template.type === 'batch' ? 'batch' : 'powershell'
    };
    
    // Update editor with template content
    editor.setValue(template.content);
    currentFileName = fileName;
    currentLanguage = template.type === 'batch' ? 'batch' : 'powershell';
    monaco.editor.setModelLanguage(editor.getModel(), currentLanguage);
    
    // Update sidebar
    updateSidebar();
    
    // Close modal
    document.getElementById('templateManagerModal').style.display = 'none';
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Template "${template.name}" loaded into ${fileName}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Save user template
function saveUserTemplate(templateId) {
    const template = marketplaceTemplates.find(t => t.id == templateId);
    if (!template) return;
    
    // Check if template is already saved
    if (userTemplates.find(t => t.id == templateId)) {
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `\n> Template "${template.name}" is already saved to your templates\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
        return;
    }
    
    // Add to user templates
    userTemplates.push(template);
    
    // Update user template list
    updateUserTemplateList();
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Template "${template.name}" saved to your templates\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Delete user template
function deleteUserTemplate(templateId) {
    const templateIndex = userTemplates.findIndex(t => t.id == templateId);
    if (templateIndex === -1) return;
    
    const templateName = userTemplates[templateIndex].name;
    
    // Remove from user templates
    userTemplates.splice(templateIndex, 1);
    
    // Update user template list
    updateUserTemplateList();
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Template "${templateName}" deleted from your templates\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Publish template
function publishTemplate() {
    // In a real implementation, this would publish the template to a remote repository
    // For this prototype, we'll show a simulated publish dialog
    
    // Create publish modal
    const publishModal = document.createElement('div');
    publishModal.id = 'publish-template-modal';
    publishModal.className = 'modal';
    publishModal.style.display = 'flex';
    publishModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Publish Template</h2>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="templateNameInput">Template Name:</label>
                    <input type="text" id="templateNameInput" placeholder="Enter template name">
                </div>
                <div class="form-group">
                    <label for="templateDescriptionInput">Description:</label>
                    <textarea id="templateDescriptionInput" rows="3" placeholder="Enter template description"></textarea>
                </div>
                <div class="form-group">
                    <label for="templateTagsInput">Tags (comma-separated):</label>
                    <input type="text" id="templateTagsInput" placeholder="Enter tags">
                </div>
                <div class="form-group">
                    <label for="templateTypeSelect">Template Type:</label>
                    <select id="templateTypeSelect">
                        <option value="cli">CLI PowerShell</option>
                        <option value="gui">GUI PowerShell</option>
                        <option value="batch">Batch File</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelPublishBtn">Cancel</button>
                <button class="btn btn-primary" id="confirmPublishBtn">Publish</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(publishModal);
    
    // Add event listeners
    publishModal.querySelector('.close-button').addEventListener('click', function() {
        document.body.removeChild(publishModal);
    });
    
    document.getElementById('cancelPublishBtn').addEventListener('click', function() {
        document.body.removeChild(publishModal);
    });
    
    document.getElementById('confirmPublishBtn').addEventListener('click', function() {
        const templateName = document.getElementById('templateNameInput').value;
        const templateDescription = document.getElementById('templateDescriptionInput').value;
        const templateTags = document.getElementById('templateTagsInput').value;
        const templateType = document.getElementById('templateTypeSelect').value;
        
        if (!templateName) {
            alert('Please enter a template name');
            return;
        }
        
        // Simulate publishing
        publishTemplateToMarketplace(templateName, templateDescription, templateTags, templateType);
        
        // Close modal
        document.body.removeChild(publishModal);
    });
}

// Publish template to marketplace (simulated)
function publishTemplateToMarketplace(name, description, tags, type) {
    // Create template object
    const template = {
        id: marketplaceTemplates.length + 1,
        name: name,
        description: description,
        author: "You",
        type: type,
        rating: 0,
        downloads: 0,
        tags: tags.split(',').map(tag => tag.trim()),
        content: editor.getValue()
    };
    
    // Add to marketplace templates
    marketplaceTemplates.push(template);
    
    // Update marketplace template list
    updateMarketplaceTemplateList();
    
    // Show publish confirmation
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Template "${name}" published to marketplace\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}