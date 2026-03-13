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

            const map = {
                'bg-white ': 'bg-white dark:bg-neutral-900 ',
                'bg-white"': 'bg-white dark:bg-neutral-900"',
                'bg-white/80 ': 'bg-white/80 dark:bg-black/80 ',
                'bg-white/90 ': 'bg-white/90 dark:bg-neutral-900/90 ',
                'text-neutral-900 ': 'text-neutral-900 dark:text-white ',
                'text-neutral-900"': 'text-neutral-900 dark:text-white"',
                'text-neutral-800 ': 'text-neutral-800 dark:text-neutral-100 ',
                'text-neutral-800"': 'text-neutral-800 dark:text-neutral-100"',
                'text-neutral-700 ': 'text-neutral-700 dark:text-neutral-200 ',
                'text-neutral-700"': 'text-neutral-700 dark:text-neutral-200"',
                'text-neutral-600 ': 'text-neutral-600 dark:text-neutral-300 ',
                'text-neutral-600"': 'text-neutral-600 dark:text-neutral-300"',
                'text-neutral-500 ': 'text-neutral-500 dark:text-neutral-400 ',
                'text-neutral-500"': 'text-neutral-500 dark:text-neutral-400"',
                'text-neutral-400 ': 'text-neutral-400 dark:text-neutral-500 ',
                'text-neutral-400"': 'text-neutral-400 dark:text-neutral-500"',

                'border-neutral-200 ': 'border-neutral-200 dark:border-neutral-800 ',
                'border-neutral-200"': 'border-neutral-200 dark:border-neutral-800"',
                'border-neutral-100 ': 'border-neutral-100 dark:border-neutral-800 ',
                'border-neutral-100"': 'border-neutral-100 dark:border-neutral-800"',

                'bg-neutral-50 ': 'bg-neutral-50 dark:bg-neutral-900 ',
                'bg-neutral-50"': 'bg-neutral-50 dark:bg-neutral-900"',
                'bg-neutral-100 ': 'bg-neutral-100 dark:bg-neutral-800 ',
                'bg-neutral-100"': 'bg-neutral-100 dark:bg-neutral-800"'
            };

            for (const [key, value] of Object.entries(map)) {
                // simple split/join replacement
                content = content.split(key).join(value);
            }

            if (content !== fs.readFileSync(fullPath, 'utf8')) {
                fs.writeFileSync(fullPath, content, 'utf8');
                modified = true;
                console.log('Added dark variants: ' + fullPath);
            }
        }
    });
}

processDir(path.join(__dirname, 'src/app'));
console.log('Done mapping dark variants!');
