
Template.hello.helpers({
  events:function () {
    return EJSON.stringify(Events.find().fetch(), {indent: true});

  },
  agg: function () {
    return IdealCollection.find().fetch()[0].count
  },
  alternate: function () {
    //return EJSON.stringify(NotIdealCollection.find().fetch(), {indent: true});
    return NotIdealCollection.find().fetch()[0].count
  }
});

Template.hello.events({
  "click #button": function(){
    Events.insert({name:"d",value:4});
    Meteor.call("idealWay");
    Meteor.call("notIdeal");
  }
});
