function submitFeedback() {
	var commentTopic = $("#commentsTopic").val();
    var comments = $("#comments").val();
    var ratingContent = $('input[name=ratingContent]:checked').val();
    var ratingUser = $('input[name=ratingUser]:checked').val();
    var ratingOverall = $('input[name=ratingOverall]:checked').val();
    var visitingReason = $("#visitingReason").val();
    var recommend = $('input[name=recommend]:checked').val();
    var emailAddress = $("#emailAddress").val();
    var contact = $('input[name=contact]:checked').val();
    var feedbackLanguage = $("#feedbackLanguage").val();
	var tenantId = $("#feedbackTenantId").val();
	var application =  $("#feedbackApplication").val();
	var businessSegment =  $("#feedbackBusinessSegment").val();
	var userSsoId= $("#feedbackUserId").val();

	var topic = $("#commentsTopicErrorMsg").val();
	var validEmail = $("#emailAddressErrorMsg").val();
	var overAllMsg = $("#overAllErrorMsg").val();
	var customProperty = $("#CUSTOM_PARAMETER").val();
	
	var errorFlag=false;
	var errorDiv="";
	var formSubmitDomain = "";
	if(window.location.hostname.indexOf("localhost") > -1) {
		// formSubmitDomain = "http://localhost:8050";
		formSubmitDomain = "http://localhost:8080";
	}	
	
	if ($("#errorMessage").length < 1) {
		errorDiv="<div id='errorMessage' class='error-message' style='color:Red;background-color:White;'>";
	}
	
	
	if (commentTopic == "")
	{
		//errorDiv=errorDiv+'<p>'+topic+'</p>';
		$("#commentsTopic").addClass('hasError');
		errorFlag =true;
		var errorTopicId='<p id="errorTopicId" style="color:Red;background-color:White;">'+topic+'</p>';
		if($("#errorTopicId").length < 1){
			//errorDiv=errorDiv+'</div>';
			$("#chooseTopicId").after(errorTopicId);
		}
	}else{
		if(comments==''){
			errorFlag =true;
			$("#comments").addClass('hasError');
		}else{
			$("#comments").removeClass('hasError');
		}
		
		if($("#errorTopicId").length >=1){
			//errorDiv=errorDiv+'</div>';
			$("#errorTopicId").remove();
			$("#commentsTopic").removeClass('hasError');
		}
	}
	
			
	if(!ratingOverall){	
		//errorDiv=errorDiv+'<p>'+overAllMsg+'</p>';
		$("#overAllId").addClass('hasErrordiv');
		var overAllMessageId='<p id="overAllMessageId" style="color:Red;background-color:White;">'+overAllMsg+'</p>';
		if($("#overAllMessageId").length < 1){
			//errorDiv=errorDiv+'</div>';
			$("#overAllId").after(overAllMessageId);
		}
		errorFlag =true;	
	}else{
		if($("#overAllMessageId").length >=1){
			//errorDiv=errorDiv+'</div>';
			$("#overAllMessageId").remove();
			$("#overAllId").removeClass('hasErrordiv');
		}
	}
	if (emailAddress =='') {
		//errorDiv=errorDiv+'<p>'+validEmail+'</p>';
		var errorEmailId='<p id="errorEmailId" style="color:Red;background-color:White;">'+validEmail+'</p>';
		if($("#errorEmailId").length < 1){
			//errorDiv=errorDiv+'</div>';
			$("#emailAddress").after(errorEmailId);
		}
		
		$("#emailAddress").addClass('hasError');
		errorFlag =true;
	}else{
		if(!isValidEmailAddress(emailAddress)){
			//errorDiv=errorDiv+'<p>'+validEmail+'</p>';
			var errorEmailId='<p id="errorEmailId" style="color:Red;background-color:White;">'+validEmail+'</p>';
			$("#emailAddress").addClass('hasError');
			if($("#errorEmailId").length < 1){
				
				$("#emailAddress").after(errorEmailId);
			}
			errorFlag =true;
		}else{
			
			if($("#errorEmailId").length >=1){
			//errorDiv=errorDiv+'</div>';
				$("#errorEmailId").remove();
				$("#emailAddress").removeClass('hasError');
			}
		}
	}
	
	if(errorFlag){
		
		if($("#errorMessage").length < 1){
			errorDiv=errorDiv+'</div>';
			$("#header-info").after(errorDiv);
		}else{
			$("#errorMessage").html(errorDiv);
		}
		
		//$("#header-errorMessage").show();
		return false;
	}else{
		if($("#errorMessage").length){
			$("#errorMessage").html("");
		}
		
		var sendInfo = {
	        	applicationUrl: window.location.hostname,
	        	customProperty: customProperty,
	        	application: application,
	        	language: feedbackLanguage,
	        	tenantId: tenantId,
	        	businessSegmentName:businessSegment,
	        	userSsoId:userSsoId,
	        	category: commentTopic,
	        	comments: comments,
	        	ratingContent: ratingContent,
	        	ratingUsability: ratingUser,
	        	ratingOverall: ratingOverall,
	        	visitingReason: visitingReason,
	        	recommend: recommend,
	        	emailAddress: emailAddress,
	        	feedbackContact: contact
	        };		
	        
	        console.log(JSON.stringify(sendInfo));
	        

	       $.ajax({
	        	type: "POST",
				// url: formSubmitDomain+"/selfservice/feedbackformpost",
				url: formSubmitDomain+"/MAus",
	            contentType: "application/json",
	            data: JSON.stringify(sendInfo),
	            success: function(data) { 
					console.log("data", data)
	  	    	  if(!data.error) {
	  	    		  window.document.write("Feedback saved successfully.");
						window.open("/MAus/ThankYou");
						window.close();
	  	    	  } else {
						console.log("Error")
	  	    		errorDiv=errorDiv+'<p>'+data.exceptionMessage.details+'</p>';
	  	    		if($("#errorMessage").length < 1){
	  	    			errorDiv=errorDiv+'</div>';
	  	    			$("#header-info").after(errorDiv);
		  	  		}else{
		  	  			$("#errorMessage").html(errorDiv);
		  	  		}
	  	  		
	  	    		$("#errorMessage").show();
	  	    	  }
	  	    	  
	  	     },
	  	     error: function(xhr, ajaxOptions, thrownError) {
	  	    	 var data = jQuery.parseJSON( xhr.responseText );
	  	    	 console.log(data);
	  	    	 if(!data.error) {
					   console.log("Success!")
	  	    		 window.document.write("Feedback saved successfully.");
					 window.open("/MAus/ThankYou");
					 window.close()
	  	    	 } else {
					   console.log("Error")
	  	    		 	errorDiv=errorDiv+'<p>'+data.exceptionMessage.details+'</p>';
		  	    		if($("#errorMessage").length < 1){
		  	    			errorDiv=errorDiv+'</div>';
		  	    			$("#header-info").after(errorDiv);
			  	  		}else{
			  	  			$("#errorMessage").html(errorDiv);
			  	  		}
		  	  		
		  	    		$("#errorMessage").show();

	  	    	 }
	  	     }
	            
	        });

		return true;
	}
}

