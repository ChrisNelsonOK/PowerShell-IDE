// PowerShell/Batch Visual IDE - Script Analysis and Linting

// PowerShell Script Analyzer rules
const powershellRules = {
    // PSAvoidUsingCmdletAliases
    aliasRules: [
        { alias: 'gci', fullName: 'Get-ChildItem', message: 'Avoid using the alias \'gci\'. Use the full cmdlet name \'Get-ChildItem\' instead.' },
        { alias: 'ls', fullName: 'Get-ChildItem', message: 'Avoid using the alias \'ls\'. Use the full cmdlet name \'Get-ChildItem\' instead.' },
        { alias: 'dir', fullName: 'Get-ChildItem', message: 'Avoid using the alias \'dir\'. Use the full cmdlet name \'Get-ChildItem\' instead.' },
        { alias: 'gi', fullName: 'Get-Item', message: 'Avoid using the alias \'gi\'. Use the full cmdlet name \'Get-Item\' instead.' },
        { alias: 'gp', fullName: 'Get-ItemProperty', message: 'Avoid using the alias \'gp\'. Use the full cmdlet name \'Get-ItemProperty\' instead.' },
        { alias: 'gwmi', fullName: 'Get-WmiObject', message: 'Avoid using the alias \'gwmi\'. Use the full cmdlet name \'Get-WmiObject\' instead.' },
        { alias: 'cd', fullName: 'Set-Location', message: 'Avoid using the alias \'cd\'. Use the full cmdlet name \'Set-Location\' instead.' },
        { alias: 'chdir', fullName: 'Set-Location', message: 'Avoid using the alias \'chdir\'. Use the full cmdlet name \'Set-Location\' instead.' },
        { alias: 'sl', fullName: 'Set-Location', message: 'Avoid using the alias \'sl\'. Use the full cmdlet name \'Set-Location\' instead.' },
        { alias: 'echo', fullName: 'Write-Output', message: 'Avoid using the alias \'echo\'. Use the full cmdlet name \'Write-Output\' instead.' },
        { alias: 'write', fullName: 'Write-Output', message: 'Avoid using the alias \'write\'. Use the full cmdlet name \'Write-Output\' instead.' },
        { alias: 'cat', fullName: 'Get-Content', message: 'Avoid using the alias \'cat\'. Use the full cmdlet name \'Get-Content\' instead.' },
        { alias: 'type', fullName: 'Get-Content', message: 'Avoid using the alias \'type\'. Use the full cmdlet name \'Get-Content\' instead.' },
        { alias: 'gc', fullName: 'Get-Content', message: 'Avoid using the alias \'gc\'. Use the full cmdlet name \'Get-Content\' instead.' },
        { alias: 'cp', fullName: 'Copy-Item', message: 'Avoid using the alias \'cp\'. Use the full cmdlet name \'Copy-Item\' instead.' },
        { alias: 'copy', fullName: 'Copy-Item', message: 'Avoid using the alias \'copy\'. Use the full cmdlet name \'Copy-Item\' instead.' },
        { alias: 'mv', fullName: 'Move-Item', message: 'Avoid using the alias \'mv\'. Use the full cmdlet name \'Move-Item\' instead.' },
        { alias: 'move', fullName: 'Move-Item', message: 'Avoid using the alias \'move\'. Use the full cmdlet name \'Move-Item\' instead.' },
        { alias: 'rm', fullName: 'Remove-Item', message: 'Avoid using the alias \'rm\'. Use the full cmdlet name \'Remove-Item\' instead.' },
        { alias: 'del', fullName: 'Remove-Item', message: 'Avoid using the alias \'del\'. Use the full cmdlet name \'Remove-Item\' instead.' },
        { alias: 'erase', fullName: 'Remove-Item', message: 'Avoid using the alias \'erase\'. Use the full cmdlet name \'Remove-Item\' instead.' },
        { alias: 'ri', fullName: 'Remove-Item', message: 'Avoid using the alias \'ri\'. Use the full cmdlet name \'Remove-Item\' instead.' },
        { alias: 'select', fullName: 'Select-Object', message: 'Avoid using the alias \'select\'. Use the full cmdlet name \'Select-Object\' instead.' },
        { alias: 'sort', fullName: 'Sort-Object', message: 'Avoid using the alias \'sort\'. Use the full cmdlet name \'Sort-Object\' instead.' },
        { alias: 'where', fullName: 'Where-Object', message: 'Avoid using the alias \'where\'. Use the full cmdlet name \'Where-Object\' instead.' },
        { alias: '?', fullName: 'Where-Object', message: 'Avoid using the alias \'?\'. Use the full cmdlet name \'Where-Object\' instead.' },
        { alias: 'foreach', fullName: 'ForEach-Object', message: 'Avoid using the alias \'foreach\'. Use the full cmdlet name \'ForEach-Object\' instead.' },
        { alias: '%', fullName: 'ForEach-Object', message: 'Avoid using the alias \'%\'. Use the full cmdlet name \'ForEach-Object\' instead.' }
    ],
    
    // PSAvoidUsingPositionalParameters
    positionalParameterPattern: /^(\s*)([\w\-]+)\s+([^-\s][^\s]+)/,
    positionalParameterMessage: 'Avoid using positional parameters. Use named parameters instead.',
    
    // PSAvoidUsingInvokeExpression
    invokeExpressionPattern: /Invoke-Expression|IEX/i,
    invokeExpressionMessage: 'Avoid using Invoke-Expression as it can expose your script to code injection attacks.',
    
    // PSAvoidUsingPlainTextForPassword
    plainTextPasswordPattern: /\-Password\s+["']?[^"']+["']?|\-Credential\s+["']?[^"']+["']?/i,
    plainTextPasswordMessage: 'Avoid using plain text for passwords or credentials. Use SecureString instead.',
    
    // PSAvoidUsingWriteHost
    writeHostPattern: /Write-Host/i,
    writeHostMessage: 'Avoid using Write-Host. Use Write-Output, Write-Verbose, or Write-Information instead.',
    
    // PSAvoidUsingEmptyCatchBlock
    emptyCatchPattern: /catch\s*{\s*}/i,
    emptyCatchMessage: 'Avoid using empty catch blocks. Handle or re-throw the exception.',
    
    // PSUseDeclaredVarsMoreThanAssignments
    declaredVarsPattern: /\$([a-zA-Z0-9_]+)\s*=\s*[^=]/g,
    
    // PSUseSingularNouns
    pluralNounPattern: /function\s+\w+-(\w+s)\b/i,
    pluralNounMessage: 'Use singular nouns for function names. PowerShell cmdlets use singular nouns.',
    
    // PSUseApprovedVerbs
    approvedVerbs: [
        'Add', 'Clear', 'Close', 'Copy', 'Enter', 'Exit', 'Find', 'Format', 'Get', 'Hide', 'Join', 'Lock', 'Move', 'New',
        'Open', 'Optimize', 'Pop', 'Push', 'Redo', 'Remove', 'Rename', 'Reset', 'Resize', 'Search', 'Select', 'Set',
        'Show', 'Skip', 'Split', 'Step', 'Switch', 'Undo', 'Unlock', 'Watch', 'Write'
    ],
    verbNounPattern: /function\s+([A-Z][a-z]+)-([A-Za-z]+)/g,
    verbNounMessage: 'Use approved verbs in function names. See Get-Verb for a list of approved verbs.'
};

