'use babel';

import grasp from 'grasp';

function htmlify(value) {
  return value.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp; &nbsp;').replace(/\s/g, '&nbsp;');
}

export default class RefactorjsView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('refactorjs');

    // Create message element
    const form = document.createElement('form');

    const searchText = document.createElement('div');
    searchText.textContent = 'Search for:';
    searchText.classList.add('message');
    form.appendChild(searchText);

    var editor = atom.workspace.getActivePane().getActiveEditor();

    this.searchInput = document.createElement('atom-text-editor');
    this.searchInput.addMiniAttribute();
    this.searchEvent = this.searchInput.getModel().onDidChange(this.search.bind(this));

    form.appendChild(this.searchInput);

    const replaceText = document.createElement('div');
    replaceText.textContent = 'Replace with:';
    replaceText.classList.add('message');
    form.appendChild(replaceText);

    this.replaceInput = document.createElement('atom-text-editor');
    this.replaceInput.addMiniAttribute();
    this.replaceEvent = this.replaceInput.getModel().onDidChange(this.search.bind(this));

    form.appendChild(this.replaceInput);
    this.element.appendChild(form);
  }

  search () {
    var editor = atom.workspace.getActivePane().getActiveEditor();
    var s = this.searchInput.getModel().getText();
    var r = this.replaceInput.getModel().getText();
    var code = editor.getText();

    var equerySearch = grasp.search('equery');

    var oldResult = this.element.querySelector('.result');
    if (oldResult) this.element.removeChild(oldResult);

    var result = document.createElement('div');
    result.classList.add('result')
    var list = document.createDocumentFragment();

    try {
      equerySearch(s, code).forEach((node) => {
        var li = document.createElement('div');
        li.classList.add('result-item')
        var val = code.substring(node.start, node.end);
        var start = code.substring(0, node.start).lastIndexOf('\n') + 1;
        var end = code.substr(node.end).indexOf('\n') + node.end;
        li.innerHTML = '<em>Line ' + node.loc.start.line + ':</em><span>' +
          htmlify(code.substring(start, node.start)) + '<strong>' +
          htmlify(grasp.replace('equery', s, r, val)) + '</strong>' +
          htmlify(code.substring(node.end, end)) + '</span>';
        list.appendChild(li);
      });
    } catch (e) {
      var error = document.createElement('div');
      error.innerHTML = htmlify(e.stack);
      list.appendChild(error);
    }
    result.appendChild(list);
    this.element.appendChild(result);
  }

  commit() {
      var editor = atom.workspace.getActivePane().getActiveEditor();
      var s = this.searchInput.getModel().getText();
      var r = this.replaceInput.getModel().getText();
      var code = editor.getText();
      editor.setText(grasp.replace('equery', s, r, code));
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.searchEvent.destroy();
    this.replaceEvent.destroy();
  }

  focus() {
    var editor = atom.workspace.getActivePane().getActiveEditor();
    var s = editor.getSelectedText() || editor.getWordUnderCursor();
    this.searchInput.getModel().setText(s);
    this.replaceInput.getModel().setText(s);
    this.replaceInput.getModel().selectAll();
    this.replaceInput.focus();
  }

  getElement() {
    return this.element;
  }
}
