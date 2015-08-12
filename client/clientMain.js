Template.hello.helpers({
  worksButNotIdealHelper: function () {
    query = EJSON.stringify(worksButNotIdealCollection.find({event:"c"}).fetch()[0])
    if (query) {
      return query;
    }
    else {
      return "No collection exists yet, push the button"
    }
  },
  idealButBrokenHelper: function () {
    query =  EJSON.stringify(idealButBrokenCollection.find({_id:"c"}).fetch()[0])
    if (query) {
      return query;
    }
    else {
      return "Error: cannot read the collection idealButBrokenCollection. Check mongo console with >meteor mongo"
    }
  },
  showIdealButBrokenCollection: function (){
    return EJSON.stringify(idealButBrokenCollection.find().fetch());
  }
});

Template.hello.events({
  "click #works": function(){
    Meteor.call("worksButNotIdealMethod");
  },

  "click #broken": function(){
    Meteor.call("idealButBrokenMethod");
  },

  "click #add": function(){
    idealButBrokenCollection.insert({_id:"new record", value:200});

  },
  "click #remove": function(){
    idealButBrokenCollection.remove({_id:"a"});
  },
  "click #reset": function(){
    Meteor.call("reset");
  }
});
