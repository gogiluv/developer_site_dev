export default Ember.Controller.extend({
  discoveryDev2: Ember.inject.controller("discovery/dev2"),

  draft: function() {    
    console.log(this.get("discoveryDev2.model.draft"));
    return this.get("discoveryDev2.model.draft");    
  }.property("discoveryDev2.model", "discoveryDev2.model.draft"),

  canCreateTopic: function() {  
    console.log('bbbbbbbbbbb');
    return this.get("discoveryDev2.model.can_create_topic");
  }.property("discoveryDev2.model", "discoveryDev2.model.can_create_topic")
});
