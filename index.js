const fs = require('fs');
const rimraf = require('rimraf');
const unzipper = require('unzipper');

const parseSelection = (selection) => {
	const result = {};
	const { icons } = selection;

	icons.forEach(icon => {
		const { name } = icon.properties;
		const { paths, width } = icon.icon;

		result[name] = { paths, width };
	});

	return result;
};

const getPath = (subPath) => {
	const dir = process.argv[2] || __dirname;
	console.log(`${dir}/${subPath}`);
	return `${dir}/${subPath}`;
}

fs.createReadStream(getPath('icomoon.zip'))
	.pipe(unzipper.Parse())
	.on('entry', async entry => {
		if (entry.path === 'selection.json') {
			const content = await entry.buffer();
			const selection = JSON.parse(content.toString());
			const parsed = parseSelection(selection);
			fs.writeFile(getPath('selection.build.json'), JSON.stringify(parsed, null, 2), function() {
				fs.unlinkSync(getPath('icomoon.zip'));
				fs.writeFile(getPath('selection.json'), JSON.stringify(selection, null, 2), function() {
					rimraf(getPath('tmp'), function() {
						console.log(`<<< Selection built [${Object.values(parsed).length}].`);
					});
				});
			});
		} else {
			entry.autodrain();
		}
	})
;
