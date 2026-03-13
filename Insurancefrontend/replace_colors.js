const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace slate, gray, zinc, neutral, stone with neutral/black hues
            // User requested violet, white, black. We'll use neutral scale to represent shades of white/black
            content = content.replace(/slate-/g, 'neutral-');
            content = content.replace(/slate-900/g, 'black');
            content = content.replace(/slate-800/g, 'black');
            content = content.replace(/slate-50/g, 'neutral-50');

            // Replace brand colors
            content = content.replace(/indigo-/g, 'violet-');
            content = content.replace(/purple-/g, 'violet-');
            content = content.replace(/cyan-/g, 'violet-');
            content = content.replace(/teal-/g, 'violet-');
            content = content.replace(/emerald-/g, 'violet-');
            content = content.replace(/blue-/g, 'violet-');

            // Add dark mode classes automatically in generic ways, or we can handle that manually.
            // Let's just do a basic replace for colors first.

            if (content !== fs.readFileSync(fullPath, 'utf8')) {
                fs.writeFileSync(fullPath, content, 'utf8');
                modified = true;
                console.log('Modified: ' + fullPath);
            }
        }
    });
}

processDir(path.join(__dirname, 'src/app'));
console.log('Done!');
