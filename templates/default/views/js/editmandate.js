<!-- require Google Maps API -->
<script src="//maps.googleapis.com/maps/api/js?key=AIzaSyCL_Se5CKGAny1BPGDGrhWNwpdwFsBfIvM"></script>
<!--<script src="//maps.googleapis.com/maps/api/js"></script>-->

<script>

$(document).delegate('input[name="installation-product-piece"]','input',function(){
//$('input[name="installation-product-value"]').bind('change',function(){
	//alert($(this).val());
	
	$('.installation-cost-input').each(function(){
		//console.log($(this).val());
		
		var cost = get_installation_cost($('input[name="mandate-hdt-partner-id"]').val(),$('input[name="mandate-customer-zipcode"]').val(),$('#addInstallation').find('input[name="installation-product-value"]').val(),$('#addInstallation').find('input[name="installation-product-piece"]').val(),$(this).data('id'));
		
		if($(this).is(':visible')){
		
			$(this).val(cost);
			
		}
	});
	
	return;
});

$(document).delegate('input[name="installation-product-value"]','input',function(){
//$('input[name="installation-product-value"]').bind('change',function(){
	//alert($(this).val());
	
	$('.installation-cost-input').each(function(){
		//console.log($(this).val());
		
		var cost = get_installation_cost($('input[name="mandate-hdt-partner-id"]').val(),$('input[name="mandate-customer-zipcode"]').val(),$('#addInstallation').find('input[name="installation-product-value"]').val(),$('#addInstallation').find('input[name="installation-product-piece"]').val(),$(this).data('id'));
		
		if($(this).is(':visible')){
		
			$(this).val(cost);
			
		}
	});
	
	return;
});

$(document).delegate('.client-installation-checkbox',"click",function(e){
	//console.log(e);
	if($(this).is(':checked') == false){
		$('input[name="mandate-installations-cost_'+$(this).data('id')+'"]').val(0);
		$('#installation-cost-input-container_'+$(this).data('id')).hide();
	} else {
		$('#installation-cost-input-container_'+$(this).data('id')).show();
	}
	
	if($('#addInstallation').find('input[name="installation-product-value"]').val() == ""){
		alert('Adjon meg a termék értékét!');
		
		return false;
	}
	
	var cost = get_installation_cost($('input[name="mandate-hdt-partner-id"]').val(),$('input[name="mandate-customer-zipcode"]').val(),$('#addInstallation').find('input[name="installation-product-value"]').val(),$('#addInstallation').find('input[name="installation-product-piece"]').val(),$(this).data('id'));
	
	//alert(cost);
	
	$('input[name="mandate-installations-cost_'+$(this).data('id')+'"]').val(cost);
	
	return true;
});

$(document).delegate('.attachment-delete','click',function(){
	//alert($(this).data('id'));
	if(!confirm('Valóban törli a csatolmányt?')) {
		return false;
	}
	var id = $(this).data('id');
	$.ajax({
		url: ajax_url,
		type : "POST",
		async : true,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'delete_attachment_file', id : id, s_id : session_id },
		success:function(data){
			console.log(data);
			load_filelist(data['mandate']);
		}
	});
});

$(document).delegate('.file-upload-button','click',function(){
	
	//alert($(this).data('id'));
	
	load_filelist($(this).data('id'));
	
	$('input[name="uploadform-mandate-id"]').val($(this).data('id'));
	
	
	//files_upload_dialog = $('#file-upload-dialog').dialog();
	files_upload_dialog = $('#file-upload-dialog').dialog({
		autoOpen: false,
		modal:true,
		title: 'Fájl feltöltés',
    	width: 500,
    	buttons: {
    		"Bezárás": function () {
        		$(this).dialog("destroy");
    		}
		}
	});
	
	/*$('.image-popup-fit-width').magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          image: {
            verticalFit: false
          }
    });*/
	
	files_upload_dialog.dialog('open');

	return false;
	
});

$(document).delegate('.calendar-step','click',function(){
	var month = $(this).data('month');
	var year = $(this).data('year');
	var master_id = $(this).data('master-id');
	var mandate_id = $(this).data('mandate-id');
	//alert(year+" "+month);
	show_calendar_loader();
	$('#calendar-ajax-loader-bg').show();
	$('#calendar-ajax-loader').show();
	$.ajax({
		url: ajax_url,
		type : "POST",
		async : true,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'refresh_confirm_calendar', month : month, year : year, master_id : master_id, mandate_id : mandate_id, s_id : session_id },
		success:function(data){
			console.log(data);
			$('#confirm-calendar-container').html('');
			$('#confirm-calendar-container').html(data['content']);
			//alert(data['content']);
			$('#calendar-ajax-loader').hide();
			$('#calendar-ajax-loader-bg').hide();
		}
	});
	
	return false;
});

