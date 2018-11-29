import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({  

  init() {
    //console.log('confluence list init!');    
    this._super(...arguments);    
    this.sendAction();    
  },

  actions: {
    goPage(page) {
      //in full-page-searh
      this.confluence_goPage(page);
    }
  }
});
