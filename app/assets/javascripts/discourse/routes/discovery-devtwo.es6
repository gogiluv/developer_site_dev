import OpenComposer from "discourse/mixins/open-composer";
import { defaultHomepage } from "discourse/lib/utilities";
import { ajax } from "discourse/lib/ajax";

const DiscoveryDevTwoRoute = Discourse.Route.extend(OpenComposer, {
  renderTemplate() {
    this.render("navigation/devtwo", { outlet: "navigation-bar" });
    this.render("discovery/devtwo", { outlet: "list-container" });
  },
  
  model() {
    return ajax('home_api');
  },
  actions: {
    createTopic() {
      const model = this.controllerFor("discovery/devtwo").get("model");      
      if (model.draft) {
        this.openTopicDraft(model);
      } else {
        this.openComposer(this.controllerFor("discovery/devtwo"));
      }
    }
  }
});

export default DiscoveryDevTwoRoute;
