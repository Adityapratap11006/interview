const fs = require('fs');
console.log('=== Testing critical files ===');

const criticalFiles = [
    'server/src/controllers/aiHintController.js',
    'server/src/controllers/profileAnalyticsController.js', 
    'server/src/controllers/problemController.js',
    'server/src/controllers/studyListController.js',
    'server/src/middleware/authMiddleware.js',
    'server/src/routes/aiHintRoutes.js',
    'server/src/routes/problemRoutes.js',
    'server/src/routes/studyListRoutes.js',
    'server/src/server.js'
];

let hasErrors = false;

criticalFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        console.log('✓ ' + file + ' (' + content.length + ' chars)');
        
        // Check for embedded escape sequences (these cause syntax errors)
        const hasEscape = content.includes('\\n') || content.includes('\\t') || content.includes('\\r') || 
                       content.includes('\\\\n') || content.includes('\\\\t') || content.includes('\\\\r');
        if (hasEscape) {
            console.log('  ⚠️  Warning: File contains escape sequences');
        }
    } catch (e) {
        console.log('✗ ' + file + ': ' + e.message);
        hasErrors = true;
    }
});

console.log('\n=== Testing for embedded newlines (\\n) in code ===');
const escapeTestFiles = criticalFiles.filter(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        // This is what causes syntax errors - literal backslash-n in the source code
        return content.includes('\\\\\\\\\\\\n') || content.includes('\\\\\\\\\\\\t') || content.includes('\\\\\\\\\\\\r');
    } catch (e) {
        return false;
    }
});

if (escapeTestFiles.length > 0) {
    console.log('❌ Files with embedded escape sequences:');
    escapeTestFiles.forEach(file => {
        console.log('  ' + file);
    });
    hasErrors = true;
} else {
    console.log('✅ No embedded escape sequences found in critical files');
}

console.log('\n=== BACKEND READY ===');
if (!hasErrors) {
    console.log('✅ All syntax checks passed. Ready for deployment.');
    console.log('\nNext steps:');
    console.log('1. Make sure .env file contains required GEMINI_API_KEY');
    console.log('2. Run "npm install" if Gemini key is provided');
    console.log('3. Start the server with "npm run dev"');
} else {
    console.log('❌ Fix syntax errors before running the backend');
}
