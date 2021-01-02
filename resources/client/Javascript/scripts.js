let toopen = "index";



function homepage(){
    window.open("index.html", "_self");
}

function pageload(){
    loggedout = readCookie('notific');
    if(loggedout == 'true'){
        document.getElementById("noti").style.display = "block";
        document.cookie="notific=" + "false";
    }else{
        document.getElementById("noti").style.display = "none";
    }
    personname = readCookie('username');
    if(personname !== "Login"){
        alert("showing logout button");
        document.getElementById("loggedin").style.display = "block";
        document.getElementById("signinstuff").style.display="none"
        document.getElementById('maintitle').innerHTML = "Welcome Back, " + personname + ".";
    }else{
        document.getElementById("loggedin").style.display = "none";
        document.getElementById("signinstuff").style.display ="block";
        document.getElementById('maintitle').innerHTML = "Welcome to PC Assembler";
    }
}



$(document).ready(function (){
    $(window).scroll(function (){
        if(this.scrollY > 20)
            $(".nav").addClass("sticky");
        else
            $(".nav").removeClass("sticky");
    });
});

$(document).ready(function (){
    var finalname = readCookie('username')
    document.getElementById('loginbutton').innerHTML = finalname
});



function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return filename = "Login";
}


function openform(){
        document.getElementById("loginformoverall").style.display = "block";
        $(".nav").addClass("sticky");
}

function createaccountshow(){
    document.getElementById("signupformoverall").style.display="block";
    document.getElementById("loginformoverall").style.display="none";
    $(".nav").addClass("sticky");
}

function closeloginpage(){
    document.getElementById("loginformoverall").style.display="none";
    document.getElementById("signupformoverall").style.display="none";
}


var fields = document.querySelectorAll(".textb input");
var btn = document.querySelector(".btn");





fields[0].addEventListener("keyup",check);
fields[1].addEventListener("keyup",check);

document.querySelector(".show-password").addEventListener("click",function(){
    if(this.classList[2] == "fa-eye-slash"){
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
        fields[1].type = "text";
    }else{
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
        fields[1].type = "password";
    }
})




function ListComponents() {
    //debugger;
    document.getElementById("startbutton").style.display = "none";
    document.getElementById("legend").style.display = "block";
    console.log("invoked List");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/components/list";    		// API method on web server will be in Users class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatList(response);          //this function will create an HTML table of the data (as per previous lesson)
            console.log(response);
        }
    });
}



function formatList(myJSONArray){
    console.log("Formatting")
    let CPUhtml = "";
    let GPUhtml = "";
    var i = 1;
    for (let item of myJSONArray) {
        let stringi = String(i);
        let ident = "id = 'cpuname" + stringi + "' onclick = 'selectedcpu(" + stringi + ")';";
        let identgpu = "id = 'gpuname" + stringi + "' onclick = 'selectedgpu(" + stringi + ")';";
        CPUhtml += "<tr class = 'tablediv'><td>" + item.CPUname + "</td><td>" + item.Cores + "</td><td>" + item.Clock + "</td><td>" + item.Socket + "</td><td>" + item.Process + "</td><td>" + item.TDP + "</td><td>" + item.L3Cache + "</td><td>" + item.ReleaseDate + "</td><td " + ident + ">Select</td></tr>";
        GPUhtml += "<tr class = 'tablediv'><td>" + item.GPUname + "</td><td>" + item.Chip + "</td><td>" + item.shaders + "</td><td>" + item.GPUbus + "</td><td>" + item.GPUMemory + "</td><td>" + item.GPUclock + "</td><td>" + item.GPUmemclock + "</td><td>" + item.GPUrelease + "</td><td " + identgpu + ">Select</td></tr>";
        i++
    }
    document.getElementById("CPUtable").innerHTML = CPUhtml;
    document.getElementById("GPUtable").innerHTML = GPUhtml;
}

function selectedcpu(id){
    document.getElementById("notselect").style.display="none";
    let toid = "cpuname" + id;
    let stringed = String(toid);
    let CPU = "cpu";
    var url = "/components/getcpu/" + id;
    fetch(url, {
        method: "GET",
    }).then (response => {
        return response.json();
    }).then(response => {
        if(response.hasOwnProperty("Error")){
            alert(JSON.stringify(response));
        }else {
            addselected(response.CPUname, CPU);
        }
    })
}

var calculatedwidth = 0;

function selectedgpu(id){
    document.getElementById("notselect").style.display="none";
    let toid = "gpuname" + id;
    let stringed = String(toid);
    let GPU = "gpu";
    var url = "/components/getgpu/" + id;
    fetch(url, {
        method: "GET",
    }).then (response => {
        return response.json();
    }).then(response => {
        if(response.hasOwnProperty("Error")){
            alert(JSON.stringify(response));
        }else {
            addselected(response.GPUname, GPU);
        }
    })

}

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return(metrics.width);
}



function addselected(name, component){
    let newtitle = "Currently Selected: " + name;
    window.scrollTo(0,document.body.scrollHeight);
    document.getElementById(component + "selected").innerHTML = newtitle;
    calculatedwidth = getTextWidth(newtitle, "bold 16pt Raleway");
    savenewbuild(name,component);

}

var cpu = "";
var gpu = "";
var ram = "";
let motherboard = "";
let psu = "";
let storage = "";

function savenewbuild(name,component){
    component = String(component);

    if(component == "cpu"){
         cpu = name;
    }else if(component == "gpu"){
        gpu = name;
    }else if(component == "ram") {
        ram = name;
    }else {
        alert("not setup yet");
    }


}


function logincheck(){
        console.log("running login check");
        var personname = readCookie('username');
        if(personname == "Login"){
            loginmodalshow();
        }else{
            statuscheck();
        }
}

function loginmodalshow(){
    window.open("login.html", "_self");
}

function closesignin(){
    document.getElementById("signupformoverall").style.display = "none";
}



function newbuild(){
    toopen = "newbuild";
    logincheck();
}

function openafterlogin(){
    alert(toopen);
    window.open("index.html", "_self");
}

function idcompare(loggedtoken){
    var actualtoken = readCookie('token');
    if(actualtoken !== 'loggedout') {
        if (loggedtoken == actualtoken) {
            alert(toopen);
            window.open(toopen + ".html", "_self");

        } else {
            console.log("Token incorrect - logging out");
            logout();
        }
    }
}



function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



function startlisting(){
    let tempname = document.getElementById("buildname").value;
    name = String(tempname);
    if(name == ""){
        document.getElementById("noname").style.display="block";
    }else{
        document.getElementById("noname").style.display="none";
        showall(name);
        ListComponents("CPU");
        ListComponents("GPU");
    }
}

function showall(name){
    document.getElementById("titletochange").innerHTML ="Editing Build - " + name;
    document.getElementById("newbuildcpu").style.display="block";
    document.getElementById("instruct").style.display="none";
    document.getElementById("buildname").style.display="none";
}

function showgpu(){

    if(document.getElementById("cpuselected").innerHTML == "Nothing Selected"){
        document.getElementById("notselect").style.color ="#b04141";
    }else {
        window.scrollTo(0, 0);
        document.getElementById("newbuildcpu").style.display = "none";
        document.getElementById("newbuildgpu").style.display = "block";
    }
}


function showram(){
    window.scrollTo(0,0);
    document.getElementById("newbuildgpu").style.display="none";
    document.getElementById("newbuildram").style.display="block";
}

