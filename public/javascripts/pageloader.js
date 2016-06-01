/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-31T10:57:57-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:35:25-06:00
*/



function loadPage(page) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      document.getElementsByTagName("main")[0].innerHTML = xhttp.responseText;
      fixLinks(document.getElementsByTagName("main")[0])

     window.history.pushState(null, null, page);
    }
    if (xhttp.readyState == 4 && xhttp.status == 404) {
      document.getElementsByTagName("main")[0].innerHTML = xhttp.responseText;
      fixLinks(document.getElementsByTagName("main")[0])

      window.history.pushState(null, null, page);
    }
  }
  console.log(page + "?shouldloadlayout=false");
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
window.onload = function () { fixLinks(null) };
