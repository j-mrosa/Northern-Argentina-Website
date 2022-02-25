//array to receive all complete questions
let allQuestions = [];

//array to receive all question texts
let questionTexts = [];

//array to receive choices for each question
//each item in this array is an array of possible choices
let questionChoices = [];

//array to receive all question aswers
let questionAnswers = [];

window.onload = function() {
    //filename
    let url = "Quiz.json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            //load the posts when server responds
            loadQuiz(xmlhttp.responseText); 

            //create event listener to buttons container
            document.querySelector("#buttons-container").addEventListener("click", btnTabHandler); 

            //click the first tab button
            document.getElementById("button1").click();          

            //event listener - submit button
            document.querySelector("#submit").addEventListener("click", btnSubmitHandler);

            //event listener - reset button
            document.querySelector("#reset").addEventListener("click", btnResetHandler);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//function that handles button reset
function btnResetHandler(){
    //uncheck all radio buttons
    let allRadio = document.querySelectorAll("input[type='radio']");

    allRadio.forEach(element => {
        element.checked = false;        
    });

    //hide results
    document.getElementById("results").classList.add("hidden");

    //go back to first tab
    document.getElementById("button1").click();
}

//function that handles button submit
function btnSubmitHandler(){
    //declare variable to count how many questions are answered
    let answered = document.querySelectorAll("input[type='radio']:checked").length;

    //declare variable with the total correct scores
    let totalCorrect = 0; 
    
    //declare variable for the table body
    let tableBody = document.getElementById("table-body");

    //clear table body content
    tableBody.innerHTML = "";

    //verify if all questions are answered; if not, show alert
    if (answered !== allQuestions.length) {
        alert("All questions must be answered before submitting!");
    }
    //if all quetions are answered, show results container and build table
    else{    
        //show results container
        document.getElementById("results").classList.remove("hidden");

        //loop through the quiz questions
        for (let i = 0; i < allQuestions.length; i++) {
            //start new row in the table for each question
            let newRow = document.createElement("tr");
            //append row to table-body
            tableBody.appendChild(newRow);
            
            //add question # to table row      
            newRow.innerHTML += "<td>Question " + (i+1) + "</td>";

            //add question text to table row
            newRow.innerHTML += "<td>" + questionTexts[i] + "</td>";

            //add correct answer to table row
            newRow.innerHTML += "<td>" + questionChoices[i][questionAnswers[i]] + "</td>";

            //create array for each question radiobuttons group
            let radioGroup = document.querySelectorAll("input[name='choices" + i +"']");

            //add choice selected to the table row
            newRow.innerHTML += "<td>" + document.querySelector("input[name='choices" + i +"']:checked").value + "</td>";   

            //verify if checked answer is the same as correct one
            //to be correct, radiobutton checked must be same index as answer (use answers array) 
            if (radioGroup[questionAnswers[i]].checked) {
                //increment total score
                totalCorrect++;

                //add number "1" to column score in the table row
                newRow.innerHTML += "<td>" + 1 + "</td>";
            }
            //if answer is not correct 
            else{
                //add number "0" to column score in the table row
                newRow.innerHTML += "<td>" + 0 + "</td>";
                //change text color to red
                newRow.classList.add("text-danger");
            }           
        }        
    }

    //display total score
    document.getElementById("total").innerHTML = "<h2>Your score = " + totalCorrect + "/" + allQuestions.length + "</h2>";    
}

//function that handles tabs
function btnTabHandler(event){
    let buttonClicked = event.target;

    console.log(event.target.nodeName);

    //deselect all buttons and hide all tabs
    DeselectAndHide();

    //add class active to clicked button
    buttonClicked.classList.add("active");

    //declare a string variable for the button clicked id
    let btnID = buttonClicked.id;

    //replace part of string, to match the equivalent tab
    let tabID = btnID.replace("button", "question");

    //remove hidden class from equivalent tab, displaying it
    document.getElementById(tabID).classList.remove("hidden");

}

//function that deselects buttons and hide tabs
function DeselectAndHide(){

    //remove active class from each button and add hidden class to all tabs
    for (let i = 0; i < allQuestions.length; i++) {
        let eachButton = document.querySelector("#button" + (i+1));
        eachButton.classList.remove("active");        
        
        let eachTab = document.querySelector("#question" + (i+1));
        eachTab.classList.add("hidden"); 
    }
}

//function that loads the quiz from json file, and builds questions cards and buttons
function loadQuiz(text){
    //convert JSON data to JS objects
    fullQuiz = JSON.parse(text);

    //fill array of complete questions
    allQuestions = fullQuiz.questions;

    //get quiz title and display it
    document.querySelector("#titleQuiz").innerHTML = fullQuiz.title;

    //declare variable for the buttons container
    let buttonsContainer = document.querySelector("#buttons-container");

    //for each question:
    for (let i = 0; i < allQuestions.length; i++) {
        //create div for each question, text and choices
        let newQuestion = document.createElement("DIV"); 
        let newText = document.createElement("DIV");
        let newChoices = document.createElement("DIV");

        //create a button for each question
        let newButton = document.createElement("button");
             
        //append card to the container, add class and id
        document.querySelector("#questions-container").appendChild(newQuestion);   
        newQuestion.classList.add("card", "mt-4");
        newQuestion.id = "question" + (i+1);

        //append buttons to buttons container, add class and id
        buttonsContainer.appendChild(newButton);
        newButton.classList.add("tabButton");
        newButton.id = "button" + (i+1);
        
        //put text in the button
        newButton.innerHTML = "Question " + (i+1);  

        //append divs to the card
        document.querySelectorAll(".card")[i].appendChild(newText);
        document.querySelectorAll(".card")[i].appendChild(newChoices); 

        //add classes to header and body
        newText.classList.add("card-header", "bg-warning");        
        newChoices.classList.add("card-body");   
        
        //add classes to button
        newButton.classList.add("btn","btn-dark", "m-1");

        //fill arrays of questions, choices and answer for each question
        //display questions and choices on the webpage
        questionTexts.push(allQuestions[i].questionText);
        newText.innerHTML = questionTexts[i];

        questionChoices.push(allQuestions[i].choices);

        //loop through each questionChoices item
        for (let n = 0; n < questionChoices[i].length; n++) {
            //create an input
            let input = document.createElement("input");
            //define type ane name for the input created
            input.type = "radio";
            input.value = questionChoices[i][n];
            input.name = "choices" +  i;
            //append the new input to the card
            newChoices.appendChild(input);
            
            //insert each question choice text after input
            newChoices.innerHTML += " " + questionChoices[i][n];

            //append a line break 
            newChoices.appendChild(document.createElement("br"));        
        }

        //add answer to question answers array
        questionAnswers.push(allQuestions[i].answer);           
    }



}  

