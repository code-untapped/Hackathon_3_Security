var url;
var login, group, msg;

if (window.localStorage) {
    login = localStorage.login;
}

$newItemButton = $('#saveButton');

$('#welcomeBanner').html('\n Welcome ' + login );
$('body').append('<div id="reload"></div>');

function loadRecords(url) {
	var version_no = new Date();
    url = 'http://localhost:3000/decryptData';
    url += '?login=' + login;
	url += '&version=' + version_no;
	$.getJSON( url )
	.done( function(data) {

		var size = data.length;

		tableContent = '[';
		$.each(data, function(index, element) {

			tableContent += '{';
			tableContent += '"date": "' + element.date + '",';
			tableContent += '"name": "' + element.login + '",';
            tableContent += '"data": "' + element.data + '",';
            tableContent += '"encryptedData": "' + element.encryptedData + '",';
			tableContent += '"_id": "' + element._id + '"';
			if ( index < size -1 ) {
				tableContent += '},';
			} else {
				tableContent += '}';
			}
			
		});
		tableContent += ']';
		var tableData = JSON.parse(tableContent);

		if ( $.fn.dataTable.isDataTable( '#dataRecords' ) ) {
			table = $('#dataRecords').DataTable();
			table.destroy();
		}

		$('#dataRecords').DataTable( {
			data: tableData,
			autoWidth: false,
			//scrollY : '400px',
			//scrollCollapse: true,
			//paging: false,
			columns: [
				{ data: 'date' },
				{ data: 'name' },
                { data: 'data' },
                { data: 'encryptedData' }
			]
		} );
 
	}).fail ( function() {
		$('#dataRecords').html('<p> Records could not be loaded </p>');
	});
}

loadRecords(url);

$newItemButton.on('click', function(e) {
    e.preventDefault();
    version_no = new Date();
    purl = 'http://localhost:3000/enCryptData'
    purl += '?data=' + $('#inputData').val();
    purl += '&login='  + localStorage.login;
    purl += "&version=" + version_no;
    window.alert(purl);
    $.ajax({
        type: "POST",
        datatype: "JSON",
        url: purl,
        timeout: 2000,
        success: function(result) {
                    //window.alert(result);
                    loadRecords(url);
                    $('#inputData').val('');
                },
        error: function() {
                    loadRecords(url);
                    // msg = 'Could not save record, with details: ';
                    // msg += '\n Description: ' + $('#inputData').val();
                    // window.alert(msg);
                }
    });
});


omg = () => {
	$.ajax({
		url: 'http://localhost:3000/crunchdata',
		data: {
		},
		timeout: 2000,
		success: function(data) {
			data = JSON.stringify(data)
			console.log(data)
		// var $title = $('<h1>').text(data.talks[0].talk_title);
		// var $description = $('<p>').text(data.talks[0].talk_description);
		// $('#info')
		// .append($title)
		// .append($description);
		$('#mockDataRecords').html('<p>yaya</p>');
		//console.log(data)
		},
		error: function(err) {
			console.log(err)
		$('#mockDataRecords').html('<p>An error has occurred</p>');
		},
		type: 'GET'
	});
}

omg();