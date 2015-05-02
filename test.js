'use strict';
var path = require('path');
var assert = require('assert');
var fs = require('fs');
var JSFtp = require('jsftp');
var Server = require('ftp-test-server');
var pathExists = require('path-exists');

JSFtp = require('./')(JSFtp);

var ftp;
var mockServer;
var testDir = '/foo/bar/baz';

before(function (cb) {
	mockServer = new Server();

	mockServer.init({
		user: 'test',
		pass: 'test'
	});

	mockServer.on('stdout', process.stdout.write.bind(process.stdout));
	mockServer.on('stderr', process.stderr.write.bind(process.stderr));

	setTimeout(function () {
		ftp = new JSFtp({
			host: 'localhost',
			port: 3334,
			user: 'test',
			pass: 'test'
		});

		cb();
	}, 500);
});

after(function () {
	mockServer.stop();
	fs.rmdirSync(path.join(__dirname, 'foo', 'bar', 'baz'));
	fs.rmdirSync(path.join(__dirname, 'foo', 'bar'));
	fs.rmdirSync(path.join(__dirname, 'foo'));
});

it('should decorate JSFtp', function () {
	assert.equal(typeof ftp.mkdirp, 'function');
});

it('should create nested directories', function (cb) {
	ftp.mkdirp(testDir, function (err) {
		assert(pathExists.sync(path.join(__dirname, testDir)));
		cb();
	});
});
