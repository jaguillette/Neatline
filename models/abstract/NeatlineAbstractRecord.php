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

abstract class Neatline_AbstractRecord extends Omeka_Record_AbstractRecord
{


    /**
     * Set a field if the passed value is not whitespace.
     *
     * @param string $key The name of the field.
     * @param boolean $val The value to set.
     */
    public function setNotEmpty($key, $val)
    {
        if (is_string($val) && trim($val) == '') $this->$key = null;
        else $this->$key = $val;
    }


    /**
     * Before saving, update the `modified` timestamp.
     *
     * @return array The array representation of the record fields.
     */
    public function toArrayForSave()
    {
        $fields = parent::toArray();
        $fields['modified'] = new Zend_Db_Expr('NOW()');
        return $fields;
    }


    /**
     * Insert or update the record.
     *
     * @param boolean $throwIfInvalid
     */
    public function save($throwIfInvalid = true)
    {

        $args = array(
            'post'    => $this->_postData ? $this->_postData : false,
            'insert'  => !$this->exists()
        );

        $this->runCallbacks('beforeSave', $args);
        $this->id = $this->insertOrUpdate($this->toArrayForSave());
        $this->runCallbacks('afterSave', $args);

    }


    /**
     * Insert or update the record. Approach based on:
     * https://gist.github.com/1942116
     *
     * @param array $values The record values.
     */
    public function insertOrUpdate(array $values)
    {

        $table = $this->getTable();
        $db = $table->getAdapter();

        $cols = array();
        $vals = array();
        $bind = array();
        $set  = array();

        // Build column and value arrays.
        foreach ($values as $col => $val) {
            $cols[] = $db->quoteIdentifier($col, true);
            if ($val instanceof Zend_Db_Expr) {
                $vals[] = $val->__toString();
            } else {
                $vals[] = '?';
                $bind[] = $val;
            }
        }

        // Build update assignments.
        foreach ($cols as $i => $col) {
            $set[] = sprintf('%s = %s', $col, $vals[$i]);
        }

        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s) ON DUPLICATE KEY UPDATE %s;",
            $db->quoteIdentifier($table->getTableName(), true),
            implode(', ', $cols),
            implode(', ', $vals),
            implode(', ', $set)
        );

        // Query, return insert id.
        $db->query($sql, array_merge($bind, $bind));
        return (int) $db->lastInsertId();

    }


}
