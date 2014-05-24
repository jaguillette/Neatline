
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {


  // Read configuration files:
  var paths = grunt.file.readJSON('paths.json');
  var pkg = grunt.file.readJSON('package.json');

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  // Load the task configurations.
  require('load-grunt-config')(grunt, {

    loadGruntTasks: false,

    data: {
      paths: paths,
      pkg: pkg
    }

  });


};
