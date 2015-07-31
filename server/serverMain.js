// Deployed at tracker.keyscores.com with >mup deploy

Meteor.methods({
    agg: function() {
      console.log("agg Start");

      results = Events.aggregate([{
        $group : {
            _id : "$name",
            new: { $sum: 1},
            count: { $sum: "$value"}
        }
      },
      //{$out : "agg"}
      //outputting to collection does not trigger the meteor magic. which woul be ideal. Instead need to loop throught

      ]);
      console.log("agg end");

      console.log("Persist agg -- START");
      AggCollection.remove({});
      results.forEach(function(el){
        AggCollection.insert({
          event: el._id,
          count: el.count,
          new: el.new
        });
        console.log("Persist agg -- END");
       }
     );
    },

    removeAgg: function(ts) {
      Agg.remove({});
    }
});

Meteor.startup(

  Meteor.call('agg');
)



// //SERVING FILES IN METEOR AN NEEDS ABSOLUTE PATH
// // Voodoo is needed to find the Meteor path whether online or in local dev.  Reference:http://stackoverflow.com/questions/17328807/what-is-the-meteor-server-side-path-to-public
// var fs = Npm.require('fs');
// var path = Npm.require('path');
// PATH_FOR_YOUR_APP = path.join(__meteor_bootstrap__.serverDir, "../web.browser/app")
//
// //USING IRON ROUTER TO SERVE STATIC FILES INSTEAD OF DEFAULT METEOR/PUBLIC, SO WE CAN GET THE QUERYSTRING PARAMS
// //Snowplow will fail silently if unsuccessful in downloading i pixel.
// //implementation from: http://stackoverflow.com/questions/31362749/meteor-js-serve-static-files-and-persist-query-string/31363579#31363579
// Router.route('track/:fileName', {where: 'server'})
//   .get(function () {
//     this.response.writeHead(200, {
//         'Content-type': 'image/png',
//         'Content-Disposition': "attachment; filename=" + this.params.fileName
//     });
//     fs.createReadStream(PATH_FOR_YOUR_APP+"/pixel/"+this.params.fileName).pipe(this.response);
//
//     //insert query string params
//
//     //params query is logging numbers as strings.
//     //console.log(EJSON.parse(this.params.query.dtm));
//     this.params.query.dtm = EJSON.parse(this.params.query.dtm)
//     // add date data from unix epoch
//     console.log(moment(this.params.query.dtm, "x").hour());
//     console.log(moment(this.params.query.dtm, "x").startOf("hour"));
//     console.log(moment(this.params.query.dtm, "x").startOf("hour").unix());
//
//     this.params.query.timestampBucket = {}
//     this.params.query.hour = moment(this.params.query.dtm, "x")
//                                              .startOf("hour")
//                                              .valueOf()
//     this.params.query.timestampBucket.day = moment(this.params.query.dtm, "x")
//                                             .startOf("day")
//                                             .valueOf()
//     Events.insert(this.params.query);
//
//     results = Events.aggregate([{
//       $group : {
//           _id : "$hour",
//           count: { $sum: 1}
//       }
//     }]);
//
//     results.forEach(function(el){
//       AggCollection.insert({
//         hour: el._id,
//         count: el.count
//       });
//     });
//
//
//   })
//
// /*
// //ALTERNATE IMPLEMENTATION WITH METEORHACKS PICKER ROUTER
//
// Picker.route('/track/i', function(params, req, res, next) {
//   Events.insert(params.query);
//   res.writeHead(200, {
//         'Content-type': 'image/png',
//         'Content-Disposition': "attachment; filename=i"
//     });
//    //console.log(path.join(__meteor_bootstrap__.serverDir, "../web.browser/app"));
//    //console.log(fs.lstatSync(__meteor_bootstrap__.serverDir, "../web.browser/app/pixel").isDirectory());
//   //TODO make fs return a buffer to res.write
//   res.write(fs.createReadStream(__meteor_bootstrap__.serverDir, "../web.browser/app/pixel/i"));
//   res.end();
// });
//
// */
//
// /* Lucas' experiment, logging all URLS called on meteor.
//
// WebApp.rawConnectHandlers.use(function (req, res, next) {
//   Log.info(req.connection.remoteAddress + ': ' + req.method + ' ' + req.url);
//   //Requests.insert({ip:req.connection.remoteAddress});
//   //Requests.insert({"ip":"req.connection.remoteAddress"});
//   next();
// });
//
// */
