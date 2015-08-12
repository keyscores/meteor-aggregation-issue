Meteor.startup(function () {
  // clean start
  idealButBrokenCollection.remove({});
  worksButNotIdealCollection.remove({});
  Events.remove({});
  // These are the fixtures to test the aggregation
  Events.insert({name:"a",value:1});
  Events.insert({name:"b",value:2});
  Events.insert({name:"c",value:3});

  Events.insert({name:"a",value:1});
  Events.insert({name:"b",value:2});
  Events.insert({name:"c",value:3});
});

// OBSERVECHANGES on SERVER
//Check if the server is receiving the changes (in case its just a UI thing)
// The changes to IdealCollection are not observable on the server. Only on restarting the server will you see the console.log below
worksButNotIdealCollection.find({}).observeChanges({
  added: function (_id, aggregated){
    console.log(aggregated);
  }
});
// nothing gets observed from this collection when aggregate.({$out}) is used
idealButBrokenCollection.find({}).observeChanges({
  added: function (id, aggregated){
    console.log(aggregated);
  }
});

// AGGREGATION METHODS
Meteor.methods({
    //This is the method which reproduces the bug using collection.aggregate()
    idealButBrokenMethod: function() {
      console.log("START -- idealButBrokenMethod -- Single step Aggregation");
      Events.aggregate([
        {
          $group : {
            _id : "$name",
            aggregated: { $sum: "$value"}
          }
        },
        // IDEALLY Using $out would allow all calculations to happen on the mongo server.
        // The worksButNotIdealMethod below, will pull
        // data back in to the webapp and then return it to mongo.
        // outputting to collection does not trigger the meteor magic.
        {
         $out : "idealcollection"
        }
      ]);
      console.log("END -- idealButBrokenMethod -- Single step Aggregation");
    },
    //This method does work but it is expensive since it involves a round trip from mongo to the web app
    worksButNotIdealMethod: function() {
      console.log("START -- worksButNotIdealMethod - 1 Aggregate");
      results = Events.aggregate([{
        $group : {
            _id : "$name",
            aggregated: { $sum: "$value"}
        }
      }]);
      console.log("END -- worksButNotIdealMethod - 1 Aggregate");

      // This section shows the workaround which is necessary to make it reactive.
      // This means parsing 'results' from pipeline.
      console.log("START -- worksButNotIdealMethod -- 2 Return to Web app Persist");
      worksButNotIdealCollection.remove({});
      results.forEach(function(el){
        worksButNotIdealCollection.insert({
          event: el._id,
          aggregated: el.aggregated
          })
        }
      );
      console.log("END -- worksButNotIdealMethod -- 2 Return to Web app Persist")
    },
    reset: function(){
      idealButBrokenCollection.remove({});
      worksButNotIdealCollection.remove({});
    }
});
