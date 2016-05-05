import path from 'path';
import fs from 'fs';
import test from 'ava';
import JSFtpRaw from 'jsftp';
import Server from 'ftp-test-server';
import pathExists from 'path-exists';
import delay from 'delay';
import m from './';

const JSFtp = m(JSFtpRaw);

let ftp;
let mockServer;
const testDir = '/foo/bar/baz';

test.before(async () => {
	mockServer = new Server();

	mockServer.init({
		user: 'test',
		pass: 'test'
	});

	mockServer.on('stdout', process.stdout.write.bind(process.stdout));
	mockServer.on('stderr', process.stderr.write.bind(process.stderr));

	await delay(500);

	ftp = new JSFtp({
		host: 'localhost',
		port: 3334,
		user: 'test',
		pass: 'test'
	});
});

test.after(() => {
	mockServer.stop();
	fs.rmdirSync(path.join(__dirname, 'foo', 'bar', 'baz'));
	fs.rmdirSync(path.join(__dirname, 'foo', 'bar'));
	fs.rmdirSync(path.join(__dirname, 'foo'));
});

test('decorate JSFtp', t => {
	t.is(typeof ftp.mkdirp, 'function');
});

test('fail if no path is provided', t => {
	t.throws(ftp.mkdirp(), '`path` is required');
});

test('create nested directories', async t => {
	await ftp.mkdirp(testDir);
	t.true(await pathExists(path.join(__dirname, testDir)));
});
