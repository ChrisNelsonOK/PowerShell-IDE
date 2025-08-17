// PowerShell/Batch Visual IDE - Git Integration

// Git state
let gitRepository = null;
let gitBranches = [];
let gitCurrentBranch = null;
let gitCommits = [];

// Initialize Git integration
function initializeGitIntegration() {
    // Create Git UI
    createGitUI();
    
    // Check if current project is a Git repository
    checkGitRepository();
}

// Create Git UI
function createGitUI() {
    // Create Git container
    const gitContainer = document.createElement('div');
    gitContainer.id = 'git-container';
    gitContainer.className = 'git-container';
    
    // Create Git header
    const gitHeader = document.createElement('div');
    gitHeader.className = 'git-header';
    gitHeader.innerHTML = `
        <h3>Git Integration</h3>
        <div class="git-actions">
            <button id="gitCommitBtn" class="btn btn-primary">Commit</button>
            <button id="gitPushBtn" class="btn btn-success">Push</button>
            <button id="gitPullBtn" class="btn btn-info">Pull</button>
        </div>
    `;
    
    // Create Git status
    const gitStatus = document.createElement('div');
    gitStatus.id = 'git-status';
    gitStatus.className = 'git-status';
    
    // Create Git branches
    const gitBranches = document.createElement('div');
    gitBranches.id = 'git-branches';
    gitBranches.className = 'git-branches';
    
    // Create Git commits
    const gitCommits = document.createElement('div');
    gitCommits.id = 'git-commits';
    gitCommits.className = 'git-commits';
    
    // Add to Git container
    gitContainer.appendChild(gitHeader);
    gitContainer.appendChild(gitStatus);
    gitContainer.appendChild(gitBranches);
    gitContainer.appendChild(gitCommits);
    
    // Add Git container to Git integration modal
    const gitIntegrationModal = document.getElementById('gitIntegrationModal');
    if (gitIntegrationModal) {
        // Find the modal body and add our container
        const modalBody = gitIntegrationModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = '';
            modalBody.appendChild(gitContainer);
        }
    }
    
    // Add event listeners
    document.getElementById('gitCommitBtn').addEventListener('click', gitCommit);
    document.getElementById('gitPushBtn').addEventListener('click', gitPush);
    document.getElementById('gitPullBtn').addEventListener('click', gitPull);
}

// Check if current project is a Git repository
function checkGitRepository() {
    // In a real implementation, this would check for a .git directory
    // For this prototype, we'll simulate a Git repository
    
    gitRepository = {
        name: "PowerShell-Project",
        path: "/workspace/PowerShell-Project",
        remote: "https://github.com/user/PowerShell-Project.git"
    };
    
    // Simulate branches
    gitBranches = [
        { name: "main", active: true },
        { name: "feature/new-gui", active: false },
        { name: "bugfix/debugger", active: false }
    ];
    
    gitCurrentBranch = gitBranches[0];
    
    // Simulate commits
    gitCommits = [
        { hash: "a1b2c3d", message: "Initial commit", author: "User", date: "2025-08-15" },
        { hash: "e4f5g6h", message: "Add GUI components", author: "User", date: "2025-08-16" },
        { hash: "i7j8k9l", message: "Fix debugger issues", author: "User", date: "2025-08-17" }
    ];
    
    // Update Git status
    updateGitStatus();
    
    // Update Git branches
    updateGitBranches();
    
    // Update Git commits
    updateGitCommits();
}

// Update Git status
function updateGitStatus() {
    const gitStatus = document.getElementById('git-status');
    if (!gitStatus) return;
    
    if (!gitRepository) {
        gitStatus.innerHTML = `
            <div class="git-status-item">
                <p>This project is not a Git repository</p>
                <button id="gitInitBtn" class="btn btn-secondary">Initialize Git Repository</button>
            </div>
        `;
        
        document.getElementById('gitInitBtn').addEventListener('click', gitInit);
        return;
    }
    
    gitStatus.innerHTML = `
        <div class="git-status-item">
            <p><strong>Repository:</strong> ${gitRepository.name}</p>
            <p><strong>Path:</strong> ${gitRepository.path}</p>
            <p><strong>Remote:</strong> ${gitRepository.remote}</p>
            <p><strong>Current Branch:</strong> ${gitCurrentBranch.name}</p>
        </div>
    `;
}

