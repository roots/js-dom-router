import assert from 'assert';
import camelCase from '../utils/camelCase.js';

describe('camelCase', function() {
  it('should generally work', function() {
    [
      'foo bar', 'Foo bar', 'foo Bar', 'Foo Bar',
      'FOO BAR', 'fooBar', '--foo-bar--', '__foo_bar__'
    ].forEach(function(string) {
      assert.strictEqual(camelCase(string), 'fooBar');
      assert.strictEqual(camelCase(camelCase(string)), 'fooBar');
    });
  });

  it('should work with numbers', function() {
    assert.strictEqual(camelCase('12 feet'), '12Feet');
    assert.strictEqual(camelCase('enable 6h format'), 'enable6HFormat');
    assert.strictEqual(camelCase('enable 24H format'), 'enable24HFormat');
    assert.strictEqual(camelCase('too legit 2 quit'), 'tooLegit2Quit');
    assert.strictEqual(camelCase('walk 500 miles'), 'walk500Miles');
    assert.strictEqual(camelCase('xhr2 request'), 'xhr2Request');
  });

  it('should handle acronyms', function() {
    ['safe HTML', 'safeHTML'].forEach(function(string) {
      assert.strictEqual(camelCase(string), 'safeHtml');
    });

    ['escape HTML entities', 'escapeHTMLEntities'].forEach(function(string) {
      assert.strictEqual(camelCase(string), 'escapeHtmlEntities');
    });

    ['XMLHttpRequest', 'XmlHTTPRequest'].forEach(function(string) {
      assert.strictEqual(camelCase(string), 'xmlHttpRequest');
    });
  });
});