// Batch script linting rules
const batchRules = {
    // Avoid using deprecated commands
    deprecatedCommandsPattern: /\b(APPEND|FASTOPEN|GRAPHICS|JOIN|LOADFIX|LOADHIGH|SUBST)\b/i,
    deprecatedCommandsMessage: 'Avoid using deprecated commands.',
    
    // Use EXIT /B instead of just EXIT
    exitPattern: /\bEXIT\b(?!\s+\/B)/i,
    exitMessage: 'Use EXIT /B to exit the batch script without closing the command prompt window.',
    
    // Use SETLOCAL/ENDLOCAL for variable scope
    setLocalPattern: /\bSET\b.*=/i,
    setLocalMissingPattern: /\bSETLOCAL\b/i,
    setLocalMessage: 'Consider using SETLOCAL/ENDLOCAL to limit the scope of variables.',
    
    // Use double quotes around paths
    pathWithoutQuotesPattern: /\b(CD|COPY|DEL|MOVE|REN|XCOPY)\b\s+([^"\n]+\s+[^"\n]+)/i,
    pathWithoutQuotesMessage: 'Use double quotes around paths with spaces.',
    
    // Use error handling
    errorHandlingPattern: /\bIF\s+(?:NOT\s+)?\bERRORLEVEL\b/i,
    errorHandlingMissingMessage: 'Consider adding error handling with IF ERRORLEVEL.',
    
    // Use comments for documentation
    commentPattern: /\bREM\b|::/i,
    commentMissingMessage: 'Add comments to document your batch script.'
};

