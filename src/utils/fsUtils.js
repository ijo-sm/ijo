const fs = require("fs");

const stat = path => {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if(err) reject(err);
			else resolve(stats);
		});
	});
}

const isFolder = path => {
	return new Promise((resolve, reject) => {
		stat(path)
		.then(stats => resolve(stats.isDirectory()))
		.catch(err => reject(err));
	});
};

const createFolder = path => {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, err => {
			if(err) reject(err);
			else resolve();
		});
	});
}

const isFile = path => {
	return new Promise((resolve, reject) => {
		stat(path)
		.then(stats => resolve(stats.isFile()))
		.catch(err => reject(err));
	});
};

const exists = path => {
	return fs.existsSync(path);
}

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