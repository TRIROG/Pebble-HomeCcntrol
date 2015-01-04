var Vibe = require('ui/vibe');
var ajax = require('ajax');
var UI = require('ui');

// Make a list of menu items

//Sobe
var rooms = [
  {
    title: "Special 433",
  },
  {
    title: "Vse",
    body: "all"
  },

  {
    title: "Pritlicje",
    body: "0n"
  },
  {
    title: "Dnevna soba",
    body: "d0"
  },
  {
    title: "Kuhinja",
    body: "k0"
  },
  {
    title: "Predsoba",
    body: "ps"
  },
  {
    title: "1. nadstropje",
    body: "1n"
  },
  {
    title: "Spalnica",
    body: "sp"
  },
  {
    title: "Delovna soba",
    body: "ds"
  },
];

//ukazi
var commands = [
  {
    title: "Up",
    body: "u"
   },
  {
    title: "Stop",
    body: "s"
  },
  {
    title: "Down",
    body: "d"
  }
];

var specialCommands = [
  {
    title: "Movie mode ;)",
    body: "movie"
   },
  {
    title: "Garaza",
    body: "garaza"
   },
  {
    title: "Prezracevanje",
    body: "vent"
  },
  {
    title: "PO 5 ON",
    body: "po5on"
  },
  {
    title: "PO 5 OFF",
    body: "po5off"
  }
];

//HTPCukazi
var HTPCCommands = [
  {
    title: "Watch HTPC",
    body: "Watch-HTPC"
   },
  {
    title: "All OFF",
    body: "All-OFF"
  },
  {
    title: "Volume UP",
    body: "Marantz-VOLUP"
  },
  {
    title: "Volume DOWN",
    body: "Marantz-VOLDN"
  },
  {
    title: "MUTE",
    body: "Marantz-VOLMUTE"
  },
  {
    title: "Radio City",
    body: "Radio-RadioCity"
  },
  {
    title: "Radio OFF",
    body: "Radio-STOP"
  }
];

//make menus
var HTPCMenu = new UI.Menu({
  sections: [{
    title: 'HTPC Commands',
    items: HTPCCommands
  }]
});

//make menus
var roomMenu = new UI.Menu({
  sections: [{
    title: 'Select room',
    items: rooms
  }]
});

roomMenu.show();

// Add a click listener for select button click

roomMenu.on('select', function(roomSelect) {
  if (roomSelect.itemIndex === 0) {
    var commandMenu = new UI.Menu({
      sections: [{
        title: rooms[roomSelect.itemIndex].title,
        items: specialCommands
      }]
    });
  }
  else {
    var commandMenu = new UI.Menu({
      sections: [{
        title: rooms[roomSelect.itemIndex].title,
        items: commands
      }]
    });
  }
  
  commandMenu.show();
  
  commandMenu.on('select', function(commandSelect) {

  // Show a card with clicked item details
  var commandPayload =''
  if (roomSelect.itemIndex === 0) {  
    commandPayload = specialCommands[commandSelect.itemIndex].body
    }
    else{
     commandPayload = rooms[roomSelect.itemIndex].body+commands[commandSelect.itemIndex].body 
    }
  
  var detailCard = new UI.Card({
    title: 'Success',
    body: "Command sent!"
  });
  
  var errorCard = new UI.Card({
    title: '!!! ERROR !!!',
    body: "command "+commandPayload+"\nNOT sent!\nERROR:"+ajax.error
  });
         
    
ajax({ url: 'http://rpi-433:8080/'+commandPayload, method: 'get'},
       
       function() {
         // Success!
         //Vibe.vibrate('short');
         //console.log("command "+rooms[roomSelect.itemIndex].body+" "+commands[commandSelect.itemIndex].body+" sent!");
         //console.log("command "+commandPayload+" sent!");
         // Show the detailCard
         
         detailCard.show();
         setTimeout(function() {
           // Display the commandMen
           commandMenu.show();
           // Hide the detailCard to avoid showing it when the user press Back.
           detailCard.hide();
         }, 1000);
         
       },
       
       function(error) {
         // Failure!
         //console.log("command "+rooms[roomSelect.itemIndex].title+" "+commands[commandSelect.itemIndex].title+"\n NOT sent!\nERROR:"+ajax.error);
         //console.log("command "+commandPayload+"\nNOT sent!\nERROR:"+ajax.error);
         errorCard.show();
         Vibe.vibrate('double');
         setTimeout(function() {Vibe.vibrate('double');}, 1000);
         setTimeout(function() {
           // Display the commandMen
           commandMenu.show();
           // Hide the errorCard to avoid showing it when the user press Back.
           errorCard.hide();
         }, 2000);
       }
      );
  });
});

roomMenu.on('longSelect', function(MenuSwitch) {
    
  HTPCMenu.show();
  
  HTPCMenu.on('select', function(HTPCCommandSelect) {

  // Show a card with clicked item details
  var detailCard = new UI.Card({
    body: "command "+HTPCCommands[HTPCCommandSelect.itemIndex].body+" sent!"
  });

  var errorCard = new UI.Card({
    title: '!!! ERROR !!!',
    body: "command "+HTPCCommands[HTPCCommandSelect.itemIndex].body+"\nNOT sent!\nERROR:"+ajax.error
  });
         
    
ajax({ url: 'http://z68:8079/?'+HTPCCommands[HTPCCommandSelect.itemIndex].body, method: 'get'},
       
       function() {
         // Success!
        //console.log('Successfully fetched data!');
         // Show the detailCard
         
         /*detailCard.show();
         setTimeout(function() {
           // Display the commandMen
           commandMenu.show();
           // Hide the detailCard to avoid showing it when the user press Back.
           detailCard.hide();
         }, 1000);*/
         
       },
       
       function(error) {
         // Failure!
         //console.log('Failed fetching data: ' + error);
         errorCard.show();
         Vibe.vibrate('double');
         setTimeout(function() {Vibe.vibrate('double');}, 1000);
         setTimeout(function() {
           // Display the commandMen
           HTPCMenu.show();
           // Hide the errorCard to avoid showing it when the user press Back.
           errorCard.hide();
         }, 2000);
       }
      );
  });
});