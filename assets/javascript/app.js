// Initialize Firebase
var config = {
  apiKey: "AIzaSyContasDRIIKPyHU5SeY-j509LECZ5M2U8",
  authDomain: "trainapp-5644b.firebaseapp.com",
  databaseURL: "https://trainapp-5644b.firebaseio.com",
  projectId: "trainapp-5644b",
  storageBucket: "trainapp-5644b.appspot.com",
  messagingSenderId: "436735871897"
};

firebase.initializeApp(config);

// Create variable to reference database
const database = firebase.database();

// Initial global variables
let trainName = "";
let dest = "";
let time = "";
let freq = 0;
let minAway = "";
let next = "";

// User adds train schedule on click of submit to Firebase database
$("#addTrain").on("click", function() {
  // event.preventDefault();

  // Grab the values to store in variable
  trainName = $("#nameInput")
    .val()
    .trim();
  dest = $("#destInput")
    .val()
    .trim();
  time = $("#timeInput")
    .val()
    .trim();
  freq = $("#freqInput")
    .val()
    .trim();

  // Saves values to Firebase
  database.ref().push({
    trainName: trainName,
    dest: dest,
    time: time,
    freq: freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("input").val("");
  return false;
});

// Firewatch + initial load and subsequent value changes, get snapshot of stored data in real-time
database.ref().orderByChild("dateAdded").on("child_added", function(childSnap) {
    //   console.log(childSnap.val());
      // Return the values from snapshot to variable
      // Methods run on jQuery selectors return the selector they we run on
      // This is why we can create and save a reference to a td in the same statement we update its text
      trainName = $("<td>").text(childSnap.val().trainName);
      dest = $("<td>").text(childSnap.val().dest);
      freq = childSnap.val().freq;
      time = childSnap.val().time;

      // Use Moment JS to calculate Next Arrival and Minutes Left
      var current = moment().format('X');
      const trainFreq = parseInt(freq);
      let firstTrain = moment(time, "HH:mm");

      // Take modulo of current time minus first train to figure out the Minutes Away and calculate next Train
      let duration = moment.duration(moment().diff(firstTrain, 'minutes'));
      let remainder = duration % trainFreq;
      minAway = trainFreq - remainder;
      next = moment().add(minAway, "m").format("hh:mm A");

      // Attach table data attribute to acquired data
      freq = $("<td>").text(freq);
      minAway = $("<td>").text(minAway);
      next = $("<td>").text(next);
      // With all values called and logged, dump the keys into row function
      createRow();

      // Logs any errors, if experienced
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );

// Takes values pushed to Firebase and displays in a row on the DOM
let createRow = function(train) {
  // Get reference to existing tbody element, create a new table row element
  let $tBody = $("tbody");
  let $tRow = $("<tr>");
  // Append the newly created table data to the table row
  $tRow.append(trainName, dest, freq, next, minAway);
  // Append the table row to the table body
  $tBody.append($tRow);
};
