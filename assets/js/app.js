// Call Firebase with personalized API key 
let firebaseConfig = {
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
$("#add-train-btn").on("click", function (event) {
    console.log("click!")
    event.preventDefault();

    // Grab user input
    let trainName = $("#train-name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let firstTrain = moment($("#time-input").val().trim(), "HH:mm A").format("X");
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

    // Clear user input fields after submission 
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

// Create event so that user input pushes to the HTML to create a new line 
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a letiable 

    let trainName = childSnapshot.val().train;
    let destination = childSnapshot.val().destination;
    let firstTrain = childSnapshot.val().firstTrain;
    let frequency = childSnapshot.val().frequency;

    // Make the time come out in proper military format in table once user hits "submit"
    let firstTrainTime = moment.unix(firstTrain).format("HH:mm A");

    // Create minutes away function and next train arrival time

    // Assumptions
    let tFrequency = frequency;

    let firstTime = 0;

    // First Time (pushed back 1 year to make sure it comes before current time)
    let firstTimeConverted = moment(firstTime, "HH:mm A").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

    // Difference between the times
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    let tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    let tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

    // Format next train time to miliary time and indicate am or pm
    let catchTrain = moment(nextTrain).format("hh:mm A");

    // Create new row on train schedule after user input 
    let newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(catchTrain),
        $("<td>").text(tMinutesTillTrain),
    );

    // Append new row to table 
    $("#train-table > tbody").append(newRow);


});
