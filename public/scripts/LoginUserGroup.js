/* Login script */

var login

$(function() {

	var $loginForm;
	var lurl, data, msg, httpRequestType, successMsg, failMsg;
	
	$loginForm = $('body');
	data = '';
	msg  = "I woz here";
	
	//window.alert(msg);
	if ( window.localStorage ) {
		$('#welcomeBanner').html('\n Welcome ' + localStorage.login + ' to the Safe Store App' );
	}
	
	$loginForm.append('<div id="Message"></div>');
	
	function sendRequestNow(httpRequestType, lurl, successMsg, failMsg) {
		var TimeNow = new Date();
		var version_no = TimeNow;
		lurl = lurl + "&version=" + version_no;
		//window.alert(lurl);
		$.ajax({
			type: httpRequestType,
			datatype: "HTML",
			url: lurl,
			timeout: 2000,
			success: function(data) {
						$('body').html(data);
					},
			error: function(data) {
				/*
						$.each(data, function(index, element) {
							failMsg += '<p>' + element.message + '</p>';	
						});
				*/
						//window.alert(failMsg);
						$('#Message').html(failMsg);
					}
		});
	}

	$('#authenticate').on('click', function(e) {
		e.preventDefault();
		// set local storage
		if ( window.localStorage ) {
            localStorage.login = $('#authLogin').val();
		}
		login = $('#login').val();
		data =  '?login='     + $('#authLogin').val();
		data += '&password='  + $('#authPassword').val();
		lurl = 'http://localhost:3000/authenticate';
		lurl += data;
		httpRequestType = "GET";
		msg = "url: " + lurl + " httpRequestType: " + httpRequestType;
		//window.alert(msg);
		successMsg = "<br/><p>Login Successful</p>";
		failMsg = "<br/><p>User not authenticated</p>";
		// sendCORSRequest(httpRequestType, lurl, successMsg, failMsg);
		sendRequestNow(httpRequestType, lurl, successMsg, failMsg)
    });
    
    $('#create').on('click', function(e) {
		e.preventDefault();
		var firstPassword = $('#createPassword').val();
		var secondPassword = $('#comparePassword').val();

		//alert(firstPassword + ' ' + secondPassword);

		if (firstPassword == secondPassword) {
			login = $('#login').val();
			data =  '?login='     + $('#createLogin').val();
			data += '&password='  + $('#createPassword').val();
			data += '&role='      + $('#createRole').val();
			lurl = 'http://localhost:3000/createUser';
			lurl += data;
			httpRequestType = "POST";
			msg = "url: " + lurl + " httpRequestType: " + httpRequestType;
			//window.alert(msg);
			successMsg = "<br/><p>User created</p>";
			failMsg = "<br/><p>User not created</p>";
			// sendCORSRequest(httpRequestType, lurl, successMsg, failMsg);
			sendRequestNow(httpRequestType, lurl, successMsg, failMsg)
		} else {
			alert('Passwords do not match');
		}
		
    });
    
});