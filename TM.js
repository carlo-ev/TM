if (Meteor.isClient) {

  Template.intro.events({
    'click .btn.btn-default': function () {
      console.log(UI.getElement(".jumbotron"));
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
