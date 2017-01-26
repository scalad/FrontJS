$(function(){
  $(".dial").knob();
  
  for (var a=[],i=0;i<20;++i) a[i]=i;

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
  }

  $(".sparklines").each(function(){
    $(this).sparkline(shuffle(a), {
          type: 'line',
          width: '150',
          lineColor: '#333',
          spotRadius: 2,
          spotColor: "#000",
          minSpotColor: "#000",
          maxSpotColor: "#000",
          highlightSpotColor: '#EA494A',
          highlightLineColor: '#EA494A',
          fillColor: '#FFF'});
  });
  
  $(".sortable").tablesorter();
  
  $(".pbar").peity("bar", {
    colours: ["#EA494A"],
    strokeWidth: 4,
    height: 32,
      max: null,
      min: 0,
      spacing: 4,
      width: 58
  });
});

$(document).ready(function() {

    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
      events: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
			
      			eventClick: function(event) {
      				// opens events in a popup window
      				window.open(event.url, 'gcalevent', 'width=700,height=600');
      				return false;
      			},
			
      			loading: function(bool) {
      				if (bool) {
      					$('#loading').show();
      				}else{
      					$('#loading').hide();
      				}
      			}
    })

});