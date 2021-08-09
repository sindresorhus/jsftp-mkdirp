import {promisify} from 'node:util';
import parentDirs from 'parent-dirs';
import slash from 'slash';

async function mkdirp(directory) {
	if (typeof directory !== 'string') {
		throw new TypeError('`path` is required');
	}

	const directories = parentDirs(directory);

	// Skip root as it's always there.
	if (directories[directories.length - 1] === '/') {
		directories.pop();
	}

	if (directories.length === 0) {
		return;
	}

	const mkdir = async directory => {
		directory = slash(directory);

		try {
			await promisify(this.raw.bind(this))('mkd', directory);
		} catch (error) {
			if (error.code === 550 && directories.length > 0) {
				await mkdir(directories.pop());
				return;
			}

			error.message += ` - mkd: ${directory}`;
			throw error;
		}

		if (directories.length > 0) {
			await mkdir(directories.pop());
		}
	};

	const checkIfDirectoryExists = async directory => {
		directory = slash(directory);

		try {
			await promisify(this.raw.bind(this))('mlst', directory);
		} catch (error) {
			if (error.code === 550) {
				await mkdir(directory);
				return;
			}

			error.message += ` - mlst: ${directory}`;
			throw error;
		}

		if (directories.length > 0) {
			await checkIfDirectoryExists(directories.pop());
		}
	};

	await checkIfDirectoryExists(directories.pop());
}

export default function jsFtpMkdirp(JsFtp) {
	JsFtp.prototype = Object.create(JsFtp.prototype, {
		mkdirp: {
			value: mkdirp,
		},
	});
}