$(document).delegate(".confirmed-span","click",function() {
	//var master_id = $(this).data('master-id');
	$('input[name="master-id"]').val($(this).data('master-id'));
	$('input[name="kiszallas-date"]').val($(this).data('datum'));
	$(".calendar-day").each(function(){
		$(this).removeClass("confirm-day-cell");
	});
	$(this).parent().addClass("confirm-day-cell");
});

$(document).delegate('.master-confirm-link','click',function(){
	//alert($(this).data('master-id'));
	//$('input[name="master-id"]').val($(this).data('master-id'));
	//load_master_to_confirm($('input[name="id"]').val(), $('select[name="subcontactor-id"]').val(), $('input[name="master-id"]').val());
	
	var master_id = $(this).data('master-id');
	
	var mandate_id = $(this).data('mandate-id');
	
	$(".master-confirm-link").each(function(){
		$(this).removeClass('btn-success');
	});
	
	$(this).addClass('btn-success');
	
	$.ajax({
		url: ajax_url,
		type : "POST",
		async : true,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'refresh_confirm_calendar', master_id : master_id, mandate_id : mandate_id, s_id : session_id },
		success:function(data){
			console.log(data);
			$('#confirm-calendar-container').html('');
			$('#confirm-calendar-container').html(data['content']);
			//alert(data['content']);	
		}
	});
	
	return false;
});

$(document).delegate("#mandate-remove-item","click",function(){
	
	$('.item-error').remove();
	
	var item_count = parseInt($('input[name="mandate-product-count"]').val());
	
	$('#item-row-'+item_count).remove();
	
	item_count = item_count - 1;
	
	if(item_count < 0) {
		item_count = 0;
	}
	
	if(item_count == 0) {
		$('.mandate-remove-item-container').hide();
		$('#header-row').remove();
	} else {
		$('.mandate-remove-item-container').show();
	}
	
	$('#mandate-remove-item-container-'+item_count).show();
	
	$('input[name="mandate-product-count"]').val(item_count);
});

$(document).delegate('.installation-row-delete','click',function(){
	var row_id = $(this).data('row_id');
	//alert($row_id);
	$('#installation-row-'+row_id).remove();
	return false;
});

$(document).delegate('#client-installations-cats-select','change',function(){
	//alert($(this).val());
	get_client_installations_select($(this).val());
});

function loadmandate_items() {
	$.ajax({
		url: ajax_url,
		type : "POST",
		async : false,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'loaditems_mandate', id : $('input[name="mandate-hdt-partner-id"]').val(), s_id : session_id },
		success:function(data){
			if(data['status'] == 'true') {
				$('#mandate-product-list').html('');
				$('#mandate-product-list').html(data['content']);
				$('input[name="mandate-product-count"]').val(data['count']-1);
			} else {
				ret = true;
			}
					//$('.page-loader-wrapper').hide();
		}
			/*}).done(function(data){
				if(data['status'] === 'true') {
					alert('Status '+data['status']);
					$('input[name="installation-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
					ret = false;
				}*/
	});
}

