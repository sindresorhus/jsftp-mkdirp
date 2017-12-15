'use strict';
const parentDirs = require('parent-dirs');
const slash = require('slash');
const pify = require('pify');

function mkdirp(dir) {
	if (typeof dir !== 'string') {
		return Promise.reject(new Error('`path` is required'));
	}

	const dirs = parentDirs(dir);

	// Skip root as it's always there
	if (dirs[dirs.length - 1] === '/') {
		dirs.pop();
	}

	if (dirs.length === 0) {
		return Promise.resolve();
	}

	const mkdir = dir => {
		dir = slash(dir);

		return pify(this.raw.bind(this))('mkd', dir)
			.then(() => dirs.length > 0 && mkdir(dirs.pop()))
			.catch(err => {
				if (err.code === 550 && dirs.length > 0) {
					return mkdir(dirs.pop());
				}

				err.message += ` - mkd: ${dir}`;
				throw err;
			});
	};

	const checkIfDirExists = dir => {
		dir = slash(dir);

		return pify(this.raw.bind(this))('mlst', dir)
			.then(() => dirs.length > 0 && checkIfDirExists(dirs.pop()))
			.catch(err => {
				if (err.code === 550) {
					return mkdir(dir);
				}

				err.message += ` - mlst: ${dir}`;
				throw err;
			});
	};

	return checkIfDirExists(dirs.pop());
}

module.exports = JSFtp => {
	JSFtp.prototype = Object.create(JSFtp.prototype, {
		mkdirp: {
			value: mkdirp
		}
	});
};
