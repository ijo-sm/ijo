const fs = require("fs");

/**
 * Asynchronously returns the statistics object for the specified path.
 * @param {String} path The path to get the statistics object for.
 * @returns {Promise<fs.Stats>} A promise that resolves with the statistics object.
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
 * @param {String} path The path to check if it is a folder.
 * @returns {Promise<Boolean>} A promise that resolves with if the path is a folder or not.
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
 * @param {String} path The path to create a folder at.
 * @returns {Promise} A promise that is resolved when the folder has been created.
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
 * @param {String} path The path to check if it is a file.
 * @returns {Promise<Boolean>} A promise that resolves with if the path is a file or not.
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
 * @param {String} path The path to check if it exists.
 * @returns {Boolean} If the path exists or not.
 */
const exists = path => {
	return fs.existsSync(path);
}

/**
 * Asynchronously returns all the files and folders in the specified folder. This is not done recursively.
 * @param {String} path The path of the directory to read.
 * @returns {Promise<Array<String>>} A promise that resolves with an array of files and directories inside the given 
 * path.
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