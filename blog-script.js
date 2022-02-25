//global variable: array with all posts
//convert JSON data to JS objects
//create array with all the blog posts
let allPosts = [];

//create empty arrays for each part of the posts
let titlesArray = [];
let authorsArray = []; 
let tagsArray = [];
let datesArray = [];
let editsArray = [];
let bodiesArray = [];    
let likesArray = [];
let sharesArray = [];
let commentsArray = [];


window.onload = function() {
    //filename
    let url = "blog-posts.json";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            //load the posts when server responds
            loadPosts(xmlhttp.responseText);            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //code here happens before data is received
    //event click buttons here
    let btnSearch = document.querySelector("#searchButton");
    let btnReset = document.querySelector("#resetButton");

    btnSearch.addEventListener("click", clickSearchHandler);
    btnReset.addEventListener("click", clickResetHandler);

    btnReset.click();
}

//call this function when AJAX request has finished
function loadPosts(text){
    //convert JSON data to JS objects
    allPosts = JSON.parse(text).blogPosts;

    //declare variable for the posts div
    let postsDiv = document.querySelector("#allPosts");
 
    //fill the empty arrays with info from the blog posts
    for (let i = 0; i < allPosts.length; i++) {
        //create a new div for each post
        let newDiv = document.createElement("DIV");        
        postsDiv.appendChild(newDiv);

        titlesArray.push(allPosts[i].blogPostTitle); 
        newDiv.innerHTML += "<h2>" + titlesArray[i] + "</h2>";

        authorsArray.push(allPosts[i].blogPostAuthor); 
        newDiv.innerHTML += "<p><em> Written by: " + authorsArray[i] + "</em></p>";

        datesArray.push(allPosts[i].blogPostDate);
        editsArray.push(allPosts[i].blogPostEdit); 
        newDiv.innerHTML += "<p> Posted: " + datesArray[i] +  " * Edited: " + editsArray[i] + "</p><br>";  
       
        bodiesArray.push(allPosts[i].blogPostBody);
        newDiv.innerHTML += "<p> " + bodiesArray[i] + "</p><br>";

        likesArray.push(allPosts[i].blogPostLikes);        
        sharesArray.push(allPosts[i].blogPostShares);
        newDiv.innerHTML += "<p>Likes: " + likesArray[i] + " &nbsp; - &nbsp; Shares: " + sharesArray[i] + "</p>";

        tagsArray.push(allPosts[i].blogPostTags); 
        newDiv.innerHTML += "<hr><p> Tags: " + tagsArray[i] + "</p><hr><br>";

        commentsArray.push(allPosts[i].blogPostComments);
        newDiv.innerHTML += "<h3>Comments:</h3> ";

        for (let n = 0; n < commentsArray[i].length; n++) {
            newDiv.innerHTML += "<p><em>    " + commentsArray[i][n].commentAuthor + "&nbsp; - &nbsp;" + commentsArray[i][n].commentDate + "</em></p>";              
            newDiv.innerHTML += "<p>    " + commentsArray[i][n].commentBody + "</p><br>";         
        }                                
 
        //add class to the div created
       newDiv.classList.add("myDiv");
    }

    //show total posts
    document.querySelector("#totalPosts").innerHTML = "Total posts: " + allPosts.length; 
}

function clickSearchHandler(){
    //declare variable for the inputs and convert strings to uppercase
    let inputTitle = document.querySelector("#inputTitle").value.toUpperCase();
    let inputTag = document.querySelector("#inputTag").value.toUpperCase();

    //declare variables for the input dates
    let inputFrom = document.querySelector("#inputFromDate").value;
    let inputTo = document.querySelector("#inputToDate").value;

    //declare variables for the input checkboxes
    let checkComments = document.querySelector("#inputCheckComments").checked;
    let checkLikes = document.querySelector("#inputCheckLikes").checked;
    let checkShares = document.querySelector("#inputCheckShares").checked;

    //declare counter to show the visible posts after search
    let countPosts = 0;
 
    //each time the button search is clicked loop through all the posts and:
    ////1. make all posts visible
    ////2. verify criteria: if not empty, and doesn't match any of the posts, hide it
    for (let i = 0; i < allPosts.length; i++) {
        //declare variable to the post div that is being validated
        let postDiv = document.querySelectorAll(".myDiv")[i];

         //remove the .hiddenPosts class to all posts
        postDiv.classList.remove("hiddenPosts");

        //verify if matches the search criteria
        //if doesn't match any of the criteria that are not empty, hide it
        if  ((inputTitle !== "" && !titlesArray[i].toUpperCase().includes(inputTitle)) ||
            (inputTag !== "" && !tagsArray[i].toString().toUpperCase().includes(inputTag)) ||
            (inputFrom !== "" && inputToDate !== "" && !dateIsInRange(datesArray[i],inputFrom,inputTo)) ||
            (checkComments && commentsArray[i].length === 0) ||
            (checkLikes && likesArray[i] === 0) ||
            (checkShares && sharesArray[i] === 0)
             ){

                postDiv.classList.add("hiddenPosts");  
        }
        
        //count the posts that are not hidden
        if (!postDiv.classList.contains("hiddenPosts")) {
            countPosts++;
        }
    }

    //show how many posts are visible after search
    document.querySelector("#totalPosts").innerHTML = "Total posts: " + countPosts;
}

//function that compare dates "from" and "to" with the date of the post
//sends 3 strings
//returns a boolean
function dateIsInRange(postDateStr, fromDateStr, toDateStr) {
    //declare variable to store the results
    let res;

    //call function createDate sending data from the posts and the inputs
    let postDate = createDate(postDateStr, "DD-MMM-YYYY");
    let fromDate = createDate(fromDateStr, "YYYY-MM-DD");
    let toDate = createDate(toDateStr, "YYYY-MM-DD");

    //compare post date with input dates
    res = postDate >= fromDate && postDate <= toDate;

    //return the result: date is in Range, true or false?
    return res;
}

//function that converts date strings to date objects
function createDate(str, format){
    //declare constant array with all the months
    const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    //declare variable to store the result (date object)
    let res;

    //create a new date object using string data from the date sent
    if (format === "YYYY-MM-DD") {
        let pieces = str.split("-");
        let day = Number(pieces[2]);
        let month = Number(pieces[1]) - 1; // month numbers start at 0
        let year = Number(pieces[0]);
        res = new Date(year, month, day);
    } else if (format === "DD-MMM-YYYY") {
        let pieces = str.split("-");
        let day = Number(pieces[0]);
        let month = MONTHS.indexOf(pieces[1]); // month numbers start at 0
        let year = Number(pieces[2]);
        res = new Date(year, month, day);
    }

    //return date object
    return res;
}

//function that clear all inputs and display all posts
function clickResetHandler(){
 
    //create array with all input tags
    let allInputs = document.querySelectorAll("input"); 
    
    //loop through all the inputs,clearing the data
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].type === "checkbox") {
            allInputs[i].checked = false;   
        } 
        else{
            allInputs[i].value = ""; 
        }    
         //display all posts 
        
        //declare variable to the post div that is being validated
        let postDiv = document.querySelectorAll(".myDiv")[i];

        //remove the .hiddenPosts class, if there is one
        postDiv.classList.remove("hiddenPosts");
    }

    //show total posts
    document.querySelector("#totalPosts").innerHTML = "Total posts: " + allPosts.length;
}

