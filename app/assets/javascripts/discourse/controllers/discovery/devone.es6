import computed from "ember-addons/ember-computed-decorators";
import DiscoveryController from "discourse/controllers/discovery";
import { ajax } from "discourse/lib/ajax";

const subcategoryStyleComponentNames = {
  rows: "categories_only",
  rows_with_featured_topics: "categories_with_featured_topics",
  boxes: "categories_boxes",
  boxes_with_featured_topics: "categories_boxes_with_topics"
};

export default DiscoveryController.extend({
  discovery: Ember.inject.controller(),
  // this makes sure the composer isn't scoping to a specific category
  category: null,  
  guide_is_open: true,

  actions: {
    go_to(url){
	    location.href=url;
    },
    
    show_tip(event){
	    $(event.target.parentNode.children[2]).fadeIn();
    },
    hide_tip(event){
	    $(event.target.parentNode.children[2]).fadeOut();
    },
    guide_tab(event) {
      this.toggleProperty('guide_is_open');
    }
  }
});
