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

$('#chat-microtec .panel-heading').on('click', (ev)=>{
	/*
	aqui debo de hacer la verifcacion de la variable, por medio de un

	 */

	var clase = $('#chat-microtec #colapsar').children().eq(0).attr('class');
 		if( clase == 'up' ){
 			$('#chat-microtec').animate({
 				bottom: '0'
 			}, 1000);
 			$('#chat-microtec #colapsar').children().eq(0).removeClass(clase);
 			$('#chat-microtec #colapsar').children().eq(0).addClass('down');
 			$('#chat-microtec #colapsar').children().eq(0).html('<i class="fa fa-sort-down fa-lg"></i>');
 			$('#chat-microtec #colapsar').children().eq(0).attr('title', 'Minimizar');
 		}
 		else{
 			$('#chat-microtec').animate({
 				bottom: '-295px'
 			}, 1000);
 			$('#chat-microtec #colapsar').children().eq(0).removeClass(clase);
 			$('#chat-microtec #colapsar').children().eq(0).addClass('up');
 			$('#chat-microtec #colapsar').children().eq(0).html('<i class="fa fa-sort-up fa-lg"></i>');
 			$('#chat-microtec #colapsar').children().eq(0).attr('title', 'Maximizar');
 		}
});
 	/* Jose Luis */
 	$('body').on('change','.fileToUpload',function (evt) {
 		//var binario =  'path';
 		var binario =  $(this)[0].files[0];
 		var nombre = $(this)[0].files[0].name;
 		var tipo = $(this)[0].files[0].type;
 		
 		$.ajax({
			url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
			type: 'POST',
			dataType: 'json',
			data: { fn: 'consultarID'}
		}).done((resp)=>{
 			test_subirArchivo(resp.id, nombre, binario,tipo);
		}).fail(()=>{
			//console.log('error')	
		});

 	});
 	/* #END Jose Luis*/

 	verificarSesion();

	//cerrar la sesion del cliente
	$('#chat-microtec #closeSession').click(function(event) {
		//console.log('click sobre cerrar');

		if( typeof $('#chat-microtec #form-chat #atendio').val() === 'undefined' ){
			alertify.message('Inicia sesion por favor');
		}
		else{
	 			$.ajax({
					url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
					type: 'POST',
					dataType: 'json',
					data: { fn: 'enviarMsg',
							remitente: 1, 
							atendio: $('#chat-microtec #form-chat #atendio').val(),
							status: ( $('#chat-microtec #form-chat #atendio').val() == '' ? 0: 1 ),
							msg: 'El cliente abandonó la conversación'
						}
				}).done((resp)=>{
					if( resp.status == 1 ){
			 			//SI el mensaje se mando correctamente, el manager estara notificado de eso asi que pude el cerrar su sesion. no tengo que limpiar nada.
			 			//document.querySelector('#chat-microtec #form-chat').reset();
		  				firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
						//se mostrara el mensaje, pero que se vaya ocultando el div
						//aqui debeo de recordar que es clase. si esta abierto deberia ser down
						var clase = $('#chat-microtec #colapsar').children().eq(0).attr('class');
				 		if( clase == 'up' ){
				 		}
				 		else{
				 			$('#chat-microtec').animate({
				 				bottom: '-300px'
				 			}, 1000);
				 			$('#chat-microtec #colapsar').children().eq(0).removeClass(clase);
				 			$('#chat-microtec #colapsar').children().eq(0).addClass('up');
				 			$('#chat-microtec #colapsar').children().eq(0).html('<i class="fas fa-sort-up fa-lg"></i>');
				 			$('#chat-microtec #colapsar').children().eq(0).attr('title', 'Maximizar');
				 		}
				 		alertify.message("Conversación finalizada, gracias");
				 		//aqui termino la ssesion de destruirla
				 		$.ajax({
							url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
							type: 'POST',
							dataType: 'json',
							data: {'fn': 'logOut'}
						}).done((resp)=>{
							if( resp.status == 1 ){
								//Finalmente verificamos la sesion que como sabemos debe de haberse finalizado y deberia verse el formulario.
			 					
								$('#chat-microtec #closeSession').css('visibility', 'hidden');
								var divForm = nodoForm();
								$('#chat-microtec .panel-body').html(divForm);
			 					verificarSesion();
							}
						}).fail(()=>{
							//console.log('Fallo al Cerrar sesion');
							alertify.error("Error al cerrar sesión, comprueba que se haya cerrado, gracias");
						});
			 			
					}
				}).fail(()=>{
					//console.log('Fallo el envio');
					alertify.error("Error el enviar mensaje, intenta nuevamente");
				});

			}//fin del else

	});//ENDCLICK

});//DocumentReady

