import path from 'path';
import test from 'ava';
import JSFtp from 'jsftp';
import Server from 'ftp-test-server';
import pathExists from 'path-exists';
import delay from 'delay';
import del from 'del';
import m from '.';

m(JSFtp);

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
	del.sync('foo');
});

test.serial('decorate JSFtp', t => {
	t.is(typeof ftp.mkdirp, 'function');
});

test.serial('fail if no path is provided', async t => {
	await t.throws(ftp.mkdirp(), '`path` is required');
});

test.serial('create nested directories', async t => {
	await ftp.mkdirp(testDir);
	t.true(await pathExists(path.join(__dirname, testDir)));
});

test.serial('mkdirp on directories that already exist', async t => {
	await t.notThrows(ftp.mkdirp(testDir));
});
