const fs = require('fs');
const rimraf = require('rimraf');
const unzipper = require('unzipper');

// =============================================================================
// Paths
// =============================================================================

const paths = {
    archive: 'icomoon.zip',
    build: 'selection.build.json',
    src: 'selection.json',
    tmp: 'tmp',
};

const getPath = (type) => {
    const dir = process.argv[2] || __dirname;
    return `${dir}/${paths[type]}`;
}

Object.keys(paths).forEach(type => {
    paths[type] = getPath(type);
});

// =============================================================================
// Utils
// =============================================================================

const sortObject = (obj) => {
    const result = {};
    Object.keys(obj).sort(key => {
        result[key] = obj[key];
    });
    return result;
}

const parseSelection = (selection) => {
    const result = {};
    const { icons } = selection;

    icons.forEach(icon => {
        const { name } = icon.properties;
        const { paths, width } = icon.icon;

        const key = name.split(',')[0];

        result[key] = { paths, width };
    });

    return sortObject(result);
};

const printMessage = (msg, isOk) => {
    if (isOk) {
        console.log('\x1b[32m%s\x1b[0m', msg);
    } else {
        console.warn('\x1b[31m%s\x1b[0m', msg);
    }
};

// =============================================================================
// Script
// =============================================================================

fs.createReadStream(paths.archive)
    .on('error', (err) => {
        if (err.code === 'ENOENT') {
            printMessage(`No icomoon archive on path ${paths.archive}`);
        } else {
            console.warn(err);
            printMessage('Unknown error');
        }
    })
    .pipe(unzipper.Parse())
    .on('entry', async entry => {
        if (entry.path === 'selection.json') {
            const content = await entry.buffer();
            const selection = JSON.parse(content.toString());
            const parsed = parseSelection(selection);
            fs.writeFile(paths.build, JSON.stringify(parsed, null, 2), function() {
                fs.unlinkSync(paths.archive);
                fs.writeFile(paths.src, JSON.stringify(selection, null, 2), function() {
                    rimraf(paths.tmp, function() {
                        printMessage(`${Object.values(parsed).length} icons.`, true);
                    });
                });
            });
        } else {
            entry.autodrain();
        }
    })
;
