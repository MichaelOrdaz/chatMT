
$(document).ready(function(){
	var timer = setTimeout( ()=>{
		document.querySelector('#logeo input#user').focus();
	}, 1000);


	$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: {'fn': 'checkSession'}
	}).done(function(json){
			console.log(json);
			if(json.status == 1){	
				window.location.href = "dashboard";
			}
	}).fail(function(jqXHR, textStatus, errorThrown){
		$("#resp").html('<div class="alert alert-danger"><b>Algo Mal,</b> Error en la Petición, intenta nuevamente</div>');
		console.error(jqXHR);
		console.error(textStatus);
	});
});


$("form#logeo").submit(function(ev){
	ev.preventDefault();
	var data = $("#logeo").serializeArray();
	//console.log(data);
	data.push( {name: 'fn', value: 'login'} );
	console.log(data);
	
	$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: data,
		beforeSend: function(){
			$("#logeo :submit").prop("disabled", true);
		}
	}).done(function(json){
			console.log(json);
			$("#logeo :submit").prop("disabled", false);
			if(json.status === 1){
				$("#resp").html('<div class="alert alert-success"><b>Correcto!! </b>sera redirigido automaticamente.</div>');
				var timer = setTimeout( ()=>{ 
					$("#resp").empty();	
					window.location.href="dashboard"; 
				}, 2000);
			}
			else{
				$("#resp").html('<div class="alert alert-danger"><b>Algo Mal,</b> '+json.msg+'.</div>');
				setTimeout(()=>{
					$("#resp").empty();
				}, 3000);
			}
	}).fail(function(jqXHR, textStatus, errorThrown){
		$("#resp").html('<div class="alert alert-danger"><b>Algo Mal,</b> Error en la Petición, intenta nuevamente</div>');
		console.error(jqXHR);
		console.error(textStatus);
	});

});
