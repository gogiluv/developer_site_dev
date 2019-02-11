export default Ember.Controller.extend({
  discoveryDev: Ember.inject.controller("discovery/devone"),

  draft: function() {
    return this.get("discoveryDev.model.draft");    
  }.property("discoveryDev.model", "discoveryDev.model.draft"),

  canCreateTopic: function() {  
    return this.get("discoveryDev.model.can_create_topic");
  }.property("discoveryDev.model", "discoveryDev.model.can_create_topic"),
});
