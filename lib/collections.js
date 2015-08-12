//Canonical events to be aggregated, inserted from fixtures.js
Events = new Mongo.Collection("events");

//Collection that the desired "best practice" aggregation should use.
idealButBrokenCollection = new Mongo.Collection("idealcollection");

//Collection which a non-ideal yet workable solution can use.
worksButNotIdealCollection = new Mongo.Collection("notidealcollection");
