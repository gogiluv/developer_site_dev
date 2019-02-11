import OpenComposer from "discourse/mixins/open-composer";
import { defaultHomepage } from "discourse/lib/utilities";
import { ajax } from "discourse/lib/ajax";

const DiscoveryDevOneRoute = Discourse.Route.extend(OpenComposer, {
  renderTemplate() {
    this.render("navigation/devone", { outlet: "navigation-bar" });
    this.render("discovery/devone", { outlet: "list-container" });
  },
  
  model() {
    return ajax('home_api');
  },
  actions: {
    createTopic() {
      const model = this.controllerFor("discovery/devone").get("model");
      if (model.draft) {
        this.openTopicDraft(model);
      } else {
        this.openComposer(this.controllerFor("discovery/devone"));
      }
    }
  }
});

export default DiscoveryDevOneRoute;