// Update Git branches
function updateGitBranches() {
    const gitBranches = document.getElementById('git-branches');
    if (!gitBranches) return;
    
    if (!gitRepository) {
        gitBranches.innerHTML = '<div class="empty-message">No Git repository found</div>';
        return;
    }
    
    gitBranches.innerHTML = `
        <h4>Branches</h4>
        <div class="branch-list">
            ${gitBranches.map(branch => `
                <div class="branch-item ${branch.active ? 'active' : ''}">
                    <span>${branch.name}</span>
                    ${branch.active ? '<span class="branch-active">Active</span>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Update Git commits
function updateGitCommits() {
    const gitCommits = document.getElementById('git-commits');
    if (!gitCommits) return;
    
    if (!gitRepository) {
        gitCommits.innerHTML = '<div class="empty-message">No Git repository found</div>';
        return;
    }
    
    gitCommits.innerHTML = `
        <h4>Recent Commits</h4>
        <div class="commit-list">
            ${gitCommits.map(commit => `
                <div class="commit-item">
                    <div class="commit-hash">${commit.hash.substring(0, 7)}</div>
                    <div class="commit-message">${commit.message}</div>
                    <div class="commit-meta">
                        <span class="commit-author">${commit.author}</span>
                        <span class="commit-date">${commit.date}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Initialize Git repository
function gitInit() {
    // In a real implementation, this would run git init
    // For this prototype, we'll simulate initialization
    
    gitRepository = {
        name: "PowerShell-Project",
        path: "/workspace/PowerShell-Project",
        remote: "https://github.com/user/PowerShell-Project.git"
    };
    
    gitBranches = [
        { name: "main", active: true }
    ];
    
    gitCurrentBranch = gitBranches[0];
    
    // Update UI
    updateGitStatus();
    updateGitBranches();
    updateGitCommits();
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Git repository initialized\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Git commit
function gitCommit() {
    // In a real implementation, this would run git commit
    // For this prototype, we'll simulate commit
    
    // Create commit modal
    const commitModal = document.createElement('div');
    commitModal.id = 'git-commit-modal';
    commitModal.className = 'modal';
    commitModal.style.display = 'flex';
    commitModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Git Commit</h2>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="commitMessage">Commit Message:</label>
                    <textarea id="commitMessage" rows="3" placeholder="Enter commit message"></textarea>
                </div>
                <div class="form-group">
                    <label for="commitFiles">Files to Commit:</label>
                    <div id="commitFiles" class="commit-files">
                        <!-- Files will be listed here -->
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelCommitBtn">Cancel</button>
                <button class="btn btn-primary" id="confirmCommitBtn">Commit</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(commitModal);
    
    // Update file list
    updateCommitFileList();
    
    // Add event listeners
    commitModal.querySelector('.close-button').addEventListener('click', function() {
        document.body.removeChild(commitModal);
    });
    
    document.getElementById('cancelCommitBtn').addEventListener('click', function() {
        document.body.removeChild(commitModal);
    });
    
    document.getElementById('confirmCommitBtn').addEventListener('click', function() {
        const commitMessage = document.getElementById('commitMessage').value;
        
        if (!commitMessage) {
            alert('Please enter a commit message');
            return;
        }
        
        // Simulate commit
        performGitCommit(commitMessage);
        
        // Close modal
        document.body.removeChild(commitModal);
    });
}

// Update commit file list
function updateCommitFileList() {
    const commitFiles = document.getElementById('commitFiles');
    if (!commitFiles) return;
    
    // Get all project files
    const fileNames = Object.keys(projectFiles);
    
    if (fileNames.length === 0) {
        commitFiles.innerHTML = '<div class="empty-message">No files to commit</div>';
        return;
    }
    
    commitFiles.innerHTML = fileNames.map(fileName => `
        <div class="commit-file-item">
            <input type="checkbox" id="commitFile-${fileName}" checked>
            <label for="commitFile-${fileName}">${fileName}</label>
        </div>
    `).join('');
}

// Perform Git commit
function performGitCommit(message) {
    // In a real implementation, this would run git commit
    // For this prototype, we'll simulate the commit
    
    // Create new commit
    const newCommit = {
        hash: Math.random().toString(36).substring(2, 9),
        message: message,
        author: "User",
        date: new Date().toISOString().split('T')[0]
    };
    
    // Add to commits
    gitCommits.unshift(newCommit);
    
    // Keep only last 10 commits
    if (gitCommits.length > 10) {
        gitCommits.pop();
    }
    
    // Update UI
    updateGitCommits();
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Committed changes: ${message}\n`;
    outputContent.innerHTML += `> Commit hash: ${newCommit.hash}\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Git push
function gitPush() {
    // In a real implementation, this would run git push
    // For this prototype, we'll simulate push
    
    if (!gitRepository) {
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `\n> Error: No Git repository found\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
        return;
    }
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Pushing changes to remote repository...\n`;
    outputContent.innerHTML += `> Repository: ${gitRepository.remote}\n`;
    outputContent.innerHTML += `> Branch: ${gitCurrentBranch.name}\n`;
    outputContent.innerHTML += `> Push completed successfully\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Git pull
function gitPull() {
    // In a real implementation, this would run git pull
    // For this prototype, we'll simulate pull
    
    if (!gitRepository) {
        const outputContent = document.querySelector('.output-content');
        outputContent.innerHTML += `\n> Error: No Git repository found\n`;
        outputContent.scrollTop = outputContent.scrollHeight;
        return;
    }
    
    // Show message in output
    const outputContent = document.querySelector('.output-content');
    outputContent.innerHTML += `\n> Pulling changes from remote repository...\n`;
    outputContent.innerHTML += `> Repository: ${gitRepository.remote}\n`;
    outputContent.innerHTML += `> Branch: ${gitCurrentBranch.name}\n`;
    outputContent.innerHTML += `> Pull completed successfully\n`;
    outputContent.innerHTML += `> No new changes found\n`;
    outputContent.scrollTop = outputContent.scrollHeight;
}