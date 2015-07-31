
Template.hello.helpers({
  events:function () {
    return EJSON.stringify(Events.find().fetch(), {indent: true});

  },
  agg: function () {
    return EJSON.stringify(IdealCollection.find().fetch(), {indent: true});
  },
  alternate: function () {
    return EJSON.stringify(NotIdealCollection.find().fetch(), {indent: true});
    //return NotIdealCollection.find().fetch()[0].count
  }
});

Template.hello.events({
  "click #button": function(){
    Events.insert({name:"d",value:4});
    Meteor.call("idealMethod");
    Meteor.call("notIdealMethod");
  },
  "click #button2": function(){
    IdealCollection.insert({_id:"a", value:200});

  },
  "click #button3": function(){
    IdealCollection.remove({_id:"a"});
  }

});
