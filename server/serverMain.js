Meteor.startup(function () {
  idealButBrokenCollection.remove({});
  worksButNotIdealCollection.remove({});
});

//Check if the server is receiving the changes
// The changes to IdealCollection are not observable on the server. Only on restarting the server will you see the console.log below


worksButNotIdealCollection.find({}).observeChanges({
  added: function (id, fields){
    console.log(fields);
  }
});

worksButNotIdealCollection.find({}).observeChanges({
  added: function (id, fields){
    console.log(fields);
  }
});

Meteor.methods({
    //This is the method which reproduces the bug using collection.aggregate()
    idealButBrokenMethod: function() {
      console.log("idealButBrokenMethod -- Single step Aggregation -- START");

      Events.aggregate([
      {
        $group : {
            _id : "$name",
            new: { $sum: 1},
            count: { $sum: "$value"}
        }
      },
      // CRUCIALLY using $out will allow all calculations to happen on the mongo instance. The notIdealMethod below, will pull
      // data back in to the webapp and then return it to mongo.
      {
        $out : "idealcollection"
      }
      //outputting to collection does not trigger the meteor magic. Which would be ideal. $out seems to be the issue.

      ]);
      console.log("idealButBrokenMethod -- Single step Aggregation -- END");
    },

    //This method does worth but it is expensive since it involves a round trip from mongo to the web app
    worksButNotIdealMethod: function() {
      console.log("START -- worksButNotIdealMethod - 1 Aggregate");

      results = Events.aggregate([{
        $group : {
            _id : "$name",
            aggregated: { $sum: "$value"}
        }
      }]);

      console.log("END -- worksButNotIdealMethod - 1 Aggregate");


      //This section shows the workaround which is necessary.
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
    }

});