//js for addorder.view.php
$(document).ready(function(){
	
	$("#file-upload-form").on('submit',function(e) {
		
		if($('input[name="fileToUpload"]').val() == "") {
			$('#file-upload-form').find('.error-msg').html('Nem választott ki fájlt!');
			$('#file-upload-form').find('.error-msg').show('slow').delay(2000).hide('slow');
			
			return false;
			
		}
	
		var file_name = $('input[name="fileToUpload"]').val();
		
		var fileuploads_url = 'http://'+$('input[name="upload-file-url"]').val();
		
		var mandate_id = $('input[name="uploadform-mandate-id"]').val();
		
		var attachment_type = $('select[name="attachment-type"]').val();
		
		if(file_name == "") {
			return false;
		}
		
		var file_data = $('#fileToUpload').prop('files')[0];   
		var form_data = new FormData();
		//var form_data = $(this).serialize();                 
		form_data.append('file', file_data);
		form_data.append('ajax',1);
		form_data.append('m','masterservice');
		form_data.append('s_id',session_id);
		form_data.append('act','mandate_file_upload');
		form_data.append('mandate_id',mandate_id);
		form_data.append('attachment_type',attachment_type);
		
		//alert(form_data);
		//alert(fileuploads_url);
		
		$('#fileupload-loader').show();
		
		$.ajax({
			//url: fileuploads_url,
			url: ajax_url,
			type : "POST",
			async : false,
			dataType:"json",
			cache: false,
            contentType: false,
            processData: false,
			//data : { ajax : 1, m : 'masterservice', act : 'mandate_file_upload', f_data : form_data, file : file_name, s_id : session_id },
			data : form_data,
			success:function(data){
				$('#fileupload-loader').hide();
				console.log(data);
				if(data['status'] !== 'ok') {
					$('#file-upload-form').find('.error-msg').html(data['content']);
					$('#file-upload-form').find('.error-msg').show('slow').delay(2000).hide('slow');
				}
				load_filelist(mandate_id);
				$('input[name="fileToUpload"]').val('');
				return false;
			}
		});
		
		return false;
	});
	
	
	load_master_to_confirm($('input[name="id"]').val(), $('select[name="subcontactor-id"]').val(), $('input[name="master-id"]').val());
	
	$('a').bind('click',function(){
		
		if(typeof $(this).data('nolock') != 'undefined') {
			return true;
		}
		
		if($('input[name="lock"]').val() == uid){
			//alert('Zárolva');
			$('.alert').show("slow");
			
			document.body.scrollTop = 0;
		    document.documentElement.scrollTop = 0;
		    
			return false;
		}
		return true;
	});
	
	$("#addInstallation").on("show.bs.modal", function(e) {
	    var client_id = $("#mandate-hdt-partner-id").val();
		//alert(client_id);
	    //get_client_installations_cats_select();
	    // If empty the adress fields - zip, city, address
		if($('input[name="mandate-customer-zipcode"]').val() == '' || $('input[name="mandate-customer-city"]').val() == '' || $('input[name="mandate-customer-address"]').val() == '') {
			
			//alert('Előbb adjon meg címet!');
			$('input[name="mandate-customer-address"]').after('<div class="error">Adjon meg egy címet!</div>');
			return false;
		} else {
			// Check valid address
			make_to_address();
			validate_address(function(result){
				
				if(result === 'error'){
					//console.log(result);
					//alert('Hibás vagy nem létező cím!');
					$('input[name="mandate-customer-address"]').after('<div class="error">Hibás vagy nem létező cím!</div>');
					$("#addInstallation").modal("hide");
					return false;
				} else {
					var client_id = $("#mandate-hdt-partner-id").val();
						
					get_client_installations_cats_select();
				}
			});
		}
	    //$(this).find(".modal-body").html("Client: "+client_id);
	});
	
	$('#mandate-form-cancel').click(function(){
		
		var cancel_href = $(this).data('cancel-href');
		
		var id = $(this).data('id');
		
		unlock(id);
		
		window.location.href = cancel_href;
		
		return false;
		
	});
	
	$('#subcontactor-id').bind('change',function(){
		
		//alert("Itt");
		
		load_master_to_confirm($('input[name="id"]').val(), $('select[name="subcontactor-id"]').val(), $('input[name="master-id"]').val());
		
		return false;
	});

	$('.mandate-remove-item-container').show();
	
	//loadmandate_items();

	//$('#user-form').submit(function(){
	
	$("#addInstallation").on("hidden.bs.modal", function() {
		$('#addInstallation').find('.installations-select-container').html('');
	});
	
	$("#add-installation-row").click(function(){
		
		var checked = false;
		
		var random = Math.random().toString(36).substr(2, 5);
		
		//alert(random);
		
		var row_index = parseInt($('input[name="row-index"]').val())+1;
		
		if($('#client-installations-cats-select').val() == ''){
			$('#addInstallation').find('.error-msg').html('Nem választott terméket!');
			$('#addInstallation').find('.error-msg').show('slow').delay(2000).hide('slow');
			return false;
		} else if($('#client-installations-cats-select').val() != '') {
			
			var check_product = $('input[name="installation-product['+$('#client-installations-cats-select').val()+']"]').val();
			
			//alert(check_product);
			//alert(typeof check_product);
			
			if(typeof check_product != 'undefined') {
				//$('#addInstallation').find('.error-msg').html('A termék már szerepel a listában!');
				//$('#addInstallation').find('.error-msg').show('slow').delay(2000).hide('slow');
				$('#installation-row-'+check_product).remove();
				//return false;
			}
			//alert($('input[name="installation-product['+$('#client-installations-cats-select').val()+']"]').val());
		}
		
		if($('#addInstallation').find('input[name="installation-product-value"]').val() == '' ) {
			$('#addInstallation').find('.error-msg').html('Nem adott meg értéket!');
			$('#addInstallation').find('.error-msg').show('slow').delay(2000).hide('slow');
			return false;
		} else if ($('#addInstallation').find('input[name="installation-product-value"]').val() != '') {
			var reg = /^\d+$/;
			var value = $('#addInstallation').find('input[name="installation-product-value"]').val();
			if(reg.test(value) == false) {
				$('#addInstallation').find('.error-msg').html('Nem értéket adott meg!');
				$('#addInstallation').find('.error-msg').show('slow').delay(2000).hide('slow');
				return false;
			}
		}
		
		
		
		$('#addInstallation').find('input[type=checkbox]').each(function () {
			if ($(this).is(':checked')) {
				checked = true;
			}
		});
		
		if(checked == false) {
			$('#addInstallation').find('.error-msg').html('Nem választott installációt!');
			$('#addInstallation').find('.error-msg').show('slow').delay(2000).hide('slow');
			return false;
		}
		
		
		
		/*var product_name = $('#client-installations-cats-select option:selected').text();
		var installations = '<ul>';
		$('#addInstallation').find('input[type=checkbox]').each(function () {
	           if ($(this).is(':checked')) {
	        	   installations += '<li>'+$(this).next('label').html()+'</li><input type="hidden" name="installation['+$(this).data('id')+']" value="'+$('#addInstallation').find('input[name="installation-product-value"]').val()+'" />';
	           }
		});
		installations += '</ul>';
		installations += '<input type="hidden" name="installation-product['+$('#client-installations-cats-select').val()+']" value="'+random+'" />';
		$('#products-list > tbody').append('<tr id="installation-row-'+random+'"><td>'+product_name+'</td><td>'+installations+'</td><td><a class="installation-row-delete" data-row_id="'+random+'" href="javascript:void(0);" style="width:100%;text-align:center;display:inline-block;"><span class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red;"></span></a></td></tr>');
		$('input[name="row-index"]').val(row_index);*/
		var product_name = $('#client-installations-cats-select option:selected').text()+' - '+$('input[name="installation-product-value"]').val()+" Ft";
		
		var product_piece = $('#addInstallation').find('input[name="installation-product-piece"]').val() + " db";
		
		var installations = '<ul>';
		$('#addInstallation').find('input[type=checkbox]').each(function () {
	           if ($(this).is(':checked')) {
	        	   //var cost = get_installation_cost($('input[name="mandate-hdt-partner-id"]').val(),$('input[name="mandate-customer-zipcode"]').val(),$('#addInstallation').find('input[name="installation-product-value"]').val(),$(this).data('id'));
	        	   //console.log(cost);
	        	   
	        	   var cost = $('input[name="mandate-installations-cost_'+$(this).data('id')+'"]').val();
	        	   
	        	   //installations += '<li>'+$(this).next('label').html()+' '+cost+' Ft</li><input type="hidden" data-id="'+$(this).data('id')+'" name="installation['+$(this).data('id')+']" value="'+$('#addInstallation').find('input[name="installation-product-value"]').val()+'" />';
	        	   
	        	   installations += '<li>'+$(this).next('label').html()+' '+cost+' Ft</li><input type="hidden" data-id="'+$(this).data('id')+'" name="installation['+$(this).data('id')+']" value="'+$('#addInstallation').find('input[name="installation-product-value"]').val()+"|"+$('#addInstallation').find('input[name="installation-product-piece"]').val()+"|"+cost+'" />';
	        	   
	        	   installations += '<input data-id="'+$(this).data('id')+'" type="hidden" name="installation-cost['+$(this).data('id')+']" value="'+cost+'" />';
	           }
		});
		installations += '</ul>';
		installations += '<input type="hidden" name="product-value['+$('select[name="client-installations-cats-select"]').val()+']" value="'+$('input[name="installation-product-value"]').val()+'" />';
		
		installations += '<input type="hidden" name="product-piece['+$('select[name="client-installations-cats-select"]').val()+']" value="'+$('input[name="installation-product-piece"]').val()+'" />';
		
		installations += '<input type="hidden" name="installation-product['+$('#client-installations-cats-select').val()+']" value="'+random+'" />';
		$('#products-list > tbody').append('<tr id="installation-row-'+random+'"><td>'+product_name+' - '+product_piece+'</td><td>'+installations+'</td><td><a class="installation-row-delete" data-row_id="'+random+'" href="javascript:void(0);" style="width:100%;text-align:center;display:inline-block;"><span class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red;"></span></a></td></tr>');
		$('input[name="row-index"]').val(row_index);
		
		var summa_cost_netto = 0;
		var summa_cost_afa = 0;
		var summa_cost = 0;
		//console.log($('input[name="installation-cost"]'));
		$('input[name^="installation-cost"]').each(function(){
			summa_cost_netto += parseInt($(this).val());
			//console.log($(this).val());
		});
		//console.log(summa_cost);
		$('#summa-cost-netto').html(summa_cost_netto);
		
		summa_cost_afa = (summa_cost_netto/100)*27;
		
		//console.log(summa_cost_afa);
		
		$('#summa-cost-afa').html(summa_cost_afa);
		
		$('#summa-cost').html(summa_cost_netto+summa_cost_afa);
	});
	
	$('#mandate-form-submit').click(function(){

		$('.error').remove();
		
		var ret = true;
		
		if($('input[name="mandate-customer-name"]').val() == "") {
			$('input[name="mandate-customer-name"]').after('<div class="error">A név nem lehet üres!</div>');
			ret = false;
		} /*else if($('input[name="mandate-customer-name"]').val() !== "") {
			//$('.page-loader-wrapper').show();
			// Egyediség vizsgálata ajax-szal
			$.ajax({
				url: ajax_url,
				type : "POST",
				async : false,
				dataType:"json",
				data : { ajax : 1, m : 'masterservice', act : 'checkunique_user', fieldname : 'Login', value : $('input[name="mandate-name"]').val(), s_id : session_id },
				success:function(data){
					if(data['status'] == 'true') {
						$('input[name="mandate-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
						ret = false;
					} else {
						ret = true;
					}
					//$('.page-loader-wrapper').hide();
				}
			/*}).done(function(data){
				if(data['status'] === 'true') {
					alert('Status '+data['status']);
					$('input[name="mandate-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
					ret = false;
				}*/
			//});
			
		//}
		
		// Check first password
		/*if($('input[name="pwd-one"]').val() == "") {

			$('input[name="pwd-one"]').after('<div class="error">A jelszó nem lehet üres</div>');
			ret = false;
		} else {
			var md5_passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
			var passw = $('input[name="pwd-one"]').val();
			if(!passw.match(md5_passw)) {

				$('input[name="pwd-one"]').after('<div class="error">Hibás jelszó formátum (Legyen benne szám és legalább egy nagybetű!)</div>');
				ret = false;
			} else {
				first_pwd = true;
			}	
		}*/
		// Check secound password
		/*if($('input[name="pwd-true"]').val() == "") {

			$('input[name="pwd-true"]').after('<div class="error">A jelszó nem lehet üres</div>');
			ret = false;
		} else {
			var md5_passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
			var passw_two = $('input[name="pwd-true"]').val();
			if(!passw_two.match(md5_passw)) {

				$('input[name="pwd-true"]').after('<div class="error">Hibás jelszó formátum (Legyen benne szám és legalább egy nagybetű!)</div>');
				ret = false;
			} 
			// Compare passwords
			if(passw != passw_two) {
				//$('input[name="master_password_secound"]').css('border-color','#da4453');
				$('input[name="pwd-true"]').after('<div class="error">A két jelszó nem egyezik</div>');
				ret = false;
			}
		}*/
		
		
		/*if($('input[name="mandate-cartype"]').val() == "") {
			$('input[name="mandate-cartype"]').after('<div class="error">A gépjármű típusa nem lehet üres!</div>');
			ret = false
		}*/
		
		/*if($('input[name="mandate-lpnumber"]').val() == "") {
			$('input[name="mandate-lpnumber"]').after('<div class="error">A gépjármű rendszáma nem lehet üres!</div>');
			ret = false
		}*/
		
		if($('input[name="mandate-customer-city"]').val() == "") {
			$('input[name="mandate-customer-city"]').after('<div class="error">A helység nem lehet üres!</div>');
			ret = false
		}
		
		if($('input[name="mandate-customer-address"]').val() == "") {
			$('input[name="mandate-customer-address"]').after('<div class="error">A cím nem lehet üres!</div>');
			ret = false
		}
		
		if($('input[name="mandate-customer-phonenum"]').val() == "") {
			//$('input[name="subcontactor-phonenum"]').css('border-color','#da4453');
			$('input[name="mandate-customer-phonenum"]').after('<div class="error">Adjon meg telefonszámot!</div>');
			ret = false;
		} else {
			//var phonenum_match = /^\d{11}$/;
			var phonenum_match = /^[\s()+-]*([0-9][\s()+-]*){11}$/;
			var phonenum = $('input[name="mandate-customer-phonenum"]').val();
			if(!phonenum.match(phonenum_match)) {
				//$('input[name="subcontactor-phonenum"]').css('border-color','#da4453');
				$('input[name="mandate-customer-phonenum"]').after('<div class="error">Nem megfelelő formátum!</div>');
				ret = false;
			}
		}
		
		if($('input[name="mandate-customer-email"]').val() == "") {
			$('input[name="mandate-customer-email"]').after('<div class="error">Az e-mail nem lehet üres!</div>');
			ret = false;
		} else {
			var email_match = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var email = $('input[name="mandate-customer-email"]').val();
			if(!email.match(email_match)) {
				//$('input[name="subcontactor-phonenum"]').css('border-color','#da4453');
				$('input[name="mandate-customer-email"]').after('<div class="error">Nem megfelelő formátum!</div>');
				ret = false;
			}
		}
		
		console.log(ret);

		if(ret === true){
			//$('#mandate-form').submit();
			// Check valid address
			make_to_address();
			validate_address(function(result){
				
				if(result === 'error'){
					//console.log(result);
					//alert('Hibás vagy nem létező cím!');
					$('input[name="mandate-customer-address"]').after('<div class="error">Hibás vagy nem létező cím!</div>');
					//$("#addInstallation").modal("hide");
					return false;
				} else {
					//var client_id = $("#mandate-hdt-partner-id").val();
						
					//get_client_installations_cats_select();
					$('#mandate-form').submit();
				}
			});
		}	
	});
	
	$('.edit-form').find('input').focus(function(){
		$(this).next('.error').remove();
	});
	
	var $loading = $('.page-loader-wrapper');
	$(document)
		.ajaxStart(function () {
		$loading.show();
	})
		.ajaxStop(function () {
		$loading.hide();
	});
	
	$("#cities-list").change(function(){
		//alert($("#cities-list option:selected").text());
		$('input[name="mandate-customer-zipcode"]').val($("#cities-list option:selected").text());
		$("#mandate-customer-city").val($(this).val());
	});
	
	$("#order-add-item").click(function(){
		
	});
	
	$('#mandate-kiszallitas').datepicker({ dateFormat: 'yy.mm.dd' });
	
	$("#mandate-add-product").click(function(){
		
		$('.item-error').remove();
		
		var item_count = parseInt($('input[name="mandate-product-count"]').val())+1;
		
		if($('input[name="mandate-product-count"]').val() > 0 && $('#mandate-product-name-'+(item_count-1)).val() == '') {
			$(this).after('<div class="item-error">A név vagy a díjazás nem lehet üres!</div>');
			return false;
		}
		
		/*if($('input[name="mandate-product-count"]').val() > 0) {
			if($('#installation-cat-name-'+(item_count-1)).val() == '' || $('#installation-cat-cost-'+(item_count-1)).val() == '') {
				$(this).after('<div class="item-error">A név vagy a díjazás nem lehet üres!</div>');
				return false;
			} else if($('#installation-cat-cost-'+(item_count-1)).val() != '') {
				var cost_match = /^\d+$/;
				var cost = $('#installation-cat-cost-'+(item_count-1)).val();
				if(!cost.match(cost_match)) {
					$(this).after('<div class="item-error">A díjazás mező csak számot tartalmazhat!</div>');
					return false;
				}
			}
		}*/
		
		console.log(item_count);
		
		if(item_count >= 1) {
			$('.mandate-remove-item-container').show();
		} else {
			$('.mandate-remove-item-container').hide();
		}
		
		//var select = get_installations_select(item_count);
		
		//console.log(select);
		
		if(item_count == 1) {
			var template =  '<div id="header-row" class="form-group form-float">'+
							'<div class="col-md-3 col-sm-3 col-xs-12"></div>'+
							'<div class="col-md-3 col-sm-3 col-xs-12">Termék</div>'+
							//'<!--<div class="col-md-3 col-sm-3 col-xs-12">Installáció</div>-->'+
						'</div>'+
						'<div id="item-row-'+item_count+'" class="form-group form-float">'+
							' <div class="col-md-3 col-sm-3 col-xs-12"></div>'+
							'<div class="col-md-3 col-sm-3 col-xs-12">'+
								'<input type="text" class="form-control item-name" id="mandate-product-name-'+item_count+'" name="mandate-product-name['+item_count+']" required>'+
							'</div>'+
							'<div class="col-md-3 col-sm-3 col-xs-12">'+
								//'<input type="text" class="form-control item-cost" id="installation-cat-cost-'+item_count+'" name="installation-cat-item-cost['+item_count+']" required>'+
								//'[{%INSTALLATIONS_SELECT%}]'+
								//'<!--<span id="select-container-'+item_count+'"></span>-->'+
							'</div>'+
						'</div>';
		} else {
			var template =  '<div id="item-row-'+item_count+'" class="form-group form-float">'+
							' <div class="col-md-3 col-sm-3 col-xs-12"></div>'+
							'<div class="col-md-3 col-sm-3 col-xs-12">'+
								'<input type="text" class="form-control item-name" id="mandate-product-name-'+item_count+'" name="mandate-product-name['+item_count+']" required>'+
							'</div>'+
							'<div class="col-md-3 col-sm-3 col-xs-12">'+
								//'<input type="text" class="form-control item-cost" id="installation-cat-cost-'+item_count+'" name="installation-cat-item-cost['+item_count+']" required>'+
								//'[{%INSTALLATIONS_SELECT%}]'+
								//'<!--<span id="select-container-'+item_count+'"></span>-->'+
							'</div>'+
						'</div>';
		}
		
		
		
		$('#mandate-product-list').append(template);
		
		//get_installations_select(item_count);
		
		$('input[name="mandate-product-count"]').val(item_count);
	});
	
});