var verificarSesion = function(){
//verificamos si hay sesion activa
 	var name = atob( $("#ndues").text() );
 	var user = atob( $("#ues").text() );
 	var dis = atob( $("#cddu").text() );
 	
 	//console.log("nombre : " + name, "usuario : " + user, "cod: " + dis);
 	
 	$.ajax({
		url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
		type: 'POST',
		dataType: 'json',
		data: {'fn': 'checkSessionSamtec'},
	}).done(function(resp) {
		//console.log(resp);
		
		if( resp.status == 0 ){
			//si es 0 no hay variables de sesion de chat
			if( name.length !== 0 && user.length !== 0 && dis.length !== 0 ){
		 		//las variables de sesion de samtec no existen lo doy de alta.
		 		//como la variable de sesion ya existe debo de darlo de alta en mi base de datos. y recuperar los mensajes minimo del dia de hoy.
		 		//y asi crear mis variables de sesion de chat
		 		
		 		$.ajax({
		 			url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
		 			type: 'POST',
		 			dataType: 'json',
		 			data: {name: name, correo: 'automatico', origen: 'SAMTEC', fn: 'registrarSamtec', user: user},
		 			beforeSend: ()=>{
		 				$('#chat-microtec .panel-body').html('<img src="assets/imgs/cargando2.gif" class="center-block" style="width: 60px; margin-top: 4em;" />');
		 			}
		 		}).done(function(resp) {
		 			console.log('Se registro el usuario de SAMTEC');
		 			//console.log(resp);
		 			if( resp.status === 1 ){

					//$('#chat-microtec #closeSession').css('visibility', 'visible');
		 				var divChat = nodoChat();
			 			$('#chat-microtec .panel-body').empty();
			 			$('#chat-microtec .panel-body').html(divChat);
			 			addSubmitChat();
			 			listenMsg(resp.id);
		 			}
		 			else{
		 				console.log('no se pudo registrar el usuario de samtec en mi tabla de usertemporal')
		 				var divSalir = nodoLogOut();
						$('#chat-microtec .panel-body').empty();
						$('#chat-microtec .panel-body').html(divSalir);
		 			}
		 		}).fail(function(){
		 			console.log('fallo el ajax de registro automatico')
		 			var divSalir = nodoLogOut();
					$('#chat-microtec .panel-body').empty();
					$('#chat-microtec .panel-body').html(divSalir);
		 		});
		 	
		 	}
		 	//aqui lo que hago es que si por alguna razon no llegara a encontar las variables de sesion, que no debe ser nunca el caso.
		 	//pues se registre otra vez con un nombre y correo.
		 	//cambio el proceso, ahora si llegara a pasar esto, mas facil mandar un mensaje en el cual diga que debe de cerrar sesion y volver a iniciar
		 	//en SAMTEC, ya que no encontro las variables de sesion.
		 	else{
		 		console.log('entro al else de que no hay varialbes de sesion de samtec ')
		 		var divSalir = nodoLogOut();
				$('#chat-microtec .panel-body').empty();
				$('#chat-microtec .panel-body').html(divSalir);
		 	}

		}
		//si es falso es por que la sesion aun esta vigente, entonces cambiamos el DOM con los msg de la sesion.
		else{
			if( resp.msg.length > 0 ){
				console.log('entro al escucha por que si hay variable de sesion de chat y ademas ya habia mensajes y los rescata');
				//$('#chat-microtec #closeSession').css('visibility', 'visible');
				var divChat = nodoChat();
				$('#chat-microtec .panel-body').empty();
				$('#chat-microtec .panel-body').html(divChat);
				addSubmitChat();//agrego el evento submit al chat
				listenMsg( resp.msg[0].userId );	
			}
			else{
				console.log('Si hay variable de sesion de chat pero no hay mensajes, entoncs lo vulevo a registrar como un nuevo chat');
				$.ajax({
		 			url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
		 			type: 'POST',
		 			dataType: 'json',
		 			data: {name: name, correo: 'automatico', origen: 'SAMTEC', fn: 'registrarSamtec'},
		 			beforeSend: ()=>{
		 				$('#chat-microtec .panel-body').html('<img src="assets/imgs/cargando2.gif" class="center-block" style="width: 60px; margin-top: 4em;" />');
		 			}
		 		}).done(function(resp) {
		 			console.log('Se registro el usuario de SAMTEC');
		 			//console.log(resp);
		 			if( resp.status === 1 ){

					//$('#chat-microtec #closeSession').css('visibility', 'visible');
		 				var divChat = nodoChat();
			 			$('#chat-microtec .panel-body').empty();
			 			$('#chat-microtec .panel-body').html(divChat);
			 			addSubmitChat();
			 			listenMsg(resp.id);
		 			}
		 			else{
		 				console.log('no se pudo registrar el usuario de samtec en mi tabla de usertemporal')
		 				var divSalir = nodoLogOut();
						$('#chat-microtec .panel-body').empty();
						$('#chat-microtec .panel-body').html(divSalir);
		 			}
		 		}).fail(function(){
		 			console.log('fallo el ajax de registro automatico')
		 			var divSalir = nodoLogOut();
					$('#chat-microtec .panel-body').empty();
					$('#chat-microtec .panel-body').html(divSalir);
		 		});
			}
			

		}
	
	}).fail(function(){
		//console.log('Falló la petición, verificar sesión');
		//enviarRegistro();
		var divSalir = nodoLogOut();
		$('#chat-microtec .panel-body').empty();
		$('#chat-microtec .panel-body').html(divSalir);
	});
}

