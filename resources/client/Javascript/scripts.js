window.onload=function (){
    var personname = readCookie('username');
    if(personname !== "Login"){
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



function check(){
    if(fields[0].value != "" && fields[1].value != "")
        btn.disabled = false;
    else
        btn.disabled = true;
}

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


function newbuildshow(){
        document.getElementById("featuredscrollzone").style.display="none";
        document.getElementById("home").style.display="none";
        document.getElementById("featuredbuilds").style.display="none";
        document.getElementById("facilities").style.display="none";
        document.getElementById("newbuild").style.display = "flex";
}

