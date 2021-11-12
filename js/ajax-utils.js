//using the iffe - immediately invoked
//function expression

(function (global){

	// Set up a namespace for our utility
	var ajaxUtils = {};

	//Returns an HTTP request object
	function getRequestObject(){
		if(window.XMLHttpRequest){
			return(new XMLHttpRequest());
		}
		else if (window.ActiveXObject){
			//For very old IE browsers(optional)
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		}
		else{
			global.alert("Ajax is not responding!");
			return (null);
		}
	}

	// Makes an Ajax GET request to 'requestURl'
	//responsehandler will handle the event we get from the server
	ajaxUtils.sendGetRequest = 
	function(requestUrl , responseHandler, isJsonResponse) { 
		var request = getRequestObject();
		//on readystatechange = every state change bet
		//the browser and the server
		request.onreadystatechange = 
		function () {
			handleResponse(request, responseHandler, isJsonResponse);
		};
		//true for asynchronus request
		request.open("GET", requestUrl, true);
		request.send(null); //for POST only
		//replace null with body if sending POST request
	};

	//Only calls the user provided 'responseHandler'
	//function if response is ready
	// and not an error
	function handleResponse(request, responseHandler, isJsonResponse){
		if((request.readyState == 4) &&
			(request.status == 200)){
			// responseHandler(request);
			//default to jsonresponse = true
			if(isJsonResponse == undefined){
				isJsonResponse = true;
			}

			if(isJsonResponse){
				responseHandler(JSON.parse(request.responseText))
			}
			else{
				responseHandler(request.responseText);
			}
		}
	}

	//Expose utility to the global object
	global.$ajaxUtils = ajaxUtils;

})(window);