function get_installations_select(select_id) {
	
	$.ajax({
				url: ajax_url,
				type : "POST",
				async : false,
				dataType:"json",
				data : { ajax : 1, m : 'masterservice', act : 'installations_select', id : select_id, s_id : session_id },
				success:function(data){
					if(data['status'] === 'ok') {
						console.log(data['content']);
						$('#select-container-'+select_id).html(data['content']);
					}	
				}
			/*}).done(function(data){
				//console.log(data);
				if(data['status'] === 'true') {
					ret = data['content'];
					//$('input[name="mandate-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
					//ret = false;
				}*/
			});
			
	return;

}

function load_master_to_confirm(mandate_id, mandate_subcontactor, act_master) {

	$.ajax({
		url: ajax_url,
		type : "POST",
		async : false,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'master_to_mandate', subcontactor_id : mandate_subcontactor, id : mandate_id, confirmed_master : act_master, s_id : session_id },
		success:function(data){
			//console.log(data);
			$('#confirm-master-dialog').html(data['content']);
		}
	});
}

/* Hungarian initialisation for the jQuery UI date picker plugin. */
/* Written by Istvan Karaszi (jquery@spam.raszi.hu). */
jQuery(function($){
	        $.datepicker.regional['hu'] = {
	                closeText: 'bezárás',
	                prevText: '&laquo;&nbsp;vissza',
	                nextText: 'előre&nbsp;&raquo;',
	                currentText: 'ma',
	                monthNames: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
	                'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
	                monthNamesShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún',
	                'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
	                dayNames: ['Vasárnap', 'Hétfö', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'],
	                dayNamesShort: ['Vas', 'Hét', 'Ked', 'Sze', 'Csü', 'Pén', 'Szo'],
	                dayNamesMin: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
	                weekHeader: 'Hé',
	                dateFormat: 'yy-mm-dd',
	                firstDay: 1,
	                isRTL: false,
	                showMonthAfterYear: false,
	                yearSuffix: ''};
	        $.datepicker.setDefaults($.datepicker.regional['hu']);
});

function unlock(id) {
	$.ajax({
		url: ajax_url,
		type : "POST",
		async : true,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'mandate_unlock', id : id, s_id : session_id },
		success:function(data){
			console.log(data);			
		}
	});
}

