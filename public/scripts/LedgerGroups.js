/* This script utilises the jquery java library to add new person records to the page */
/* Also utilises object construction */

// var errorMsg = 'I woz here';
// window.alert(errorMsg);
// Make sure browzer Allows ActiveX scripts to execute


var url;
var $chatButton = $('#chatButton');
var $chatHistoryButton = $('#chatHistory');
var $dataTableButton = $('#dataTableButton');
var login, group, msg;

if (window.localStorage) {
    login = localStorage.login;
    group = localStorage.group;
}

$('#welcomeBanner').html('\n Welcome ' + login + '(' + group + ')' );
$('body').append('<div id="reload"></div>');
$chatHistoryButton.hide();


function loadRecords(url) {
	var Total = 0;
	var version_no = Math.floor((Math.random() * 100) + 1);
	var TimeNow = new Date();
    version_no = TimeNow;
    url = 'http://localhost:3000/articles';
    url += '?group=' + group;
	url += '&version=' + version_no;
	$.getJSON( url )
	.done( function(data) {

		var size = data.length;

		tableContent = '[';
		$.each(data, function(index, element) {

			tableContent += '{';
			tableContent += '"date": "' + element.Date + '",';
			tableContent += '"type": "' + element.Type + '",';
			tableContent += '"name": "' + element.name + '",';
			tableContent += '"description": "' + element.description + '",';
			tableContent += '"amount": ' + element.amount + ',';
			tableContent += '"_id": "' + element._id + '"';
			if ( index < size -1 ) {
				tableContent += '},';
			} else {
				tableContent += '}';
			}
			 
			if ( element.Type == "deposit" || element.Type == "sale" ) {
				Total += element.amount;	
			} else {
				Total -= element.amount;
			}
			
		});
		tableContent += ']';
		var tableData = JSON.parse(tableContent);
		var footerContent = '<tr><th></th><th></th><th></th><th></th><th>Total: ' + Total + '</th></tr>';

		if ( $.fn.dataTable.isDataTable( '#personRecords' ) ) {
			table = $('#personRecords').DataTable();
			table.destroy();
		}

		$('#personRecords').DataTable( {
			data: tableData,
			autoWidth: false,
			//scrollY : '400px',
			//scrollCollapse: true,
			//paging: false,
			columns: [
				{ data: 'date' },
				{ data: 'type' },
				{ data: 'name' },
				{ data: 'description' },
				{ data: 'amount' }
			]
		} );
/*
		$('#personRecords thead').find('th:eq(5)').hide();
		$('#personRecords tr').each( function () {
			$(this).children('td:eq(5)').hide();
		});
*/
		$('#personRecords tfoot').html(footerContent);
 
	}).fail ( function() {
		$('#personRecords').html('<p> Records could not be loaded </p>');
	});
}

loadRecords(url);


function postChat(message) {
	var TimeNow = new Date();
	var chatMessage = message;
	url = 'http://localhost:3000/chatSend';
	url = url + "?login=" + login + "&group=" + group + "&chatMessage=" + chatMessage  + "&version=" + TimeNow;
	
	//window.alert(url);
	$.ajax({
		type: "POST",
		datatype: "text/html",
		url: url,
		timeout: 2000,
		success: function(result) {
					//window.alert(JSON.parse(result));
				},
		error: function() {
					msg = 'Error recieving chat response';
					window.alert(msg);
				}
	});
}

$chatButton.on('click', function(e) {
	e.preventDefault();
	msg = "User: " + login + " logged in...";

	//$('ul').append('<button id="chatHistory" type="button" class="btn btn-warning">History</button>');
	$chatHistoryButton.show();

	// to create
	$("#chat_div").chatbox({id : "chat_div",
							title : group,
							user : login,
							offset: 20,
							messageSent: function(id, user, msg){
								 //alert("DOM " + id + " just typed in " + msg);
								 postChat(msg);
							}});
	// to insert a message
	//$("#chat_div").chatbox("option", "boxManager").addMsg(msg);
});

$chatHistoryButton.on('click', function(e) {
	e.preventDefault();

	var TimeNow = new Date();
	url = 'http://localhost:3000/chatHistory';
	url += "?login=" + login + "&group=" + group + "&version=" + TimeNow;
	//window.alert(url);

	$.getJSON( url )
	.done( function(data) {
		var chatContent = '';
		$.each(data, function(index, element) {
			chatContent += '\n Date: ' + element.Date + '\n User: ' + element.login + '\n Message: ' + element.message;
			chatContent += '\n-------------------------------';
		});
		$("#chat_div").chatbox("option", "boxManager").addMsg('\n' + chatContent);
	}).fail ( function() {
		$("#chat_div").chatbox("option", "boxManager").addMsg('Chat history could not be loaded');
	});
});