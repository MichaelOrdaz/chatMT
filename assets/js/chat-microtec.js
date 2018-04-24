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
 	
 	
 	verificarSesion();

	//cerrar la sesion del cliente
	$('#chat-microtec #closeSession').click(function(event) {
		console.log('click sobre cerrar');


		//para cerrar la sesión lo que necesito es hacer que se efectuen las siguientes acciones.
		//  eliminar las variables de sesion. SOLUCION una petición ajax eliminanado las variables de sesion
		//  colapsar el chat, SOLUCION animacion con jquery
		//  recargar el nodo. SOLUCION creo que seria la funcion checkSession
		// tambien neceito quye cuando se cierre la sesion se mande un mesaje al manager de que el usurio cerro su sesion. SOLUCION, enviar un mensaje
		//del add submit ya copie el codigo que manda el msg
		
		//para cerrar conrrectamente, primero deberia de eliminar mis variables de sesion, si fue correcto mando el mensaje de que abandono la sesion.
		//y finalmente oculto el chat, recargando la peticion

		//primero ajax que elimina las variables de sesion
		$.ajax({
			url: 'php/Peticiones.php',
			type: 'POST',
			dataType: 'json',
			data: {'fn': 'logOut'}
		}).done((resp)=>{
			if( resp.status == 1 ){


	 			
	 			//si se elimino la sesion, mando el mensaje que el usuario abandono la coversacion
	 			var data = $('#chat-microtec #form-chat').serializeArray();
				data.push({name: 'fn', value: 'enviarMsg'});
				data.push({name: 'remitente', value: 1});//el que escrivbe es el cliente
				data.push({name: 'atendio', value: $('#chat-microtec #form-chat #atendio').val() });//el que escrivbe es el cliente 
				data.push({name: 'status', value: ( $('#chat-microtec #form-chat #atendio').val() == '' ? 0: 1 ) });//SI no hay atendio el status es 0
				
				//console.log(data);
		  		$.ajax({
					url: 'php/Peticiones.php',
					type: 'POST',
					dataType: 'json',
					data: { fn: 'enviarMsg', 
							remitente: 1, 
							atendio: $('#chat-microtec #form-chat #atendio').val(), 
							status: ( $('#chat-microtec #form-chat #atendio').val() == '' ? 0: 1 ),
							msg: 'El cliente abandono la conversación'
						}
				}).done((resp)=>{
					if( resp.status == 1 ){
			 			//SI el mensaje se mando correctamente, el manager estara notificado de eso asi que pude el cerrar su sesion. no tengo que limpiar nada.
			 			//document.querySelector('#chat-microtec #form-chat').reset();
		  				firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
						//se mostrara el mensaje, pero que se vaya ocultando el div
						//aqui debeo de recordar que es clase. si esta abierto deberia ser down
						$('#chat-microtec').animate({
			 				bottom: '-300px'
			 			}, 1000);
			 			$(this).children().eq(0).removeClass(clase);
			 			$(this).children().eq(0).addClass('up');
			 			$(this).children().eq(0).html('<i class="fas fa-sort-up fa-lg"></i>');
			 			$(this).children().eq(0).attr('title', 'Maximizar');

					}
				}).fail(()=>{
					console.log('Fallo el envio');
					alertify.error("Error el enviar mensaje, intenta nuevamente");
				});



			}
		}).fail(()=>{
			console.log('Fallo al Cerrar sesion');
			alertify.error("Error al cerrar sesión, comprueba que se haya cerrado, gracias");
		});


	});//ENDCLICK

});//DocumentReady

var verificarSesion = function(){

//verificamos si hay sesion activa
 	$.ajax({
		url: 'php/Peticiones.php',
		type: 'POST',
		dataType: 'json',
		data: {'fn': 'checkSession'},
	}).done(function(resp) {
		//console.log(resp);
		if( resp.status == 0 ){
			enviarRegistro();
		}
		//si es falso es por que la sesion aun esta vigente, entonces cambiamos el DOM con los msg de la sesion.
		else{
			var divChat = nodoChat();
			$('#chat-microtec .card-body').empty();
			$('#chat-microtec .card-body').html(divChat);
			addSubmitChat();//agrego el evento submit al chat
			listenMsg( resp.msg[0].userId );
		}
	
	}).fail(function(){
		console.log('Falló la petición, verificar sesión');
		enviarRegistro();
	});

}

var autoScroll = function(nodo){
	$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 0);
}

var user = function(msg, fecha){
	fecha = fecha || "1970-01-01 00:00:00";
	var nodo = '<div class="user rounded p-1 my-2" style="background: #EBEBEB">'+ msg +
		'<span class="fecha">'+ formatearFecha(fecha) +'</span>'+
	'</div>';
	return nodo;
}

