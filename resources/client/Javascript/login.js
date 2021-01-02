
function addUser(forminput) {
    console.log("Invoked AddUser()");
    const formData = forminput;
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
    var formData = new FormData(document.getElementById('loginpopupform'));
    var url = "/users/login";

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
                openafterlogin();
        }
    });
}

function statuscheck(){
    console.log("invoked status check");
    user = readCookie('username');
    var url = "/users/getbyusern/" + user;
    fetch(url,{
        method: "GET",
    }).then (response => {
        return response.json();
    }).then(response => {
        if(response.hasOwnProperty("Error")){
            alert(JSON.stringify(response));
        }else{
            idcompare(response.token);
        }
    })
}





function logout() {
    //debugger;
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
            window.open("index.html", "_self");//open index.html in same tab
            document.cookie = "notific=" + "true";
        }
    });
}

