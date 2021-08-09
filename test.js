import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import JSFtp from 'jsftp';
import Server from 'ftp-test-server';
import pathExists from 'path-exists';
import delay from 'delay';
import del from 'del';
import jsFtpMkdirp from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

jsFtpMkdirp(JSFtp);

const testDirectory = '/foo/bar/baz';

let mockServer;
let ftp;

test.before(async () => {
	mockServer = new Server();

	mockServer.init({
		user: 'test',
		pass: 'test',
	});

	mockServer.on('stdout', process.stdout.write.bind(process.stdout));
	mockServer.on('stderr', process.stderr.write.bind(process.stderr));

	await delay(500);

	ftp = new JSFtp({
		host: 'localhost',
		port: 3334,
		user: 'test',
		pass: 'test',
	});
});

test.after(() => {
	mockServer.stop();
	del.sync('foo');
});

test.serial('decorate JSFtp', t => {
	t.is(typeof ftp.mkdirp, 'function');
});

test.serial('fail if no path is provided', async t => {
	await t.throwsAsync(ftp.mkdirp(), {message: '`path` is required'});
});

test.serial('create nested directories', async t => {
	await ftp.mkdirp(testDirectory);
	t.true(await pathExists(path.join(__dirname, testDirectory)));
});

test.serial('mkdirp on directories that already exist', async t => {
	await t.notThrowsAsync(ftp.mkdirp(testDirectory));
});