function get_client_installations_cats_select() {
	//alert($("#mandate-hdt-partner-id").val());
	
	$.ajax({
		url: ajax_url,
		type : "POST",
		//async : true,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'client_installations_cats_select', id : $("#mandate-hdt-partner-id").val(), s_id : session_id },
		success:function(data){
			if(data['status'] === 'ok') {
				//ret = data['content'];
				//$('#select-container-'+select_id).html(data['content']);
				//console.log(data['content']);
				$('#client-installations-cats-select').remove();
				
				$('#addInstallation').find('.installations-cats-select-container').html('');
				
				$('#addInstallation').find('.installations-cats-select-container').html(data['content']);
			}	
		}
	/*}).done(function(data){
		//console.log(data);
		if(data['status'] === 'true') {
			ret = data['content'];
			//$('input[name="mandate-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
			//ret = false;
		}*/
	});
	
return;
	
}

function get_client_installations_select(cat_id) {
	
	//console.log(partner_id);
	
	var installations_costs = new Array();
	$('input[name^="installation-cost"]').each(function() {
		//console.log($(this).data('id'));
		installations_costs[$(this).data('id')]=$(this).val();
	});
	
	if(installations_costs.length == 0){
			installations_costs = false;
	}
	
	$.ajax({
				url: ajax_url,
				type : "POST",
				//async : true,
				dataType:"json",
				data : { ajax : 1, m : 'masterservice', act : 'client_installations_select', id : $("#mandate-hdt-partner-id").val(),cat_id:cat_id, costs:installations_costs, s_id : session_id },
				success:function(data){
					if(data['status'] === 'ok') {
						//ret = data['content'];
						//$('#select-container-'+select_id).html(data['content']);
						//console.log(data['content']);
						$('#client-installations-select').remove();
						$('#addInstallation').find('.installations-select-container').html('');
						$('#addInstallation').find('.installations-select-container').html(data['content']);
						
						if(typeof $('input[name="product-value['+cat_id+']"]').val() !== 'undefined') {
							$('input[name="installation-product-value"]').val($('input[name="product-value['+cat_id+']"]').val());
						}
						if(typeof $('input[name="product-piece['+cat_id+']"]').val() !== 'undefined') {
							$('input[name="installation-product-piece"]').val($('input[name="product-piece['+cat_id+']"]').val());
						}
						
						//console.log($('#product-list').find('input[name="installation"]'));
						$('input[name^="installation"]').each(function(){
							var id = $(this).data('id');
							if(typeof $('input[name="installation['+id+']"]').val() != 'undefined'){
								$('#mandate-installation-'+id).prop('checked', true);
							}
						});
					}	
				}
			/*}).done(function(data){
				//console.log(data);
				if(data['status'] === 'true') {
					ret = data['content'];
					//$('input[name="mandate-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
					//ret = false;
				}*/
			});
			
	return;

}