// Analyze PowerShell script
function analyzePowerShellScript(content) {
    const lines = content.split('\n');
    const markers = [];
    
    // Track declared variables to check for unused variables
    const declaredVars = new Map();
    const usedVars = new Set();
    
    lines.forEach((line, i) => {
        // Check for cmdlet aliases
        powershellRules.aliasRules.forEach(rule => {
            const aliasRegex = new RegExp(`\\b${rule.alias}\\b`, 'i');
            if (aliasRegex.test(line)) {
                markers.push({
                    severity: monaco.MarkerSeverity.Warning,
                    message: rule.message,
                    startLineNumber: i + 1,
                    startColumn: line.indexOf(line.match(aliasRegex)[0]) + 1,
                    endLineNumber: i + 1,
                    endColumn: line.indexOf(line.match(aliasRegex)[0]) + rule.alias.length + 1
                });
            }
        });
        
        // Check for positional parameters
        const positionalMatch = line.match(powershellRules.positionalParameterPattern);
        if (positionalMatch && !line.trim().startsWith('#')) {
            markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: powershellRules.positionalParameterMessage,
                startLineNumber: i + 1,
                startColumn: positionalMatch.index + positionalMatch[1].length + 1,
                endLineNumber: i + 1,
                endColumn: positionalMatch.index + positionalMatch[0].length + 1
            });
        }
        
        // Check for Invoke-Expression
        const invokeMatch = line.match(powershellRules.invokeExpressionPattern);
        if (invokeMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: powershellRules.invokeExpressionMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(invokeMatch[0]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(invokeMatch[0]) + invokeMatch[0].length + 1
            });
        }
        
        // Check for plain text passwords
        const passwordMatch = line.match(powershellRules.plainTextPasswordPattern);
        if (passwordMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: powershellRules.plainTextPasswordMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(passwordMatch[0]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(passwordMatch[0]) + passwordMatch[0].length + 1
            });
        }
        
        // Check for Write-Host
        const writeHostMatch = line.match(powershellRules.writeHostPattern);
        if (writeHostMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Information,
                message: powershellRules.writeHostMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(writeHostMatch[0]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(writeHostMatch[0]) + writeHostMatch[0].length + 1
            });
        }
        
        // Check for empty catch blocks
        const emptyCatchMatch = line.match(powershellRules.emptyCatchPattern);
        if (emptyCatchMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: powershellRules.emptyCatchMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(emptyCatchMatch[0]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(emptyCatchMatch[0]) + emptyCatchMatch[0].length + 1
            });
        }
        
        // Track declared variables
        let varMatch;
        while ((varMatch = powershellRules.declaredVarsPattern.exec(line)) !== null) {
            declaredVars.set(varMatch[1], i + 1);
        }
        
        // Track used variables
        const usedVarMatches = line.match(/\$([a-zA-Z0-9_]+)/g);
        if (usedVarMatches) {
            usedVarMatches.forEach(match => {
                usedVars.add(match.substring(1));
            });
        }
        
        // Check for plural nouns in function names
        const pluralMatch = line.match(powershellRules.pluralNounPattern);
        if (pluralMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Information,
                message: powershellRules.pluralNounMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(pluralMatch[1]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(pluralMatch[1]) + pluralMatch[1].length + 1
            });
        }
        
        // Check for approved verbs
        let verbNounMatch;
        while ((verbNounMatch = powershellRules.verbNounPattern.exec(line)) !== null) {
            const verb = verbNounMatch[1];
            if (!powershellRules.approvedVerbs.includes(verb)) {
                markers.push({
                    severity: monaco.MarkerSeverity.Warning,
                    message: powershellRules.verbNounMessage,
                    startLineNumber: i + 1,
                    startColumn: line.indexOf(verb) + 1,
                    endLineNumber: i + 1,
                    endColumn: line.indexOf(verb) + verb.length + 1
                });
            }
        }
    });
    
    // Check for unused variables
    declaredVars.forEach((lineNumber, varName) => {
        if (!usedVars.has(varName)) {
            markers.push({
                severity: monaco.MarkerSeverity.Information,
                message: `Variable $${varName} is declared but never used.`,
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: 2
            });
        }
    });
    
    return markers;
}

