/**
* @Author: Eduardo Irías <eduardoirias>
* @Date:   2016-06-07T15:14:45-06:00
* @Project: Blackformat
* @Last modified by:   eduardoirias
* @Last modified time: 2016-06-08T01:23:24-06:00
*/



function loadPage(page) {
  var main = document.getElementsByTagName("main")[0]
  document.getElementById("loading").style.display = "block";
  main.style.display = "none";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {

    if (xhttp.readyState == 4) {
      document.getElementById("loading").style.display = "none";
      main.style.display = "block";
    }

    if (xhttp.readyState == 4 && xhttp.status == 200) {

      main.innerHTML = xhttp.responseText;
      fixLinks(document.getElementsByTagName("main")[0])

      window.history.pushState(null, null, page);
    }
    if (xhttp.readyState == 4 && xhttp.status == 404) {
      main.innerHTML = xhttp.responseText;
      fixLinks(document.getElementsByTagName("main")[0])

      window.history.pushState(null, null, page);
    }
  }
  xhttp.open("GET", page + "?shouldloadlayout=false", true);
  xhttp.send();
}

function loadPageSegment(page, tagId, reLoadPermitted) {
  var tag = document.getElementById(tagId)
  if (!reLoadPermitted && tag.getAttribute("loaded")) {
    return
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      tag.innerHTML = xhttp.responseText;
      tag.setAttribute("loaded", true)
    }
  }
  xhttp.open("GET", page + "?shouldloadlayout=false", true);
  xhttp.send();
}

function fixLinks(incontext){
    var context = incontext == null ?  document : incontext;
    var links =  context.getElementsByTagName('a');
    for(i = 0 ; i<links.length ; i++){
      var curLink = links[i].pathname
      links[i].href = "javascript:loadPage('"+curLink+"')"
    }
  }

function expandItem(tagId, sender, type) {

  if (type == null) {
    type = "block"
  }
  var tag = document.getElementById(tagId);
  if (tag.style.maxHeight == undefined || tag.style.maxHeight == "" ) {
    tag.style.maxHeight = "0px";
  }
  if (tag.style.maxHeight != "0px") {
    tag.style.maxHeight = "0px";
    sender.innerHTML = "+"
  } else {
    tag.style.maxHeight = "1000px";
    sender.innerHTML = "-"
  }
}

window.onload = function () { fixLinks(null) };
