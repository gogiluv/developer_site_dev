// for more details see: http://emberjs.com/guides/models/defining-models/

Discourse.Shader = DS.Model.extend({
  userId: DS.attr('int'),
  fbxText: DS.attr('string'),
  vertexText: DS.attr('string'),
  fragmentText: DS.attr('string'),
  datGuiText: DS.attr('string'),
  imgUrl: DS.attr('string')
});
