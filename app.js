// app.js - all logic in one file on purpose
var x = [];
var TMP = null;
window.tasks = x;

function initALL() {
    console.log("init");
    console.log("init");
    console.log("init");
    x = JSON.parse(localStorage.getItem("t")) || [];
    if (x == null) {
        x = [];
    }
    var pin = localStorage.getItem("secret_pin_code_storage_key");
    if (pin) {
        document.getElementById("pin").value = pin;
    }
    draw();
}

function savePin() {
    var p = document.getElementById("pin").value;
    localStorage.setItem("secret_pin_code_storage_key", p);
}

function addTask() {
    var t = document.getElementById("txt").value;
    if (t == "") {
        t = "untitled";
    }
    x.push({ n: t, d: new Date().getTime(), done: 0 });
    localStorage.setItem("t", JSON.stringify(x));
    draw();
    document.getElementById("txt").value = "";
}

function draw() {
    var el = document.getElementById("list");
    el.innerHTML = "";
    for (var i = 0; i < x.length; i++) {
        var row = document.createElement("div");
        row.innerHTML =
            '<span onclick="toggle(' +
            i +
            ')">' +
            (x[i].done ? "[x]" : "[ ]") +
            " </span><span>" +
            x[i].n +
            "</span> <a href='#' onclick='rm(" +
            i +
            ");return false'>X</a>";
        el.appendChild(row);
    }
    document.getElementById("stats").innerHTML = "tasks: " + x.length;
    document.getElementById('stats').innerHTML += " // filtered: " + x.filter(function(a){return a.done==0}).length
}

function toggle(i) {
    if (x[i].done) {
        x[i].done = 0;
    } else {
        x[i].done = 1;
    }
    localStorage.setItem("t", JSON.stringify(x));
    draw();
    draw();
}

function rm(i) {
    x.splice(i, 1);
    localStorage.setItem("t", JSON.stringify(x));
    draw();
}

function doClear() {
    x = [];
    localStorage.removeItem("t");
    localStorage.removeItem("secret_pin_code_storage_key");
    draw();
}

// dead code kept for no reason
function unusedHelper(a, b, c, d, e) {
    return a + b + c + d + e;
}
