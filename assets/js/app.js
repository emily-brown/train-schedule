// Call Firebase with personalized API key

var firebaseConfig = {

    apiKey: "AIzaSyAj03l4NFItYrT2Mr2sp2RfU94slxJF-t8",

    authDomain: "trainschedule-82916.firebaseapp.com",

    databaseURL: "https://trainschedule-82916.firebaseio.com",

    projectId: "trainschedule-82916",

    storageBucket: "",

    messagingSenderId: "934263807060",

    appId: "1:934263807060:web:5b7ecd5dab189589"

  };

 

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

 

let database = firebase.database();

 

// Create function for allowing user input to the train schedule

$("#add-train-btn").on("click", function(event) {

    console.log("click!")

    event.preventDefault();

 

    // Grab user input

    let trainName = $("#train-name-input").val().trim();

    let destination = $("#destination-input").val().trim();

    let firstTrain = moment($("#time-input").val().trim(), "HH:mm").format("X");

    let frequency = $("#frequency-input").val().trim();

 

    // Create local "temporary" object for holding train data

    let newTrain = {

        train: trainName,

        destination: destination,

        firstTrain: firstTrain,

        frequency: frequency,

    };

 

    // Push train data to the database

    database.ref().push(newTrain)

 

    // console log user input

    console.log(newTrain.train);

    console.log(newTrain.destination);

    console.log(newTrain.firstTrain);

    console.log(newTrain.frequency);

 

    alert("New Train successfully added");

   

    // Clear user input fields

    $("#train-name-input").val("");

    $("#destination-input").val("");

    $("#time-input").val("");

    $("#frequency-input").val("");

});

 

// Create event so that user input pushes to the HTML to create a new line

database.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());

 

    // Store everything into a variable

 

    let trainName = childSnapshot.val().train;

    let destination = childSnapshot.val().destination;

    let firstTrain = childSnapshot.val().firstTrain;

    let frequency = childSnapshot.val().frequency;

 

    // Make the time come out in proper military format in table once user hits "submit"

    let firstTrainTime = moment.unix(firstTrain).format("HH:mm");

 

    // Create new row

    let newRow = $("<tr>").append(

        $("<td>").text(trainName),

        $("<td>").text(destination),

        $("<td>").text(frequency),

        $("<td>").text(firstTrainTime),

        // $("<td>").text(tMinutesTillTrain),

    );

 

    // Append new row to table

    $("#train-table > tbody").append(newRow);

 

});