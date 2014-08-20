$(document).ready(function()
{
	var uploadbox = $("#id_uploadbox");
	var inputSelectFile = $("#id_input_selectfile");
	var btnProcess = $("#id_btn_process");
		
	uploadbox.on('dragenter', function (e) 
	{
	    e.stopPropagation();
	    e.preventDefault();
	    $(this).css('border', '2px solid #0B85A1');
	});
	
	uploadbox.on('dragover', function (e) 
	{
	     e.stopPropagation();
	     e.preventDefault();
	}); 
	 
	uploadbox.on('drop', function (e) 
	{
	     $(this).css('border', '2px dotted #0B85A1');
	     e.preventDefault();
	     var files = e.originalEvent.dataTransfer.files;
	 
	     // We need to send dropped files to Server
	     handleFileUpload(files);
	});
	
	inputSelectFile.on('change', function (e) {
		handleFileUpload( e.target.files );
	});
	
	btnProcess.click( function( event ) {
		formData = new FormData();
		sendProcessRequestToServer(formData);
	} );
	
	$(document).on('dragenter', function (e) 
	{
	    e.stopPropagation();
	    e.preventDefault();
	});
	
	$(document).on('dragover', function (e) 
	{
	  e.stopPropagation();
	  e.preventDefault();
	  uploadbox.css('border', '2px dotted #0B85A1');
	});
	
	$(document).on('drop', function (e) 
	{
	    e.stopPropagation();
	    e.preventDefault();
	});
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function handleFileUpload(files)
{
   for (var i = 0; i < files.length; i++) 
   {
        var fd = new FormData();
        fd.append('file', files[i]);
 
        sendFileToServer(fd);
   }
}

function sendFileToServer(formData)
{
    var uploadURL ="/upload/"; //Upload URL
    var extraData ={}; //Extra Data.
    
    var jqXHR=$.ajax({
            xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            return xhrobj;
        },
        url: uploadURL,
        headers: { "X-CSRFToken": getCookie('csrftoken') },
        type: "POST",
        contentType: false,
        processData: false,
        cache: false,
        data: formData,
        success: function( data ) {
        	// get width / height ratio of the image
        	image_width = parseFloat( data.width );
        	image_height = parseFloat( data.height );
        	image_ratio = image_width / image_height;
       
        	frame_width = parseFloat ( $("#id_source_image").css("width").replace(/[^-\d\.]/g, '') );
        	frame_height = parseFloat ( $("#id_source_image").css("height").replace(/[^-\d\.]/g, '') );
        	// frame_ratio = frame_width / frame_height;
        	
        	if ( image_width > frame_width ) {
        		// In the case where image width is relatively larger then frame's
        		image_width = frame_width;
        		image_height = image_width / image_ratio; 
        	} 
        	
        	if ( image_height > frame_height ) {
    			//  
    			image_height = frame_height;
    			image_width = image_ratio * image_height;
        	}
        	
        	image_width = parseInt ( image_width );
        	image_height = parseInt ( image_height );
         	
        	$("#id_source_image").css("background-size", "" + image_width + "px " + image_height + "px" );	
        	$("#id_source_image").css("background-image", "url(" + data.output + ")" );	
        	$("#id_uploadbox_message").hide();
         }
    }); 
}

function sendProcessRequestToServer(formData) {
	var requestURL = "/process/";
	
	formData.append ( 'operation', $("#id_operation option:selected").val() );
	
	var jqXHR = $.ajax ( {
            xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            return xhrobj;
        },
        url: requestURL,
        headers: { "X-CSRFToken": getCookie('csrftoken') },
        type: "POST",	
        contentType: false,
        processData: false,
        cache: false,
        data: formData,   
        success: function( data ) {
        	if ( data.result > 0 )
        		addResultImage(data);
        	else {
        		alert ("No face detected.");	       		
        	}
         }        
	});
}

function addResultImage(data) {
	count = $('.cs_processed_image').length + 1;
	
	template = "<a class=\"cs_processed_image_link\" " +
			"id=\"id_processed_image" + count + "\" " +
			"href=\"" + data.output + 
			"\" data-lightbox=\"" + count + 
			"\" data-title=\"" + data.operation + "\">" + 
			"<img class=\"cs_processed_image\" src=\"" + data.output + 
			"\" alt=\"" + count + "\"><div>" + data.operation + 
			"</div></a>";
			
	$("#id_ipbox").append ( template );
	
	// get width / height ratio of the image
	image_width = parseFloat( data.width );
	image_height = parseFloat( data.height );
	image_ratio = image_width / image_height;

	// frame_width = parseFloat ( $("#id_processed_image" + count).css("width").replace(/[^-\d\.]/g, '') );
	// frame_height = parseFloat ( $("#id_processed_image" + count).css("height").replace(/[^-\d\.]/g, '') );
	frame_width = 150; // as default
	frame_height = 100; // as default
	
	if ( image_width > frame_width ) {
		// In the case where image width is relatively larger then frame's
		image_width = frame_width;
		image_height = image_width / image_ratio; 
	} 
	
	if ( image_height > frame_height ) {
		//  
		image_height = frame_height;
		image_width = image_ratio * image_height;
	} 
	
	image_width = parseInt ( image_width );
	image_height = parseInt ( image_height );	

	// $("#id_processed_image" + count).height ( image_height + 10 );
	// $("#id_processed_image" + count).width ( image_width + 10 );
	// $("#id_processed_image" + count).css("background-size", "" + image_width + "px " + image_height + "px" );	
	// $("#id_processed_image" + count).css("background-image", "url(" + data.output + ")" );
	
}