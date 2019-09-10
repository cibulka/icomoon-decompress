Simple build tool to unzip icon archive from [icomoon.io](https://icomoon.io) and remove unused properties from `selection.json`.

## Instalation

`npm install icomoon-decompress --save-dev`

## Usage

`node index.js <directory>`

`<directory>` is path to directory containing [icomoon.io](https://icomoon.io) zip archive.

Additionaly you can add a custom script to your `package.json` and than run it with `npm run icons`:

```
{
	"name": "your-project",
	...
	"scripts": {
		"icons": "node node_modules/icomoon-decompress <directory>"
	}
	...
}
```

## Test the library

Place icon archive `icomoon.zip` to `/test` folder and run `npm test`.

## Caution

`icomoon.zip` is deleted after the script's successful run. This should not be a problem for you as your project remains at Icomoon's app.

Also, use this at your own risk. It is a very basic util meant just for me.