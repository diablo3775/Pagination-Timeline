function displayAllSageCRMID() {
  // Declare a new array
  let newArray = [];
  // Declare an empty object
  let uniqueData = {};
  // Loop for the array elements
  for (let i in jsondata) {
    // Extract the title
    let sageCRMid = jsondata[i]['ComputerName'];
    // Use the title as the index
    uniqueData[sageCRMid] = jsondata[i];
  }
  // Loop to push unique object into array
  for (i in uniqueData) {
    newArray.push(uniqueData[i]);
  }
  // Display the unique objects
  let htmlOption = "";
  for (let i = 0; i < newArray.length; i++) {
    htmlOption += `<option value="${newArray[i].ComputerName}">${newArray[i].ComputerName}</option>`
  }
  $("#sageCRMid").html(htmlOption);
}

$(document).ready(function () {
    //For displaying dropdown values 
    displayAllSageCRMID();
    // The first time the page loads, the graph will be rendered
    loadTimeLineGraph();
});

$('#sageCRMid').on('change', function () {
  // The graph will be rendered when the dropdown is changed
  loadTimeLineGraph();
});


function loadTimeLineGraph() {
  let objSageCRM = jsondata.filter(data => data.ComputerName === $('#sageCRMid').val() && data.PatchCategory != "");
  $('#totalRecords').text(`Total Number Of Updates : ${objSageCRM.length}`);

  // display no of updates in the graph
  // $('#totalRecords').text(`Total Number Of Updates : ${} Out Of ${objSageCRM.length}`);


  // $('#totalRecords').text(`Total Number Of Updates : ${objSageCRM.length} Out of ${jsondata.length}`);

      // Remove the Appended Pagination after the graph is rendered again
      $('.timeline .pagination').remove();
      $('.timeline').append('<div class="pagination"></div>');
      $('.timeline .pagination').pagination({
        dataSource: objSageCRM,
        pageSize: 25,
        autoHidePrevious: true,
        autoHideNext: true,
        callback: function (data) {
          // The graph will be rendered when the pagination is changed
          milestones('.timeline')
          .mapping({
              'timestamp': 'InstallDate',
              'text': 'PatchCategory'
          })
          .optimize(true)
          .aggregateBy('day')
          .render([objSageCRM.length > 25 ? data : objSageCRM]) 
        }
      })
      
    }

// User Cannot type a negative number in the search field
$(document).on("keydown", "#search", function(e) {
  if(!((e.keyCode > 95 && e.keyCode < 106)
       || (e.keyCode > 47 && e.keyCode < 58) 
       || e.keyCode == 8)) {
         return false;
     }
});

// Hover effect on the timeline graph
$('.timeline').on('mouseover', '.milestones-text-label', function() {
  let text = $(this).text();
  let objComputer = jsondata.find(data => data.PatchCategory === text && data.ComputerName === $('#sageCRMid').val())
  $(this).attr("title", `${objComputer.PatchName}`)
})

