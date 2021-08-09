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
import JsFtp from 'jsftp';
import JsFtpMkdirp from 'jsftp-mkdirp';

// Decorate `JSFtp` with a new method `mkdirp`
JsFtpMkdirp(JSFtp);

const ftp = new JsFtp({
	host: 'myserver.com'
});

const path = 'public_html/deploy/foo/bar';

await ftp.mkdirp(path);
console.log('Created path:', path);
```

## API

### JsFtp.mkdirp(path)

Returns a `Promise`.

#### path

Type: `string`

The path of the nested directories you want to create.
