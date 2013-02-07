<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Plugin manager class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlinePlugin extends Omeka_Plugin_AbstractPlugin
{


    // Hooks.
    protected $_hooks = array(
        'install',
        'uninstall',
        'define_acl',
        'define_routes',
        'initialize',
        'after_save_item'
    );


    // Filters.
    protected $_filters = array(
        'admin_navigation_main',
        'neatline_styles'
    );


    /**
     * Register a taggable style attribute.
     *
     * @param string $name The column name.
     * @param string $type The column definition.
     */
    public static function addStyle($name, $type)
    {

        $_db = get_db();

        try {

            // Add column to records table.
            $sql = "ALTER TABLE `{$_db->prefix}neatline_records`
                    ADD COLUMN {$name} {$type}";
            $_db->query($sql);

        } catch (Exception $e) {}

    }


    /**
     * Create tables.
     */
    public function hookInstall()
    {

        // Exhibits table.
        // ---------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_exhibits` (

            `id`                INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,

            `added`             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`          TIMESTAMP NULL,

            `title`             TINYTEXT NULL,
            `description`       TEXT NULL,
            `slug`              VARCHAR(100) NOT NULL,
            `public`            TINYINT(1) NOT NULL,
            `query`             TEXT NULL,
            `styles`            TEXT NULL,
            `map_focus`         VARCHAR(100) NULL,
            `map_zoom`          INT(10) UNSIGNED NULL,

             PRIMARY KEY        (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Records table.
        // --------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_records` (

            `id`                INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `item_id`           INT(10) UNSIGNED NULL,
            `exhibit_id`        INT(10) UNSIGNED NULL,

            `added`             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`          TIMESTAMP NULL,

            `title`             MEDIUMTEXT NULL,
            `_title`            MEDIUMTEXT NULL,
            `body`              MEDIUMTEXT NULL,
            `_body`             MEDIUMTEXT NULL,
            `coverage`          GEOMETRY NOT NULL,
            `slug`              VARCHAR(100) NULL,
            `tags`              TEXT NULL,

             PRIMARY KEY        (`id`),
             FULLTEXT KEY       (`_title`, `_body`, `slug`),
             SPATIAL INDEX      (`coverage`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Add styles.
        // -----------
        self::addStyle('presenter',         'VARCHAR(100) NULL');
        self::addStyle('vector_color',      'TINYTEXT NULL');
        self::addStyle('stroke_color',      'TINYTEXT NULL');
        self::addStyle('select_color',      'TINYTEXT NULL');
        self::addStyle('point_image',       'TINYTEXT NULL');
        self::addStyle('vector_opacity',    'INT(10) UNSIGNED NULL');
        self::addStyle('select_opacity',    'INT(10) UNSIGNED NULL');
        self::addStyle('stroke_opacity',    'INT(10) UNSIGNED NULL');
        self::addStyle('image_opacity',     'INT(10) UNSIGNED NULL');
        self::addStyle('stroke_width',      'INT(10) UNSIGNED NULL');
        self::addStyle('point_radius',      'INT(10) UNSIGNED NULL');
        self::addStyle('max_zoom',          'INT(10) UNSIGNED NULL');
        self::addStyle('min_zoom',          'INT(10) UNSIGNED NULL');
        self::addStyle('map_zoom',          'INT(10) UNSIGNED NULL');
        self::addStyle('map_focus',         'VARCHAR(100) NULL');

    }


    /**
     * Drop tables.
     */
    public function hookUninstall()
    {

        // Drop the exhibits table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_exhibits`";
        $this->_db->query($sql);

        // Drop the data table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_records`";
        $this->_db->query($sql);

    }


    /**
     * Define the ACL.
     *
     * @param array $args Zend_Acl instance under `acl` key.
     */
    public function hookDefineAcl($args)
    {

        $acl = $args['acl'];

        // Register exhibit and record resources.
        if (!$acl->has('NLExhibit')) $acl->addResource('NLExhibit');
        if (!$acl->has('NLRecord')) $acl->addResource('NLRecord');

        // Supers and admins can do everything.
        $acl->allow(array('super', 'admin'), 'NLExhibit');
        $acl->allow(array('super', 'admin'), 'NLRecord');

    }


    /**
     * Register routes.
     *
     * @param array $args Zend_Config instance under `router` key.
     */
    public function hookDefineRoutes($args)
    {
        $args['router']->addConfig(new Zend_Config_Ini(
            NL_DIR . '/routes.ini', 'routes')
        );
    }


    /**
     * Add translation source.
     */
    public function hookInitialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
    }


    /**
     * Propagate item changes to Neatline records.
     */
    public function hookAfterSaveItem($args)
    {
        $records = $this->_db->getTable('NeatlineRecord');
        $records->syncItem($args['record']);
    }


    /**
     * Add link to main admin menu bar.
     *
     * @param array $tabs Array of label => URI pairs.
     * @return array The tab array with the "Neatline" tab.
     */
    public function filterAdminNavigationMain($tabs)
    {
        $tabs[] = array('label' => 'Neatline', 'uri' => url('neatline'));
        return $tabs;
    }


    /**
     * Register the taggable styles.
     *
     * @param array $styles Array of label => column name pairs.
     * @return array The updated array.
     */
    public function filterNeatlineStyles($styles)
    {
        return array_merge($styles, array(
            'Presenter'         => 'presenter',
            'Shape Color'       => 'vector_color',
            'Line Color'        => 'stroke_color',
            'Selected Color'    => 'select_color',
            'Shape Opacity'     => 'vector_opacity',
            'Selected Opacity'  => 'select_opacity',
            'Line Opacity'      => 'stroke_opacity',
            'Image Opacity'     => 'image_opacity',
            'Line Width'        => 'stroke_width',
            'Point Radius'      => 'point_radius',
            'Point Image'       => 'point_image',
            'Min Zoom'          => 'min_zoom',
            'Max Zoom'          => 'max_zoom',
            'Default Focus'     => 'map_focus',
            'Default Zoom'      => 'map_zoom'
        ));
    }


}
