if (Meteor.isClient) {
   Template.intro();
}
file:///home/carlo/Documents/TM/TM.js
file:///home/carlo/Documents/TM/TM.html

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}