function get_installation_cost(subclient_id,zipcode,product_value,product_piece,installation_id) {
	// Bemenet:
	// zipcode - rányítószám a távolság számításához
	// product_value - termék értéke
	// installation_id - installáció
	
	var address = $('input[name="to-address"]').val();
	
	var jqXHR = $.ajax({
		url: ajax_url,
		type : "POST",
		async : false,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'get_installation_cost', subcli_id : subclient_id, to: address, zip : zipcode, prod_val:product_value, prod_piece:product_piece, inst_id : installation_id, s_id : session_id },
		success:function(data){
			if(data['status'] === 'ok') {
				//ret = data['content'];
				//$('#select-container-'+select_id).html(data['content']);
				//console.log(data['content']);
				$('#installations-select-container').html(data['content']);
			}	
		}
	/*}).done(function(data){
		//console.log(data);
		if(data['status'] === 'true') {
			ret = data['content'];
			//$('input[name="mandate-name"]').after('<div class="error">A felhasználónév már létezik a rendszerben!</div>');
			//ret = false;
		}*/
	});
	
	console.log(jqXHR.responseJSON);
	
	return jqXHR.responseJSON;
	
}

function make_to_address() {
	var to_address = $('input[name="mandate-customer-zipcode"]').val()+' '+$('input[name="mandate-customer-city"]').val()+' '+$('input[name="mandate-customer-address"]').val();
	$('input[name="to-address"]').val(to_address);
	
	return;
}