var autoScroll = function(nodo){
	$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 0);
}

var user = function(msg, fecha){
	fecha = fecha || "1970-01-01 00:00:00";
	var nodo = '<div class="user" style="background: #EBEBEB">'+ msg +
		'<span class="fecha">'+ formatearFecha(fecha) +'</span>'+
	'</div>';
	return nodo;
}

var userAdjunto = function(msg, fecha, file, id){
	fecha = fecha || "1970-01-01 00:00:00";
	var nodo = '<div class="user userAdjunto text-center" >'
		+"<a href='https://www.micro-tec.com.mx/pagina/chatMT/php/d_doc.php?f=" + id + "&p=" + file + "'> <img src='assets/imgs/Descargar2.png' style='height: 50px; display: inline-block' title='"+msg+"' alt='"+msg+"' /> </a> "
		+'<span class="fecha">'+ formatearFecha(fecha) +'</span>'+
	'</div>';
	return nodo;
}

var microtec = function(msg, fecha){
	var f = new Date();
	var y, mo, d, h, min, s;
	y = f.getFullYear();
	mo = (f.getMonth()+1) < 10 ? '0'+(f.getMonth()+1): (f.getMonth()+1);
	d = f.getDay() < 10 ? '0'+f.getDay(): f.getDay()
	h = f.getHours() < 10 ? '0'+f.getHours(): f.getHours()
	min = f.getMinutes() < 10 ? '0'+f.getMinutes(): f.getMinutes();
	s = f.getSeconds() < 10 ? '0'+f.getSeconds(): f.getSeconds();
	fecha = fecha || y+"-"+mo+"-"+d+" "+h+":"+min+":"+s;


	var nodo = '<div class="microtec">'
		+'<div class="media">'
			+'<div class="pull-left">'
		  		+'<img class="media-object" src="assets/imgs/logomt.jpg" alt="logo-micro-tec" />'
		  	+'</div>'
		  	+'<div class="media-body bg-microtec text-white">'
		  		+'<p>'+msg+'</p>'
		  		+'<span class="fecha">'+ formatearFecha(fecha) +'</span>'
			+'</div>'
		+'</div>'
	+'</div>';
    return nodo;
}

