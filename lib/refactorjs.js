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
      'refactorjs:commit': () => this.commit()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.refactorjsView.destroy();
  },

  serialize() {
    return {
      refactorjsViewState: this.refactorjsView.serialize()
    };
  },

  commit() {
    console.log('woahs')
    if (this.modalPanel.isVisible()) {
      this.refactorjsView.commit();
      this.modalPanel.hide();
    }
  },

  toggle() {
    console.log('Refactorjs was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show(), this.refactorjsView.focus(), this.refactorjsView.search()
    );
  }

};
