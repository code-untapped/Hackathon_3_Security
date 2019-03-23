/* This script utilises the jquery java library to add new person records to the page */
/* Also utilises object construction */

$(function() {
	
	// Setup 
	var $ledger, $newItemButton, $deleteItemButton;
	
	var purl = 'http://localhost:3000/articles', msg, lurl, data, version_no;
	
	var url = purl;

	var deleteLedgerDate,
		deleteLedgerType,
		deleteLedgerName,
		deleteLedgerDescription,
		deleteLedgerAmount,
		deleteId,
		deleteTable;
	
    msg = "I woz here";
    

	//window.alert(msg);
	
	$ledger = $('table');
	$newItemButton = $('#create');
	$deleteItemButton = $('#delete');
	

	$newItemButton.on('click', function(e) {
        e.preventDefault();
        version_no = new Date();
		data =  '?date='   + $('#ledgerDate').val(); 
		data += '&type='   + $('#ledgerType').val();
        data += '&name='   + $('#ledgerName').val();
		data += '&amount=' + $('#ledgerAmount').val();
		data += '&description=' + $('#ledgerDescription').val();
        data += '&group='  + localStorage.group;
        purl = 'http://localhost:3000/articles'
        purl += data;
        purl += "&version=" + version_no;
		//window.alert(purl);
		$.ajax({
			type: "POST",
			datatype: "JSON",
			url: purl,
			timeout: 2000,
			success: function(result) {
						//window.alert(result);
						loadRecords(url);
						$('#ledgerDate').val('');
                        $('#ledgerType').val('');
                        $('#ledgerName').val('');
						$('#ledgerAmount').val('');
						$('#ledgerDescription').val();	
					},
			error: function() {
						msg = 'Could not save record, with details: ';
						msg += '\n Date: ' + $('#ledgerDate').val();
						msg += '\n Type: ' + $('#ledgerType').val();
                        msg += '\n Name: ' + $('#ledgerName').val();
						msg += '\n Amount: ' + $('#ledgerAmount').val();
						msg += '\n Description: ' + $('#ledgerDescription').val();
						window.alert(msg);
					}
		});
	});
	

	$('#personRecords').delegate('tbody tr','click', function (e) {
		e.preventDefault();

		var currentRec = $(this).html();
		deleteLedgerDate = $(this).find('td:eq(0)').text();
		deleteLedgerType = $(this).find('td:eq(1)').text();
		deleteLedgerName = $(this).find('td:eq(2)').text();
		deleteLedgerDescription = $(this).find('td:eq(3)').text();
		deleteLedgerAmount = $(this).find('td:eq(4)').text();
		

		msg = deleteLedgerDate + ', ';
		msg += deleteLedgerType + ', ';
		msg += deleteLedgerName + ', ';
		msg += deleteLedgerDescription + ', ';
		msg += deleteLedgerAmount + ', ';

		window.alert( 'You clicked on record ' + msg );
	});

    
    $('#createButton').on('click', function(e) {
        e.preventDefault();
        version_no = new Date();
        lurl = 'http://localhost:3000/groupMembers';
        data = '?adminGroup='  + localStorage.group;
        lurl += data;
        lurl += "&version=" + version_no;
        //window.alert(lurl);
        $.getJSON( lurl )
        .done( function(data) {
            var dropDownContent = '';
            $.each(data, function(index, element) {
                dropDownContent += '<option value="' + element.login + '">' + element.login + '</option>';
            });
            $('#ledgerName').html(dropDownContent);
        }).fail ( function() {
            $('#ledgerName').html('<p> User List not populated </p>');
        });
    });
});
