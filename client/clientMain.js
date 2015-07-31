
Template.hello.helpers({
  events:function () {
        return EJSON.stringify(Events.find().fetch(), {indent: true});
  },
  agg: function () {
    return EJSON.stringify(Agg.find().fetch(), {indent: true});
  },
  alterate: function () {
    return EJSON.stringify(Alternate.find().fetch(), {indent: true});
  }
});

Template.hello.rendered = function () {
	Tracker.autorun(function () {
  });
}