var microtec = function(msg, fecha){
	var nodo = '<div class="microtec">'
    			+'<div class="media">'
				  +'<img class="mr-3 mt-2" src="assets/imgs/logomt.jpg" alt="logo-micro-tec" />'
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
		var minutosPM = hora.substring(2);
		hora = hora.substring(0, 2);
		hora = parseInt(hora);
		switch (hora) {
			case 13: hora = "01"; break;
			case 14: hora = "02"; break;
			case 15: hora = "03"; break;
			case 16: hora = "04"; break;
			case 17: hora = "05"; break;
			case 18: hora = "06"; break;
			case 19: hora = "07"; break;
			case 20: hora = "08"; break;
			case 21: hora = "09"; break;
			case 22: hora = "10"; break;
			case 23: hora = "11"; break;
		}
		hora = hora+minutosPM; 
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
    		'<form class="form-inline mt-1" id="form-chat" method="POST" action="#" enctype="multipart/form-data">'+
			  '<input type="hidden" name="atendio" id="atendio" />'+
			  '<input class="form-control form-control-sm" name="msg" id="msg" placeholder="Escribir mensaje" autocomplete="off" />'+
			  //'<button type="submit" class="btn btn-primary btn-sm ml-2">Enviar</button>'+
			  '<button type="button" id="adjunto" class="btn btn-primary rounded-circle btn-sm ml-2" title="Seleccionar Archivo"><i class="fas fa-paperclip"></i></button>'+
			  '<button type="submit" class="btn btn-primary rounded-circle btn-sm ml-2" title="Enviar"><i class="fas fa-location-arrow"></i></button>'+
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
 				$('#chat-microtec .card-body').html('<img src="assets/imgs/cargando2.gif" class="d-block mx-auto" style="width: 60px; margin-top: 4em;" />');
 			}
 		}).done(function(resp) {
 			//console.log(resp);
 			if( resp.status === 1 ){
 				var divChat = nodoChat();
	 			$('#chat-microtec .card-body').empty();
	 			$('#chat-microtec .card-body').html(divChat);
	 			addSubmitChat();
	 			listenMsg(resp.id);

 			}
 			else{
 				//console.log('error de proceso')
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

	//btnAdjunto();

	$('#chat-microtec #form-chat').submit( (ev)=>{
		ev.preventDefault();
		if( $('#chat-microtec #msg').val().length > 0 ){
			var data = $('#chat-microtec #form-chat').serializeArray();
 			data.push({name: 'fn', value: 'enviarMsg'});
 			data.push({name: 'remitente', value: 1});//el que escrivbe es el cliente
 			data.push({name: 'atendio', value: $('#chat-microtec #form-chat #atendio').val() });//el que escrivbe es el cliente 
 			data.push({name: 'status', value: ( $('#chat-microtec #form-chat #atendio').val() == '' ? 0: 1 ) });//SI no hay atendio el status es 0
 			
 			//console.log(data);
		  	$.ajax({
 			url: 'php/Peticiones.php',
 			type: 'POST',
 			dataType: 'json',
 			data: data
 			}).done((resp)=>{
 				//console.log(resp);
 				if( resp.status == 1 ){
 					//var nodoMsg = user( resp.msg[0].mensaje, resp.msg[0].fecha );
		  			//$('#chat-microtec .chat-content').append(nodoMsg);
			 		//autoScroll('#chat-microtec .chat-content');
			 		document.querySelector('#chat-microtec #form-chat').reset();
		  			firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
 				}
 			}).fail(()=>{
 				console.log('Fallo el envio');
 				alertify.error("Error el enviar mensaje, intenta nuevamente");
 			});
		}
 	});
}

var listenMsg = function(usuario){
	var usuario = usuario || '';
	firebase.database().ref('Chat').on('child_added', snapshot=>{
  		var userMongo = snapshot.val().userId;
  		var chatId = snapshot.val().idChat;
  		var elMsg = snapshot.val().msg;
  		if( userMongo == usuario ){//si el user de MONGODB es igual al que esta en la pagina web entonces dibujamos su mensaje
	 		var data = [{ name: 'fn', value: 'getMsg' }];
	 		data.push( { name: 'idChat', value: chatId });
	 		$.ajax({
	 			url: 'php/Peticiones.php',
	 			type: 'POST',
	 			dataType: 'json',
	 			data: data
	 		}).done(function(resp){
	 			var nodoMsg;
	 			$('#chat-microtec #form-chat #atendio').val(resp.msg[0].atendioId);
	 			if( resp.msg[0].remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
					nodoMsg = user(resp.msg[0].mensaje, resp.msg[0].fecha);
				}
				else{//si no es asi lo mando microtec
					nodoMsg = microtec(resp.msg[0].mensaje, resp.msg[0].fecha);
				}
				$('#chat-microtec .chat-content').append(nodoMsg);
				autoScroll('#chat-microtec .chat-content');
	 		}).fail(function(){
	 			console.log('fallo peticion chatId en firebase');
	 		});
  		}
  		else{
  			//si es falso quiere decir que el mensaje no pertenece al usuario y por lo tanto no necesito saber nada de el.
  		}
  	});
}


var btnAdjunto = function(){
	//var inputFile =  $('#chat-microtec #adjunto');
	var inputHidden = '<input type="file" name="attachment" id="attachment" class="d-none" />';
	$("#chat-microtec #form-chat #msg").after(inputHidden);
	
	$("#chat-microtec #form-chat #attachment").change((ev)=>{
		var nodoFile = document.querySelector("#chat-microtec #form-chat #attachment");
		var txt = "";
		if('files' in nodoFile){
			if (nodoFile.files.length == 0) {
		        txt += "Seleccionar Archivo";
		    } else {
		        
		        for (var i = 0; i < nodoFile.files.length; i++) {
		            if ('name' in nodoFile.files[i]) {
		                txt += nodoFile.files[i].name;
		            }
		            else
		            	txt += 'Desconocido';
		        }

		    }

		}
		$('#chat-microtec #adjunto').attr('title', txt);
	});



	$('#chat-microtec #adjunto').on('click', function(event) {
		$("#chat-microtec #form-chat #attachment").trigger('click');
	});

}