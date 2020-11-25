const fs = require("fs");

/**
 * Asynchronously returns the statistics object for the specified path.
 */
const stat = path => {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if(err) reject(err);
			else resolve(stats);
		});
	});
}

/**
 * Asynchronously returns if the specified path is a folder.
 */
const isFolder = path => {
	return new Promise((resolve, reject) => {
		stat(path)
		.then(stats => resolve(stats.isDirectory()))
		.catch(err => reject(err));
	});
};

/**
 * Asynchronously creates a folder at the specified path.
 */
const createFolder = path => {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, err => {
			if(err) reject(err);
			else resolve();
		});
	});
}

/**
 * Asynchronously returns if the specified path is a file.
 */
const isFile = path => {
	return new Promise((resolve, reject) => {
		stat(path)
		.then(stats => resolve(stats.isFile()))
		.catch(err => reject(err));
	});
};

/**
 * Synchronously returns if the specified path exists (for both folders and files).
 */
const exists = path => {
	return fs.existsSync(path);
}

/**
 * Asynchronously returns all the files and folders in the specified folder. This is not done recursively.
 */
const readdir = path => {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => {
			if(err) reject(err);
			else resolve(files);
		});
	});
}

module.exports = {
	stat, isFolder, createFolder, isFile, exists, readdir
}