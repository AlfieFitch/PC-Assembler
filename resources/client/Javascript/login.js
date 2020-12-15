
function getUsersList() {
    //debugger;
    console.log("Invoked getUsersList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/users/list/";    		// API method on web server will be in Users class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatUsersList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}


//getUser() returns one row of data from the database using a GET and path parameter
function getUser() {
    console.log("Invoked getUser()");     //console.log your BFF for debugging client side
    const UserID = document.getElementById("UserID").value;  //get the UserId from the HTML element with id=UserID
    //let UserID = 1; 			  //You could hard code it if you have problems
    //debugger;				  //debugger statement to allow you to step through the code in console dev F12
    const url = "/users/getUser/";       // API method on webserver
    fetch(url + UserID, {                // UserID as a path parameter
        method: "GET",
    }).then(response => {
        return response.json();                         //return response to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {         //checks if response from server has an "Error"
            alert(JSON.stringify(response));            // if it does, convert JSON object to string and alert
        } else {
            document.getElementById("DisplayOneUser").innerHTML = response.UserID + " " + response.username;  //output data
        }
    });
}

function formatUsersList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.UserID + "<td><td>" + item.username + "<tr><td>";
    }
    document.getElementById("UsersTable").innerHTML = dataHTML;
}
function addUser() {
    console.log("Invoked AddUser()");
    const formData = new FormData(document.getElementById('newuserpopup'));
    let url = "/users/add";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            document.getElementById("signuptrue").style.display = "block";
        }
    });
}
function Login() {
    console.log("Invoked Login()");     //console.log your BFF for debugging client side
    const username = document.getElementById("username").value;  //get the UserId from the HTML element with id=UserID
    //let UserID = 1; 			  //You could hard code it if you have problems
    //debugger;				  //debugger statement to allow you to step through the code in console dev F12
    const url = "/users/getpword/";       // API method on webserver
    fetch(url + username, {                // UserID as a path parameter
        method: "GET",
    }).then(response => {
        return response.json();                         //return response to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {         //checks if response from server has an "Error"
            alert(JSON.stringify(response));            // if it does, convert JSON object to string and alert
        } else {
            alert(JSON.stringify(response));            // if it does, convert JSON object to string and alert

            document.getElementById("DisplayOneUser").innerHTML = response.password;  //output data
        }
    });
}
function postUserLogin() {

    console.log("Invoked postUserLogin() ");

    var url = "/users/login";
    var formData = new FormData(document.getElementById('loginpopupform'));

    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            document.getElementById("wrongdeets").style.display="flex";// shows wrong details text
        } else {
            document.cookie = "token=" + response.token;
            document.cookie = "username=" + response.username;
            window.open("index.html","_self")
        }
    });
}


function logout() {
    debugger;
    console.log("Invoked logout");
    let url = "/users/logout";
    fetch(url, {method: "POST"
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            document.cookie = "username=" + "Login";
            document.cookie = "token=" + "loggedout";
            window.open("index.html", "_self");       //open index.html in same tab
        }
    });
}