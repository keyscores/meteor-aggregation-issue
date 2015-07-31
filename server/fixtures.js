if Events.find().fetch().count() ===0 {
  Events.insert({name:"a",value:"1"});
  Events.insert({name:"b",value:"2"});
  Events.insert({name:"c",value:"3"});
} else {
  return "Fixtures previously inserted, skipping."
}