var microtecAdjunto = function(msg, fecha, file, id){
	var nodo = '<div class="microtec">'
		+'<div class="media">'
			+'<div class="pull-left">'
		  		+'<img class="media-object" src="assets/imgs/logomt.jpg" alt="logo-micro-tec" />'
		  	+'</div>'
		  	+'<div class="media-body bg-microtec text-white text-center">'
		  		+"<p> <a href='https://www.micro-tec.com.mx/pagina/chatMT/php/d_doc.php?f=" + id + "&p=" + file + "'> <img src='assets/imgs/Descargar2.png' style='height: 50px; display: inline-block' title='"+msg+"' alt='"+msg+"' /> </a> </p>"
		  		+'<span class="fecha">'+ formatearFecha(fecha) +'</span>'
			+'</div>'
		+'</div>'
	+'</div>';
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
		microtec('Gracias por contactar el chat en vivo de MicroTec, ¿En que podemos ayudarle?')+
		microtec('Le recordamos que el horario de atención es de 10:00am a 7:00pm')+
    	'</div>'+
    	'<div class="chat-input">'+
    		'<form class="form-inline" id="form-chat" method="POST" action="#" enctype="multipart/form-data">'+
			  '<input type="hidden" name="atendio" id="atendio" />'+
			  '<input class="form-control form-control-sm" name="msg" id="msg" placeholder="Escribir mensaje" autocomplete="off" />'+
			  '<button type="button" id="adjunto" class="btn btn-primary btn-circle btn-sm ml" title="Seleccionar Archivo"><i class="fa fa-paperclip"></i></button>'+
			  '<button type="submit" class="btn btn-primary btn-circle btn-sm ml" title="Enviar"><i class="fa fa-paper-plane"></i></button>'+
			'</form>'+
    	'</div>';
    	return nodo;
}

