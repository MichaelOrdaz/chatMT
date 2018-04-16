/**
 * Plugin de MICRO TEC
 * TODOS LOS derechos reservados
 * by Michael ORdaz Martinez
 * version 1
 * abril 2018
 */

var config = {
	apiKey: "AIzaSyDslhX-yx99qdiBB4vFEa7pFl6oHjWfc_0",
	authDomain: "firstproject-41657.firebaseapp.com",
	databaseURL: "https://firstproject-41657.firebaseio.com",
	projectId: "firstproject-41657",
	storageBucket: "firstproject-41657.appspot.com",
	messagingSenderId: "19289644195"
};
firebase.initializeApp(config);

$(function(){
 	//autoScroll al inicio
 	//autoScroll('#chat-microtec .chat-content');
 	
 	//agregar evento submit al formualrio de registro;

 	$('#chat-microtec #colapsar').click(function(event) {
 		var clase = $(this).children().eq(0).attr('class');
 		if( clase == 'up' ){
 			$('#chat-microtec').animate({
 				bottom: '0'
 			}, 1000);
 			$(this).children().eq(0).removeClass(clase);
 			$(this).children().eq(0).addClass('down');
 			$(this).children().eq(0).html('<i class="fas fa-sort-down fa-lg"></i>');
 			$(this).children().eq(0).attr('title', 'Minimizar');
 		}
 		else{
 			$('#chat-microtec').animate({
 				bottom: '-300px'
 			}, 1000);
 			$(this).children().eq(0).removeClass(clase);
 			$(this).children().eq(0).addClass('up');
 			$(this).children().eq(0).html('<i class="fas fa-sort-up fa-lg"></i>');
 			$(this).children().eq(0).attr('title', 'Maximizar');
 		}
 	});
 	
 	//verificamos si hay sesion activa
 	$.ajax({
 			url: 'php/Peticiones.php',
 			type: 'POST',
 			dataType: 'json',
 			data: {'fn': 'checkSession'},
 		}).done(function(resp) {
 			console.log(resp);
 			if( resp.status == 0 ){
 				//Si la sesion no existe o expiro, no modificamos nada el DOM, solo asiganmos el evento
 				//submit al formulario de registro.
 				enviarRegistro();
 			}
 			//si es falso es por que la sesion aun esta vigente, entonces cambiamos el DOM con los msg de la sesion.
 			else{
 				//parte complicada.
 				//console.log(resp.msg);
 				//agrego el nodo chat content
				var divChat = nodoChat();
				$('#chat-microtec .card-body').empty();
 				$('#chat-microtec .card-body').html(divChat);
 				addSubmitChat();//agrego el evento submit al chat
 				resp.msg.forEach(msg=>{
 					var msg;
					if( msg.remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
						 msg = user(msg.mensaje, msg.fecha);
					}
					else{//si no es asi lo mando microtec
						msg = microtec(msg.mensaje, msg.fecha);
					}
					$('#chat-microtec .chat-content').append(msg);
					autoScroll('#chat-microtec .chat-content');
 				});
 			}
 		
 		}).fail(function(){
 			console.log('Falló la petición')
 		});



});//DocumentReady

var autoScroll = function(nodo){
	//$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 1000);
	$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 100);
	//$("#chat-microtec .chat-content").animate({ scrollTop: $('#chat-microtec .chat-content')[0].scrollHeight}, 1000);
}

var user = function(msg, fecha){
	var nodo = '<div class="user rounded p-1 my-2" style="background: #EBEBEB">'+ msg +
		'<span class="fecha">'+ formatearFecha(fecha) +'</span>'+
	'</div>';
	return nodo;
}

var microtec = function(msg, fecha){
	var nodo = '<div class="microtec">'
    			+'<div class="media">'
				  +'<img class="mr-3 mt-2" src="https://i1.wp.com/wp.micro-tec.com.mx/wp-content/uploads/2017/11/cropped-microtec-2-1.png" alt="logo-micro-tec" />'
				  +'<div class="media-body bg-primary rounded p-1 my-2 text-white">'
				  	+ msg
				  	+'<span class="fecha">'+ formatearFecha(fecha) +'</span>'
				  +'</div>'
				+'</div>'
    		+'</div>'
    return nodo;
}

var formatearFecha = function(fecha){
	var tiempo = fecha.split(' ');
	var hora = tiempo[1].substring(0, 5);
	if( hora.substring(0, 2) >= '12' ){
		var viewFecha = hora +" PM";
	}
	else{
		if( hora.substring(0, 2) == '00' ){
			var minutos = hora.substring(2);
			hora = '12';
			hora = hora+""+minutos;
		}
		var viewFecha = hora +" AM";
	}
	var fullFecha = tiempo[0] + " " + viewFecha;
	return fullFecha;
}

var nodoChat = function(){
	var nodo = '<div class="chat-content">'+
    	'</div>'+
    	'<div class="chat-input border-top">'+
    		'<form class="form-inline mt-1" id="form-chat" method="POST" action="#">'+
			  '<label class="sr-only" for="inlineFormInputName2">Name</label>'+
			  '<input class="form-control form-control-sm" name="msg" id="msg" placeholder="Escribir mensaje" autocomplete="off" />'+
			  '<button type="submit" class="btn btn-primary btn-sm ml-2">Enviar</button>'+
			'</form>'+
    	'</div>';
    	return nodo;
}

