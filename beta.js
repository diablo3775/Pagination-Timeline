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
  loadTimeLineGraph();
});

// Filering the data based on the search input field
$('#search').on('input', function () {
  // The graph will be rendered when the input search field is changed
  loadTimeLineGraph();
});

function loadTimeLineGraph() {
  let objSageCRM = jsondata.filter(data => data.ComputerName === $('#sageCRMid').val() && data.PatchCategory != "");
  $('#totalRecords').text(`Total Number Of Updates : ${objSageCRM.length}`);
   // If the input field is empty then all the data will be rendered else the data will be filtered based on the input field
    
   milestones('.timeline')
    .mapping({
        'timestamp': 'InstallDate',
        'text': 'PatchCategory'
    })
    .optimize(true)
    .aggregateBy('day')
    .render([$("#search").val() === "" ? objSageCRM : objSageCRM.slice(0, $("#search").val())]) 
  
    //  Add Pagination in jquery if the number of updates are more than 30
    if (objSageCRM.length > 30) {
      $('.timeline').append('<div class="pagination"></div>');
      $('.timeline .pagination').pagination({
        dataSource: objSageCRM,
        pageSize: 25,
        callback: function (data) {
          // The graph will be rendered when the pagination is changed
          milestones('.timeline')
            .mapping({
              'timestamp': 'InstallDate',
              'text': 'PatchCategory'
            })
            .optimize(true)
            .aggregateBy('day')
            .render(data);
        }
      });
    }
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

