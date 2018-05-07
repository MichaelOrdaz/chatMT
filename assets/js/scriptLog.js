function vLog() {
	t3="check,"+new Date().getTime();
	$.post("php/data.php",{datos:t3, a:"A1D6B6D7"},function(response) {
		console.log(response);
		r=response.split("|");
		if (r[0]=='V') {
			//cargar("#cuerpo","dashboard.php");
			window.location.href = "dashboard.php"
		}
		else{
			var timer = setTimeout( ()=>{
				document.querySelector('#logeo input#user').focus();
			}, 1000);
		}
	});
}

function recaptcha() {
	$('#rcap').append('<div class="g-recaptcha" data-sitekey="6LdYZyUTAAAAALGBhgpFpWb0C-z6EMaxQZ8dDByI" style="transform:scale(0.77);-webkit-transform:scale(0.77);transform-origin:0 0;-webkit-transform-origin:0 0;"></div>');
}

function cargar(div,pagina) {
  $(div).html('<div class="text-center"><img src="../assets/img/loading.gif"></div>');
  $(div).load(pagina);
  return false;
}

function checkLogin( form ) {
	//$("#msj").empty().removeClass();
	$("#resp").empty();
	
	//$("#btacc").addClass('disable');
	$('form#logeo :submit').prop('disabled', true);

	us=$('#user').val();
	ps=$('#pass').val();
	ca=$('#g-recaptcha-response').val();
	error="0";
	
	if (ca.length === 0 ) {
		error="Da Click en <b>No soy un robot</b>";
		acc=null;
	}
	if (ps.length<3 || ps==" " || ps=="") {
		error="Revise su contraseña";
		acc = $('#pass').css('box-shadow', '0 0 5px 0 red').focus();
	} else {
		$('#pass').css('box-shadow', 'none');;
	}
	if (us.length<3 || us==" " || us=="") {
		error="Revise nombre de usuario";
		acc=$('#user').css('box-shadow', '0 0 5px 0 red').focus();
	} else {
		$('#user').css('box-shadow', 'none');
	}

	if (error=="0") {
	
		t3="l1,"+us+","+ps+","+ca+","+new Date().getTime();
		$.post("php/data.php",{datos:t3, a:"A1D6B6D7"},function(respuesta) {
			$x=respuesta.split("|");
  		if ($x[0]=='E') {
  			$('#resp').html('<span class="label label-danger bloq"><i class="fa fa-user-times"></i> '+$x[1]+'</span>');
  			//$("#btacc").removeClass('disable'); 
  			grecaptcha.reset();
  			$('form#logeo :submit').prop('disabled', false);
  		} else {
  			$('#resp').html('<span class="label label-success bloq"><i class="fa fa-spinner fa-pulse"></i> '+$x[1]+'</span>');
  			$('form#logeo :submit').prop('disabled', false);
  			var timer = setTimeout( vLog, 2000);
  		}
    });

  } else {
  	$("#resp").addClass('label label-danger bloq mb5').html(error);
  	//$("#btacc").removeClass('disable');
  	$('form#logeo :submit').prop('disabled', false);
  	acc;
  }
}