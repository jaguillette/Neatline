<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecord extends Neatline_AbstractRecord
{


    public $item_id;        // INT(10) UNSIGNED NULL
    public $exhibit_id;     // INT(10) UNSIGNED NULL
    public $added;          // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    public $modified;       // TIMESTAMP NULL
    public $title;          // MEDIUMTEXT NULL
    public $_title;         // MEDIUMTEXT NULL
    public $body;           // MEDIUMTEXT NULL
    public $_body;          // MEDIUMTEXT NULL
    public $coverage;       // GEOMETRY NOT NULL
    public $tags;           // TEXT NULL


    private $styles = array();


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null, $item = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
        if (!is_null($item)) $this->item_id = $item->id;
    }


    /**
     * Add a key-value pair to `styles`.
     *
     * @param string $name The attribute name.
     * @param mixed $value The value.
     */
    public function __set($name, $value)
    {
        $this->styles[$name] = $value;
    }


    /**
     * Get style property.
     *
     * @param string $name The attribute name.
     * @param mixed $name The value.
     */
    public function __get($name)
    {
        return $this->styles[$name];
    }


    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record The parent exhibit.
     */
    public function getExhibit()
    {
        $exhibits = $this->getTable('NeatlineExhibit');
        return $exhibits->find($this->exhibit_id);
    }


    /**
     * Assemble record data for the front-end application.
     *
     * @return array The data array.
     */
    public function buildJsonData() {
        return array_merge(parent::toArray(), $this->styles);
    }


    /**
     * Save data from a POST or PUT request.
     *
     * @param array $values The POST/PUT values.
     */
    public function saveForm($values)
    {

        // Store the original tags string.
        $oldTags = _nl_explode($this->tags);

        // Mass-assign the form values.
        foreach ($values as $k => $v) $this->setNotEmpty($k, $v);

        // If 1 or more tags have been added to the record since the last
        // time it was saved, pull in the _existing_ CSS rules for those
        // tags onto the record before using the record to update the CSS.
        // Otherwise, the existing styles set for the tag(s) in the CSS
        // and on other records with the tag(s) would be clobbered in the
        // next step by the current values on the record being saved.
        // The intuition here is that adding a new tag to a record should
        // have the effect of making the record _conform_ to the already-
        // established styling of other records with that tag - instead of
        // changing the other records to look like this record.
        $newTags = _nl_explode($this->tags);
        $this->pullStyles(array_diff($newTags, $oldTags));
        $this->save();

        // For each of the tags defined on the record, update the rule-set
        // for that tag in the exhibit CSS (if one exists) with the values
        // defined on the record.
        $exhibit = $this->getExhibit();
        $exhibit->pullStyles($this);
        $exhibit->save();

        // Once the exhibit CSS has been updated with the record values,
        // propagate the new rules to all other records in the exhibit.
        $exhibit->pushStyles();

    }


    /**
     * Before saving, replace the raw value of `coverage` with the MySQL
     * expression to set the `GEOMETRY` value. If `coverage` is undefined,
     * use `POINT(0 0)` as a de facto "null" value (ignored in queries).
     *
     * @return array The array representation of the record fields.
     */
    public function toArrayForSave()
    {

        $fields = parent::toArrayForSave();

        // Add the coverage.
        if (!empty($fields['coverage'])) {
            $fields['coverage'] = new Zend_Db_Expr(
                "GeomFromText('{$fields['coverage']}')"
            );
        } else {
            $fields['coverage'] = new Zend_Db_Expr(
                "GeomFromText('POINT(0 0)')"
            );
        }

        return array_merge($fields, $this->styles);

    }


    /**
     * Update record styles to match exhibit CSS. For example, if `styles`
     * on the parent exhibit is:
     *
     * .tag1 {
     *   vector-color: #111111;
     * }
     * .tag2 {
     *   stroke-color: #222222;
     * }
     *
     * And `array('tag1', 'tag2')` is passed, `vector_color` should be set
     * to '#111111' and `stroke_color` to '#222222'.
     *
     * @param array $tags An array of tags to pull.
     */
    public function pullStyles($tags)
    {
        // Parse the stylesheet.
        $css = _nl_readCSS($this->getExhibit()->styles);

        // Gather style columns.
        $valid = _nl_getStyles();

        // For each CSS-styled tag.
        foreach ($css as $selector => $rules) {

            // If the tag has been requested.
            if (in_array($selector, $tags)) {

                // Apply the CSS rules to the record.
                foreach ($rules as $prop => $val) {
                    if (in_array($prop, $valid)) $this->$prop = $val;
                }

            }

        }

    }


    /**
     * Compile Omeka item references. Supported syntax:
     *
     * `[item]`
     * `[item:"<element>"]`
     * `[item:files]`
     *
     */
    public function compile() {

        // Copy raw -> compiled.
        $fields = array('title' => '_title', 'body' => '_body');
        foreach ($fields as $s => $t) $this->$t = $this->$s;

        // Break if no parent item.
        if (is_null($this->item_id)) return;

        // Get the item, set view directory.
        $item = get_record_by_id('Item', $this->item_id);
        get_view()->setScriptPath(VIEW_SCRIPTS_DIR);

        foreach ($fields as $src => $tar) {

            // `[item]`
            $texts = all_element_texts($item);
            $this->$tar = str_replace('[item]', $texts, $this->$tar);

            // `[item:"<element>"]`
            $re = "/\[item:\"(?P<el>[a-zA-Z\s]+)\"\]/";
            preg_match_all($re, $this->$tar, $matches);

            foreach ($matches['el'] as $el) {
                $text = metadata($item, array('Dublin Core', $el));
                $re = "/\[item:\"{$el}\"\]/";
                $this->$tar = preg_replace($re, $text, $this->$tar);
            }

            // `[item:files]`
            $files = files_for_item(array(), array(), $item);
            $this->$tar = str_replace('[item:files]', $files,
                $this->$tar);

        }

    }


    /**
     * Expose unmodified save (used for testing).
     */
    public function __save() {
        parent::save();
    }


    /**
     * Compile `title` and `body` before saving.
     */
    public function save() {
        $this->compile();
        parent::save();
    }


}
