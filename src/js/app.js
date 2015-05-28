/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var timeline = require('timeline');

var destinations = [
  {
    title:     "Pakhuis de Zwijger",
    latitude:  52.376862,
    longitude: 4.922077
  },
  {
    title:     "Amsterdam RAI",
    latitude:  52.3441698,
    longitude: 4.889183
  }
];
var menu = new UI.Menu({
sections: [{
  items: destinations
}]
});

menu.on('select', function(e) {
    Vibe.vibrate('short');
    console.log("Vibrate short");
    var item = destinations[e.itemIndex];
    console.log("To: " + item.title + ", Lat: " + item.latitude + ", Long: " + item.longitude);

    var card = new UI.Card({
        /*
        titleColor: 'white',
        subtitleColor: 'white',
        bodyColor: 'white',
        backgroundColor: 'blue'
         */
    });
    card.title(item.title);

    ajax({ url: 'http://link0.net/uber/?start=' + '' + '&stop=' + item.latitude + ',' + item.longitude, type: 'json' },
         function(data) {
           console.log('Received data.');

           card.subtitle(data[0].low + '-' + data[0].high + ' ' + data[0].currency_code);
           card.body("\nOrder?");
           card.show();

           card.on('click', 'select', function(e) {
               console.log("Order call received");
               foo = new UI.Card();
               foo.title("Ordering...");
               foo.show();
               console.log("foo showed");

               ajax({
                   url: 'http://link0.net/uber/req.php?',
                   type: 'json'
               }, function(requestData) {
                   var eta = requestData.eta * 60;

                   function translateEta(eta) {
                       var minutes;
                       var seconds;

                       if(eta > 60) {
                           seconds = eta % 60;
                           minutes = (eta - seconds) / 60;
                       } else {
                           minutes = 0;
                           seconds = eta;
                       }
                        return "ETA: " + minutes + ":" + seconds;
                   }

                   requestCompleted = new UI.Card();
                   requestCompleted.title(data[0].service);
                   requestCompleted.subtitle(translateEta(eta));
                   requestCompleted.body(requestData.vehicle.make + ' ' + requestData.vehicle.model + "\n" + requestData.vehicle.license_plate);
                   requestCompleted.show();

                   /*setTimeout(function() {
                       console.log(eta);
                       requestCompleted.subtitle(translateEta(eta));
                       requestCompleted.show();
                       eta--;
                   }, 1000);*/
               });
           });
         },  // End of success callback

         function(error) {
           console.log('Error receiving uber data.');
           main.body("Could not download posts.\n\nShake to try refreshing again.");
         }   // End of error callback
    );
});
  
menu.show();

/*main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});*/
/*
main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/
