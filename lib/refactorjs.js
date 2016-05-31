'use babel';

import RefactorjsView from './refactorjs-view';
import { CompositeDisposable } from 'atom';

export default {

  refactorjsView: null,
  modalPanel: null,
subscriptions: null,

  activate(state) {
    this.refactorjsView = new RefactorjsView(state.refactorjsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.refactorjsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'refactorjs:toggle': () => this.toggle(),
      'refactorjs:commit': () => this.commit(),
      'refactorjs:focus-next': () => this.focusNext(),
      'refactorjs:hide': () => this.modalPanel.hide()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.refactorjsView.destroy();
  },

  focusNext() {
    this.refactorjsView.focusNext();
  },

  serialize() {
    return {
      refactorjsViewState: this.refactorjsView.serialize()
    };
  },

  commit() {
    if (this.modalPanel.isVisible()) {
      this.refactorjsView.commit();
      this.modalPanel.hide();
    }
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show(), this.refactorjsView.focus(), this.refactorjsView.search()
    );
  }

};