var nodoForm = function(){
	var divForm = '<div class="alert alert-info" >'
  			+'Para poder Chatear con nosotros por favor llena el formulario.'
  		+'</div>'
  		+'<form action="#" method="GET" accept-charset="utf-8" role="formulario" id="loginChat">'
			+'<div class="form-group">'
				+'<label class="sr-only" for="name">Nombre</label>'
				+'<div class="input-group">'
				    +'<span class="input-group-addon"><i class="fa fa-user"></i></span>'
					+'<input type="text" name="name" id="name" class="form-control" placeholder="Ingresa tu nombre" title="Tu nombre" autocomplete="off" required />'
				+'</div>'
			+'</div>'
			+'<div class="form-group">'
				+'<label class="sr-only" for="correo">Correo</label>'
				+'<div class="input-group">'
				    	+'<span class="input-group-addon"><i class="fa fa-envelope"></i></span>'
					+'<input type="email" name="correo" id="correo" class="form-control" placeholder="Ingresa tu correo eletrónico" title="Tu correo" autocomplete="off" required />'
				+'</div>'
			+'</div>'
			+'<button type="submit" class="btn btn-primary btn-block">Chatear</button>'
		+'</form>';
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

var nodoLogOut = function(){
	var divAlert = '<div class="alert alert-warning" id="alertLogout" role="alert">'
			  +'<strong>!Upss¡</strong> Los sentimos surgió un problema al iniciar el Chat, le sugerimos, cerrar volver a iniciar sesión para poder chatear con nosotros, gracias'
			+'</div>';
	return divAlert;
}

var enviarRegistro = function(){
	$('#chat-microtec #loginChat').submit(ev=>{
 		ev.preventDefault();
 		var data = $('#chat-microtec #loginChat').serializeArray();
 		data.push({name: 'fn', value: 'registrarSamtec'});
 		$.ajax({
 			url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
 			type: 'POST',
 			dataType: 'json',
 			data: data,
 			beforeSend: ()=>{
 				$('#chat-microtec .panel-body').html('<img src="assets/imgs/cargando2.gif" class="center-block" style="width: 60px; margin-top: 4em;" />');
 			}
 		}).done(function(resp) {
 			//console.log(resp);
 			if( resp.status === 1 ){

			//$('#chat-microtec #closeSession').css('visibility', 'visible');
 				var divChat = nodoChat();
	 			$('#chat-microtec .panel-body').empty();
	 			$('#chat-microtec .panel-body').html(divChat);
	 			addSubmitChat();
	 			listenMsg(resp.id);

 			}
 			else{
 				//console.log('error de proceso')
 				var divAlert = nodoAlert();
	 			$('#chat-microtec .panel-body').html(divAlert);
	 			$('#chat-microtec .panel-body #alertFail').on('close.bs.alert', ev=>{
	 				var divForm = nodoForm();
					$('#chat-microtec .panel-body').html(divForm);
					//volver a asignar el submit al formulario
					enviarRegistro();
				});	
 			}
 		}).fail(function(){
 			//console.log("error de peticion");
 			var divAlert = nodoAlert();
 			$('#chat-microtec .panel-body').html(divAlert);
 			$('#chat-microtec .panel-body #alertFail').on('close.bs.alert', ev=>{
 				var divForm = nodoForm();
				$('#chat-microtec .panel-body').html(divForm);
				//volver a asignar el submit al formulario
				enviarRegistro();
			});
 		});
 	});//ENdSUbmitLoginChat
}


var statSend = false;
function checkSubmit() {
    if (!statSend) {
        statSend = true;
        return true;
    } else {
        alert("El formulario ya se esta enviando...");
        return false;
    }
}

var addSubmitChat = function(){

	btnAdjunto();

	$('#chat-microtec #form-chat').submit( (ev)=>{
		ev.preventDefault();//cancelo el envio
		if( $('#chat-microtec #msg').val().length > 0 ){
			var data = $('#chat-microtec #form-chat').serializeArray();
 			data.push({name: 'fn', value: 'enviarMsg'});
 			data.push({name: 'remitente', value: 1});//el que escrivbe es el cliente
 			data.push({name: 'atendio', value: $('#chat-microtec #form-chat #atendio').val() });//el que escrivbe es el cliente 
 			data.push({name: 'status', value: ( $('#chat-microtec #form-chat #atendio').val() == '' ? 0: 1 ) });//SI no hay atendio el status es 0
 			
 			if( typeof ev.target.dataset.locked === 'undefined' || ev.target.dataset.locked == "false"){

			  	$.ajax({
		 			url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
		 			type: 'POST',
		 			dataType: 'json',
		 			data: data,
		 			beforeSend: ()=>{
		 				ev.target.dataset.locked = "true";
		 			}
	 			}).done((resp)=>{
	 				if( resp.status == 1 ){
				 		document.querySelector('#chat-microtec #form-chat').reset();
			  			firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
	 				}
	 			}).fail((jqXHR, textStatus, errorThrown)=>{
	 				alertify.error("Error el enviar mensaje, intenta nuevamente");
	 			}).always(function(jqXHR, textStatus,errorThrown){
	 				ev.target.dataset.locked = "false";
	 			});
 			}
 			else{
 				//console.log('formulario bloqueado')
 			}
 			

		}
 	});


}

var listenMsg = function(usuario){
	var usuario = usuario || '';
	var seg = 0;
	

	firebase.database().ref('Chat').on('child_added', snapshot=>{

		//cada que se reciba un mensaje debo de hacer un timer o reiniciarlo.
		
  		var userMongo = snapshot.val().userId;
  		var chatId = snapshot.val().idChat;
  		var elMsg = snapshot.val().msg;
  		if( userMongo == usuario ){//si el user de MONGODB es igual al que esta en la pagina web entonces dibujamos su mensaje
	 		var data = [{ name: 'fn', value: 'getMsg' }];
	 		data.push( { name: 'idChat', value: chatId });
	 		$.ajax({
	 			url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
	 			type: 'POST',
	 			dataType: 'json',
	 			data: data
	 		}).done(function(resp){
	 			var nodoMsg;
	 			//console.log(resp);
	 			$('#chat-microtec #form-chat #atendio').val(resp.msg[0].atendioId);
	 			if( resp.msg[0].remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
					
					if( resp.msg[0].file !== null && resp.msg[0].file !== "" ){
						nodoMsg = userAdjunto(resp.msg[0].mensaje, resp.msg[0].fecha, resp.msg[0].file, resp.msg[0].userId);
					}
					else{//si no es un adjuinto

						nodoMsg = user(resp.msg[0].mensaje, resp.msg[0].fecha);
					}
				}
				else{//si no es asi lo mando microtec

					if( resp.msg[0].file !== null && resp.msg[0].file !== "" ){
						nodoMsg = microtecAdjunto(resp.msg[0].mensaje, resp.msg[0].fecha,resp.msg[0].file, resp.msg[0].userId);
					}
					else{
						
						nodoMsg = microtec(resp.msg[0].mensaje, resp.msg[0].fecha);
					}
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
	//<input type="file" class="fileToUpload">
	var inputHidden = '<input type="file" name="attachment" id="attachment" class="hide fileToUpload" />';
	$("#chat-microtec #form-chat #msg").after(inputHidden);
	

	$('#chat-microtec #adjunto').on('click', function(event) {
		$("#chat-microtec #form-chat #attachment").trigger('click');
	});

}

/*Jose Luis*/
var test_subirArchivo = function(id,nombre,binario,tipo){
	//console.log("fun js test_subirArchivo");

/*test subir archivo*/
var data = new FormData();
data.append("archivo", binario);
data.append("nombre", nombre+id );
//data.append("nombre", nombre);
data.append("id", id );
var url = 'https://www.micro-tec.com.mx/pagina/chatMT/php/upld.php';

if(tipo == "image/jpeg" ||tipo == "image/jgp" ||tipo == "image/png" || tipo == 'application/pdf'){
	$.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    contentType: false,
	    processData: false,
	    data: data,
	    beforeSend: function() {
	        alertify.message("Subiendo Archivo, espere por favor");
	    },
	    success: function(result) {
		   // console.log("result", result);
		    guardarRuta_file(nombre);

	    },
	    error: function (xhr, ajaxOptions, thrownError){
			console.log(xhr);
		}
	});
	
}
else{
	alertify.error("formato de archivo no aceptado. (PNG, JPG, JPEG, PDF)");
	//console.log('formato de archivo no aceptado');
}


/* #END# subir archivo */

}

var guardarRuta_file = function(nombre) {
		$.ajax({
		url: 'https://www.micro-tec.com.mx/pagina/chatMT/php/Peticiones.php',
		type: 'POST',
		dataType: 'json',
		data: {'fn': 'test_subirArchivo',
			'nombre': nombre,
			atendio: $('#chat-microtec #form-chat #atendio').val(),
			status: ( $('#chat-microtec #form-chat #atendio').val() == '' ? 0: 1 )
		},
		success:function(resp) {
			//console.log("response", resp);
			document.querySelector('#chat-microtec #form-chat').reset();
		  	firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
		},
		error: function (xhr, ajaxOptions, thrownError){
			console.log(xhr);
		}
	});
}


/*#END Jose Luis*/