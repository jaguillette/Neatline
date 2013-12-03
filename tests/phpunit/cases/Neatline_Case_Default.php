<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Default extends Neatline_Case_Abstract
{


    /**
     * Install plugins listed in `plugins.ini`, alias tables.
     */
    public function setUp()
    {

        parent::setUp();

        // If a `plugins.ini` file is provided.
        if (file_exists(NL_TEST_DIR.'/plugins.ini')) {

            // Parse `plugins.ini`.
            $config = new Zend_Config_Ini(NL_TEST_DIR.'/plugins.ini');

            // Install each of the siblings.
            if (!is_null($config->plugins)) {
                foreach ($config->plugins as $plugin) {
                    $this->_installPluginOrSkip($plugin);
                }
            }

        }

        // Get plugin tables.
        $this->_exhibits = $this->db->getTable('NeatlineExhibit');
        $this->_records  = $this->db->getTable('NeatlineRecord');

        // Register script path.
        get_view()->addScriptPath(NL_DIR.'/views/shared');

    }


    /**
     * Get the Jasmine fixtures directory.
     *
     * @return string The directory.
     */
    protected function _getFixturesPath()
    {
        return NL_DIR.'/tests/jasmine/fixtures/';
    }


}
