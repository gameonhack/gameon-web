/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-06-01T20:51:32-06:00
* @Project: GOHackathon
* @Last modified by:   eduardoirias
* @Last modified time: 2016-06-01T21:18:48-06:00
*/


function printDate(datep) {
  document.write(getDate(datep))
}
function getDate(datep) {
  var date = new Date(datep);

  var months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[date.getMonth()] + " " + date.getDay() + ", " + date.getFullYear()
}
