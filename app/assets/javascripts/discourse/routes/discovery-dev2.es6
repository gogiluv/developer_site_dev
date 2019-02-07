import OpenComposer from "discourse/mixins/open-composer";
import { defaultHomepage } from "discourse/lib/utilities";
import { ajax } from "discourse/lib/ajax";

const DiscoveryDev2Route = Discourse.Route.extend(OpenComposer, {
  renderTemplate() {
    this.render("navigation/dev2", { outlet: "navigation-bar" });
    this.render("discovery/dev2", { outlet: "list-container" });
  },
  
  model() {
    console.log(ajax('home_api'));
    return ajax('home_api');
  },
  actions: {
    createTopic() {
      const model = this.controllerFor("discovery/dev2").get("model");      
      if (model.draft) {
        this.openTopicDraft(model);
      } else {
        this.openComposer(this.controllerFor("discovery/dev2"));
      }
    }
  }
});

export default DiscoveryDev2Route;
