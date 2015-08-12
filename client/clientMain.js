Template.hello.helpers({
  worksButNotIdealHelper: function () {
    if ( worksButNotIdealCollection.find({event:"c"}).fetch() ) {
      return EJSON.stringify(worksButNotIdealCollection.find({event:"c"}).fetch()[0]);
    }
    else {
      return "No collection exists yet, push the button"
    }
  },
  idealButBrokenHelper: function () {
    if ( EJSON.stringify(idealButBrokenCollection.find({_id:"c"}).fetch()[0]) ) {
      return EJSON.stringify(idealButBrokenCollection.find({_id:"c"}).fetch()[0]);
    }
    else {
      return "Error, the collection created by $out is not accessible"
    }
  },
  showIdealCollectionRecord: function (){
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
  }
});
