
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Record browser tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records', function() {

  var editor, records;

  var json = {
    status: 200, responseText: readFixtures('editor-records.json')
  };

  // Get fixtures.
  beforeEach(function() {

    // Load partial.
    loadFixtures('editor-partial.html');
    jasmine.Ajax.useMock();

    // Run Editor.
    _t.loadEditor();
    var request = mostRecentAjaxRequest();
    request.response(json);

    // Get records and editor.
    records = _t.records.$el.find('.record-row');
    editor = $('#editor');

  });

  it('should list records', function() {

    // 2 records in browser pane.
    expect(records.length).toEqual(2);
    expect($(records[0]).text()).toEqual('Record 1');
    expect($(records[1]).text()).toEqual('Record 2');

  });

  it('should open form when a record row is clicked', function() {

    // Click on Record1.
    $(records[0]).trigger('click');

    // Check for form and no records.
    expect(editor).toContain(_t.form.form);
    expect(_t.form.head.text()).toEqual('Record 1');
    expect(editor).not.toContain('ul.records');
    expect(editor).not.toContain('li.record-row');

    // Close Record 1.
    _t.form.closeButton.trigger('click');

    // 2 records in browser pane.
    expect(records.length).toEqual(2);
    expect($(records[0]).text()).toEqual('Record 1');
    expect($(records[1]).text()).toEqual('Record 2');

    // Open Record 2.
    records = _t.records.$el.find('.record-row');
    $(records[1]).trigger('click');

    // Check for form and no records.
    expect(editor).toContain(_t.form.form);
    expect(_t.form.head.text()).toEqual('Record 2');
    expect(editor).not.toContain('ul.records');
    expect(editor).not.toContain('li.record-row');

  });

});
