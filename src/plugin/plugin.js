/**
 * This is the model class for a plugin.
 */
class Plugin {
    /**
     * Creates the plugin with the specified data.
     * @param {Object} data The data for the plugin.
     * @param {String} data.name The name of the plugin.
     * @param {Array<String>} data.dependencies The dependencies for the plugin.
     * @param {String} author The name of the author of the plugin.
     * @param {String} path The path to the plugin. 
     */
	constructor({name, dependencies, author, path} = {}) {
        this.name = name;
        this.dependencies = dependencies;
        this.author = author;
        this.path = path;
    }

    /**
     * Adds all the dependencies recursively to this plugin using .getTrueDependencies.
     * @param {Array<Plugin>} plugins The array of possible dependencies.
     */
    addTrueDependencies(plugins) {
        this.trueDependencies = this.getTrueDependencies(plugins);
    }

    /**
	 * Recursively get the dependencies of the supplied list of dependencies. These "true" dependencies are then 
	 * returned as a flattened array.
     * @param {Array<Plugin>} plugins The array of possible dependencies.
     * @returns {Array<String>} The list of this plugin's true dependencies.
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