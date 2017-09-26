'use babel';

import ShopifyHelperView from './shopify-helper-view';
import { CompositeDisposable } from 'atom';

export default {

  shopifyHelperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.shopifyHelperView = new ShopifyHelperView(state.shopifyHelperViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.shopifyHelperView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'shopify-helper:clean-text': () => this.clean(),
        'shopify-helper:paste-clean-text': () => this.paste()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.shopifyHelperView.destroy();
  },

  serialize() {
    return {
      shopifyHelperViewState: this.shopifyHelperView.serialize()
    };
  },

  cleanText(text) {
    // Clean out all the MS Word chars
    return text
      .split(' ').join(' ')
      .split('‘').join("'")
      .split('’').join("'")
      // Escape the double quotes
      .split('“').join('\\"')
      .split('”').join('\\"')
      .split('•').join('')
      .trim();
  },

  clean() {

    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      let cleansed = this.cleanText(selection);
      editor.insertText(cleansed);
    }
  },

  paste() {

    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      let clipboard = atom.clipboard.read();
      let cleansed = this.cleanText(clipboard);
      editor.insertText(cleansed);
    }
  }

};
