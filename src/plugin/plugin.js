/**
 * This is the model class for a plugin.
 */
class Plugin {
	constructor({name, dependencies, author, path} = {}) {
        this.name = name;
        this.dependencies = dependencies;
        this.author = author;
        this.path = path;
    }

    addTrueDependencies(plugins) {
        this.trueDependencies = this.getTrueDependencies(plugins);
    }

    /**
	 * Recursively get the dependencies of the supplied list of dependencies. These "true" dependencies are then 
	 * returned as a flattened array.
	 */
    getTrueDependencies(plugins) {
        const trueDependencies = [];

		for(const dependency of this.dependencies) {
			trueDependencies.push(dependency);
			trueDependencies.push(...this.getTrueDependencies(plugins, plugins.find(plugin => plugin.name === dependency).dependencies));
		}

		return trueDependencies;
    }
}

module.exports = Plugin;