// Analyze Batch script
function analyzeBatchScript(content) {
    const lines = content.split('\n');
    const markers = [];
    
    let hasSetLocal = false;
    let hasErrorHandling = false;
    let hasComments = false;
    
    lines.forEach((line, i) => {
        // Check for deprecated commands
        const deprecatedMatch = line.match(batchRules.deprecatedCommandsPattern);
        if (deprecatedMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: batchRules.deprecatedCommandsMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(deprecatedMatch[0]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(deprecatedMatch[0]) + deprecatedMatch[0].length + 1
            });
        }
        
        // Check for EXIT without /B
        const exitMatch = line.match(batchRules.exitPattern);
        if (exitMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: batchRules.exitMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(exitMatch[0]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(exitMatch[0]) + exitMatch[0].length + 1
            });
        }
        
        // Check for SETLOCAL
        if (line.match(batchRules.setLocalMissingPattern)) {
            hasSetLocal = true;
        }
        
        // Check for paths without quotes
        const pathMatch = line.match(batchRules.pathWithoutQuotesPattern);
        if (pathMatch) {
            markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: batchRules.pathWithoutQuotesMessage,
                startLineNumber: i + 1,
                startColumn: line.indexOf(pathMatch[2]) + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf(pathMatch[2]) + pathMatch[2].length + 1
            });
        }
        
        // Check for error handling
        if (line.match(batchRules.errorHandlingPattern)) {
            hasErrorHandling = true;
        }
        
        // Check for comments
        if (line.match(batchRules.commentPattern)) {
            hasComments = true;
        }
    });
    
    // Check for missing SETLOCAL
    if (!hasSetLocal) {
        const setLocalMatches = lines.filter(line => line.match(batchRules.setLocalPattern));
        if (setLocalMatches.length > 0) {
            markers.push({
                severity: monaco.MarkerSeverity.Information,
                message: batchRules.setLocalMessage,
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 2
            });
        }
    }
    
    // Check for missing error handling
    if (!hasErrorHandling) {
        markers.push({
            severity: monaco.MarkerSeverity.Information,
            message: batchRules.errorHandlingMissingMessage,
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 2
        });
    }
    
    // Check for missing comments
    if (!hasComments) {
        markers.push({
            severity: monaco.MarkerSeverity.Information,
            message: batchRules.commentMissingMessage,
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 2
        });
    }
    
    return markers;
}

// Analyze script based on language
function analyzeScript(content, language) {
    if (language === 'powershell') {
        return analyzePowerShellScript(content);
    } else if (language === 'batch') {
        return analyzeBatchScript(content);
    }
    return [];
}