var nodoForm = function(){
	var divForm = '<div class="alert alert-info mb-3 p-1">'+
			'Para poder Chatear con nosotros por favor llena el formulario.'+
		'</div>'+
		'<form action="#" method="GET" accept-charset="utf-8" role="formulario" id="loginChat">'+
		'<div class="form-group">'+
			'<label class="sr-only" for="name">Nombre</label>'+
			'<div class="input-group">'+
			    '<div class="input-group-prepend">'+
			    	'<div class="input-group-text" id="btnGroupAddon"><i class="fas fa-user"></i></div>'+
			    '</div>'+
				'<input type="text" name="name" id="name" class="form-control" placeholder="Ingresa tu nombre" title="Tu nombre" autocomplete="off" required />'+
			'</div>'+
		'</div>'+
		'<div class="form-group">'+
			'<label class="sr-only" for="correo">Correo</label>'+
			'<div class="input-group">'+
			    '<div class="input-group-prepend">'+
			    	'<div class="input-group-text" id="btnGroupAddon"><i class="fas fa-envelope"></i></div>'+
			    '</div>'+
				'<input type="email" name="correo" id="correo" class="form-control" placeholder="Ingresa tu correo eletrónico" title="Tu correo" autocomplete="off" required />'+
			'</div>'+
		'</div>'+
		'<button type="submit" class="btn btn-primary btn-block">Chatear</button>'+
	'</form>';
	return divForm;
}

var nodoAlert = function(){
	var divAlert = '<div class="alert alert-warning alert-dismissible fade show" id="alertFail" role="alert">'
			  +'<strong>!Upss¡</strong> Los sentimos surgió un problema, intenta nuevamente, gracias'
			  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
			   +'<span aria-hidden="true">&times;</span>'
			  +'</button>'
			+'</div>';
	return divAlert;
}

var enviarRegistro = function(){
	$('#chat-microtec #loginChat').submit(ev=>{
 		ev.preventDefault();
 		var data = $('#chat-microtec #loginChat').serializeArray();
 		data.push({name: 'fn', value: 'registrar'});
 		$.ajax({
 			url: 'php/Peticiones.php',
 			type: 'POST',
 			dataType: 'json',
 			data: data,
 			beforeSend: ()=>{
 				$('#chat-microtec .card-body').html('<img src="imgs/cargando2.gif" class="d-block mx-auto" style="width: 60px; margin-top: 4em;" />');
 			}
 		}).done(function(resp) {
 			console.log(resp);
 			if( resp.status === 1 ){
 				var divChat = nodoChat();
	 			$('#chat-microtec .card-body').empty();
	 			$('#chat-microtec .card-body').html(divChat);
	 			addSubmitChat();

 			}
 			else{
 				console.log('error de proceso')
 				var divAlert = nodoAlert();
	 			$('#chat-microtec .card-body').html(divAlert);
	 			$('#chat-microtec .card-body #alertFail').on('close.bs.alert', ev=>{
	 				var divForm = nodoForm();
					$('#chat-microtec .card-body').html(divForm);
					//volver a asignar el submit al formulario
					enviarRegistro();
				});	
 			}

 		}).fail(function(){
 			console.log("error de peticion");
 			var divAlert = nodoAlert();
 			$('#chat-microtec .card-body').html(divAlert);
 			$('#chat-microtec .card-body #alertFail').on('close.bs.alert', ev=>{
 				var divForm = nodoForm();
				$('#chat-microtec .card-body').html(divForm);
				//volver a asignar el submit al formulario
				enviarRegistro();
			});
 		});
 	});//ENdSUbmitLoginChat
}

var addSubmitChat = function(){
	$('#chat-microtec #form-chat').submit( (ev)=>{
		ev.preventDefault();
		if( $('#chat-microtec #msg').val().length > 0 ){
			
			var data = $('#chat-microtec #form-chat').serializeArray();
 			data.push({name: 'fn', value: 'enviarMsg'});
 			data.push({name: 'remitente', value: 1});//el que escrivbe es el cliente
 			console.log(data);
		  	//var nodoMsg = user( $('#chat-microtec #msg').val(), '2018-04-16 12:58:14' );
		  	
		  	//aqui voy a hacer el ajax para guardar en la base de datos.
		  	//al mismo tiempo para verse mas real agrego el nodo inmediatamente,
		  	//en resumen por tras envio el ajax cual el ajax se haya completado cargo el nodo con append
		  	
		  	$.ajax({
 			url: 'php/Peticiones.php',
 			type: 'POST',
 			dataType: 'json',
 			data: data
 			/*beforeSend: ()=>{
 				$('#chat-microtec .card-body').html('<img src="imgs/cargando2.gif" class="d-block mx-auto" style="width: 60px; margin-top: 4em;" />');
 			}*/
 			}).done((resp)=>{
 				console.log(resp);
 			}).fail(()=>{
 				console.log('Fallo el envio')
 			});
			
 			/*
		  	$('#chat-microtec .chat-content').append(nodoMsg);
		  	//firebase.database().ref('Chat').push({name: nombre.value, msg: msg.value});
		 	document.querySelector('#chat-microtec #form-chat').reset();
		 	autoScroll('#chat-microtec .chat-content');
		 	*/
		 	/*
		 	//respueta automatica
		 	setTimeout( ()=>{
				var nodoMt = microtec('Probando chat', '2018-04-16 12:58:14');
				$('#chat-microtec .chat-content').append(nodoMt);
				autoScroll('#chat-microtec .chat-content');
		 	}, 500);
		 	*/
		}	
 	});
}

var enviarMsg = function(){
	firebase.database().ref('Chat').push({name: nombre.value, msg: msg.value});
}