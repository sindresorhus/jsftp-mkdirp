# jsftp-mkdirp [![Build Status](https://travis-ci.org/sindresorhus/jsftp-mkdirp.svg?branch=master)](https://travis-ci.org/sindresorhus/jsftp-mkdirp)

> Recursively create nested directories with [jsftp](https://github.com/sergi/jsftp), like [mkdirp](https://github.com/substack/node-mkdirp)

FTP can natively create only one directory at the time.

Useful for being able to upload files to deep paths without knowing if the directories exists beforehand.


## Install

```
$ npm install --save jsftp-mkdirp
```


## Usage

```js
var JSFtp = require('jsftp');

// decorate `JSFtp` with a new method `mkdirp`
JSFtp = require('jsftp-mkdirp')(JSFtp);

var path = 'public_html/deploy/foo/bar';

ftp.mkdirp(path, function (err) {
	console.log('Created path:', path);
});
```


## API

### JSFtp.mkdirp(path, callback)

#### path

*Required*  
Type: `string`

Path of the nested directories you want to create.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
