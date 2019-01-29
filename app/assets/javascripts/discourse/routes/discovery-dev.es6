import OpenComposer from "discourse/mixins/open-composer";
import { defaultHomepage } from "discourse/lib/utilities";
import { ajax } from "discourse/lib/ajax";

const DiscoveryDevRoute = Discourse.Route.extend(OpenComposer, {
  renderTemplate() {
    this.render("navigation/dev", { outlet: "navigation-bar" });
    this.render("discovery/dev", { outlet: "list-container" });
  },
  
  model() {
    return ajax('dev_home');
  },
  actions: {
    createTopic() {
      const model = this.controllerFor("discovery/dev").get("model");      
      if (model.draft) {
        this.openTopicDraft(model);
      } else {
        this.openComposer(this.controllerFor("discovery/dev"));
      }
    }
  }
});

export default DiscoveryDevRoute;