function validate_address(callback) {
	
	var address = $('input[name="to-address"]').val();
	
	var ret;
	
	geocoder = new google.maps.Geocoder();
	
	geocoder.geocode( { 'address': address}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	    	//souradnice = [results[0].geometry.location.lat(),results[0].geometry.location.lng()];
	    	//callback(souradnice);
		  ret = 'ok';
	  } else {
	      //alert('Nem létező vagy hibás cím!');
		  ret = 'error';
	  }
	  callback(ret);
	});  
	
}

function show_calendar_loader() {
	var position = $('#confirm-calendar-container').offset();
	var width = $('#confirm-calendar-container').width();
	var height = $('#confirm-calendar-container').height();
	//console.log(width);
	
	var loader_left = (position.left-$(window).scrollLeft())+((width/2)-27);
	var loader_top = (position.top-$(window).scrollTop())+((height/2)-27);
	//console.log(loader_left);
	$('#calendar-ajax-loader-bg').css({'width':width});
	$('#calendar-ajax-loader-bg').css({'height':height});
	$('#calendar-ajax-loader-bg').css({'left':position.left-$(window).scrollLeft()});
	$('#calendar-ajax-loader-bg').css({'top':position.top-$(window).scrollTop()});
	
	$('#calendar-ajax-loader').css({'left':loader_left});
	$('#calendar-ajax-loader').css({'top':loader_top});
	
}

function load_filelist(mandate_id) {
	$.ajax({
		url: ajax_url,
		type : "POST",
		async : false,
		dataType:"json",
		data : { ajax : 1, m : 'masterservice', act : 'load_mandate_filelist', id : mandate_id, s_id : session_id },
		success:function(data){
			console.log(data);
			$('#filelist_container').html('...Betöltés...');
			$('#filelist_container').html(data['content']);
		}
	});
}

</script>
