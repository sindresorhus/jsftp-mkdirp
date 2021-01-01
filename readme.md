# jsftp-mkdirp

> Recursively create nested directories with [jsftp](https://github.com/sergi/jsftp), like [mkdirp](https://github.com/substack/node-mkdirp)

FTP can natively create only one directory at the time.

Useful for being able to upload files to deep paths without knowing if the directories exists beforehand.


## Install

```
$ npm install jsftp-mkdirp
```


## Usage

```js
const JSFtp = require('jsftp');

// Decorate `JSFtp` with a new method `mkdirp`
require('jsftp-mkdirp')(JSFtp);

const ftp = new JSFtp({
	host: 'myserver.com'
});

const path = 'public_html/deploy/foo/bar';

(async () => {
	await ftp.mkdirp(path);
	console.log('Created path:', path);
});
```


## API

### JSFtp.mkdirp(path)

Returns a Promise.

#### path

Type: `string`

Path of the nested directories you want to create.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