function isValidEmailAddress(emailAddress) {
	var re = /^[A-Za-z0-9._%'\-\+]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(emailAddress).toLowerCase());
}

function commentLengthChange() {
	if ($("#comments").val()=='') {
		$("#commnetLength").html(1000);
		$("#comments").addClass('hasError');
	}else{
		$("#commnetLength").html(1000-$("#comments").val().length);
		$("#comments").removeClass('hasError');
	}
}

function commentsTopicChange() {
	if($("#commentsTopic").val()!=''){
		$("#commentsTopic").removeClass('hasError');
		if($("#comments").val()==''){
			$("#comments").addClass('hasError');
		}else{
			$("#comments").removeClass('hasError');
		}
	}
	if($("#errorTopicId").length >=1){
		$("#errorTopicId").remove();
		$("#commentsTopic").removeClass('hasError');
	}
}

function overAllClick() {
	var ratingOverall = $('input[name=ratingOverall]:checked').val();
	if(ratingOverall){
		if($("#overAllMessageId").length >=1){
			$("#overAllMessageId").remove();
			$("#overAllId").removeClass('hasErrordiv');
		}
	}
}

function checkEmailKeyUp() {
	if($("#errorEmailId").length >=1){
		$("#errorEmailId").remove();
		$("#emailAddress").removeClass('hasError');
	}
}

function checkEmailBlur(obj) {
	if(!isValidEmailAddress($(obj).val())){
		var validEmail = $("#emailAddressErrorMsg").val();
		var errorEmailId='<p id="errorEmailId" style="color:Red;background-color:White;">'+validEmail+'</p>';
		$("#emailAddress").addClass('hasError');
		if($("#errorEmailId").length < 1){
			
			$("#emailAddress").after(errorEmailId);
		}
	}else{
		if($("#errorEmailId").length >=1){
			$("#errorEmailId").remove();
			$("#emailAddress").removeClass('hasError');
		}
	}
}

$(this.document).ready(function() {
	
});

