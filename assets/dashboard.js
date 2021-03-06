var config = {
	apiKey: "AIzaSyDslhX-yx99qdiBB4vFEa7pFl6oHjWfc_0",
	authDomain: "firstproject-41657.firebaseapp.com",
	databaseURL: "https://firstproject-41657.firebaseio.com",
	projectId: "firstproject-41657",
	storageBucket: "firstproject-41657.appspot.com",
	messagingSenderId: "19289644195"
};
firebase.initializeApp(config);

$(document).ready(function(){
	//priemro verificar si la sesion ya  se inicio
	/*
	$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: {'fn': 'checkSession'}
	}).done(function(json){
		//console.log(json);
		if(json.status == 1){	
			$('#nameSoporte').html(json.msg[0].nombre);
		}
		else{
			window.location.href = "manager";
		}
	}).fail(function(jqXHR, textStatus, errorThrown){
		console.error(jqXHR);
		console.error(textStatus);
	});
*/



//salir de sesion
	$('#logout').click(function(event) {
		event.preventDefault();
		$.ajax({
		url: "php/cs.php",
		type: "POST",
		dataType: "json"
		}).done(function(json){
			//console.log('success');
			if(json.status === 1){
				window.location.href = 'manager.html';
			}
			else{
				alertify.error('Error al cerrar la sesión, intenta nuevamente');
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			alertify.error('No se cerró la sesión, intenta nuevamente');
			console.error(jqXHR);
			console.error(textStatus);
		});
	});


 	/* Jose Luis */
 	$('body').on('change','.fileToUpload',function (evt) {
 		//var binario =  'path';
 		var binario =  $(this)[0].files[0];
 		var nombre = $(this)[0].files[0].name;
 		var tipo = $(this)[0].files[0].type;
 		var idUser = $(this).data('user');
 		console.log("$(this)", $(this));
 		console.log("idUser", idUser);
 		/*
 		$.ajax({
			url: 'php/peticionesManager.php',
			type: 'POST',
			dataType: 'json',
			data: { fn: 'consultarID'}
		}).done((resp)=>{

 			console.log("binario", binario);
 			console.log("nombre", nombre);
 			console.log("tipo", tipo);
			console.log('resp.id',resp.id);
 			test_subirArchivo(resp.id, nombre, binario,tipo,idUser);

			
		}).fail(()=>{
			console.log('error')	
		});
		*/
			console.log("binario", binario);
 			console.log("nombre", nombre);
 			console.log("tipo", tipo);
			console.log('resp.id', $('#idUser').text());
 			test_subirArchivo($('#idUser').text(), nombre, binario,tipo,idUser);

 	});
 	/* #END Jose Luis*/


	//cargamos los chat que no han sido atendidos, pero esto con un setTimeout y ademas sera cada 30 segundos que se haga la verificacion de las peticiones.
	//ajaxChatDetenidos();
	listenFirebase();

	//verificamos si ya habia conversaciones abiertas.
	//Si localStorage tiene identificadores guardados , debemos de volver a contruiirlos,
	//primero rescatamos los id..
	//Si no existe mi localStorage lo inicializo vacio
	if( localStorage.getItem('paneles') === null ){
		localStorage.setItem('paneles', JSON.stringify( {'paneles': [] } ) );
	}

	if( localStorage.getItem('paneles') !== null ){
		var info = JSON.parse( localStorage.getItem('paneles') );
		console.log(info);
		//ya recupere los ids, ahora deberia de crear un panel con su id
		//en el localStorage tengo almacenado el {id, nombre y correo}
		
		//creo el panel con el mismo procedimiento que cuando doy click en la tabla.
		//recorremos toda la información
		info.paneles.forEach( (info, index)=>{
			var newChat = nodoChatSoporte(info.id);//creo el nodo con el id del cliente
  			$('#containerChats').append(newChat);//agrego el nodo a mi contenedor

  			var selector = 'div#'+info.id+' .form-chat';
	  		var formulario = nodoFormChat();
	  		$('#containerChats #'+info.id+' .panel-body .chat-input').html(formulario);

	  		//cambiar el nombre de la conmversacion al del usuario
	  		$('#containerChats #'+info.id+ '[data-toggle="popover"]');
	  		$('#containerChats #'+info.id+ ' .panel-heading a').text(info.nombre);
	  		$('#containerChats #'+info.id+ ' .panel-heading a').popover({container: 'body', title: info.nombre, content: info.correo, trigger: 'hover', placement: 'top'});
	  		
	  		//agrego el evento click de cerrar al panel
  			addClickClose('div#'+info.id+' div.panel-heading > span.cerrar', info.id);
	  		addSubmit( selector, info.id );

		});

	}//endIf localStorage
	


});//EndReady

//select userId, (select MAX(fecha) ) as ultimoMsg from chats where status = 0 GROUP BY userId
//select us.nombre, (select MAX(ch.fecha) ) as ultimoMsg from chats ch INNER JOIN usertemporal us ON ch.userId=us.idUser where status = 0 GROUP BY userId
//select us.nombre, ch.userId, (select MAX(ch.fecha) ) as ultimoMsg from chats ch INNER JOIN usertemporal us ON ch.userId=us.idUser where status = 0 GROUP BY userId

var ajaxChatDetenidos = function(){
	$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: {'fn': 'chatDetenidos'}
	}).done(function(json){
		//console.log(json);
		//console.log('success');
		if(json.status === 1){
			$('#chats-detenidos tbody').empty();
			
			var tbody = '';
			json.chats.forEach(chat=>{

				var bg = '';
				if( chat.origen.trim() === "Portal Web" ){
					bg = 'rgba(255, 220, 180, 0.4)'
				}

				tbody += '<tr style="background: '+bg+'"><td>'+chat.nombre+'</td>'+'<td>'+chat.ultimoMsg+'</td>'+
				'<td>'+chat.origen+'</td>'+
				'<td><button type="button" class="btn btn-primary initChat" data-chat="'+chat.userId+'" data-correo="'+chat.correo+'">Chatear</button></td></tr>';
			

			});
			$('#chats-detenidos tbody').html( tbody );
		
			$('#badgeChat').html( (json.chats.length > 0 ? json.chats.length : 0) );
			//console.log( 'tamaño de cuantos chat son contenstar ' + json.chats.length );
			initChat();

		}
		else{
			$('#chats-detenidos tbody').empty();
			$('#chats-detenidos tbody').html('<tr> <td colspan="4"> Sin Conversaciones </td> </tr>');
		}
	}).fail(function(jqXHR, textStatus, errorThrown){
		console.error(jqXHR);
		console.error(textStatus);
	});

	//initChat();
}

var initChat = function(){
	
	$('button.initChat').on('click', ev=>{
		var idUser = ev.target.dataset.chat;
		var email = ev.target.dataset.correo;
		console.log( idUser);
  		var newChat = nodoChatSoporte(idUser);
  		$('#containerChats').append(newChat);
  		ev.target.disabled = true;
  		ev.target.parentNode.parentNode.style.opacity = '0';
  		ev.target.parentNode.parentNode.style.transition = 'all ease 1s';
  		ev.target.parentNode.parentNode.addEventListener('transitionend', ()=>{
  			ev.target.parentNode.parentNode.style.display = 'none';
  		}, false);

  		var nombreCliente = ev.target.parentNode.parentNode.firstElementChild.textContent;
  		var selector = 'div#'+idUser+' .form-chat';
  		var formulario = nodoFormChat();
  		$('#containerChats #'+idUser+' .panel-body .chat-input').html(formulario);

  		//cambiar el nombre de la conmversacion al del usuario
  		$('#containerChats #'+idUser+ '[data-toggle="popover"]');
  		$('#containerChats #'+idUser+ ' .panel-heading a').text(nombreCliente);
  		$('#containerChats #'+idUser+ ' .panel-heading a').popover({container: 'body', title: nombreCliente, content: email, trigger: 'hover', placement: 'top'});
  		
  		//agrego el evento click de cerrar al panel
  		addClickClose('div#'+idUser+' div.panel-heading > span.cerrar', idUser);

  		addSubmit( selector,idUser );
  		//asignar el atendioId
  		$.ajax({
			url: "php/peticionesManager.php",
			type: "POST",
			dataType: "json",
			data: {'fn': 'asignarManager', 'cliente': idUser, id: $('#idUser').text() }
		}).done(function(json){
			//el ajax lo hago simplemente para amarrar al cliente con un usuario de Soporte
			//aqui tambien guardo en localStorage la informacion del cliente.
			var paneles = JSON.parse( localStorage.getItem('paneles') );
			paneles.paneles.push( {nombre: nombreCliente, id: idUser, correo: email} );
			localStorage.setItem('paneles', JSON.stringify(paneles) );

		}).fail(function(jqXHR, textStatus, errorThrown){
			alertify.message('No se pudierón cargar los mensajes anteriores');
			console.error(jqXHR);
			console.error(textStatus);
		});

  		//ajax que me carga los messajes del usuario qye ya estan en espera, rescata los mensajes.
  		$.ajax({
			url: "php/peticionesManager.php",
			type: "POST",
			dataType: "json",
			data: {'fn': 'cargarMsgs', 'cliente': idUser},
			beforeSend: ()=>{
				swal({
				  title: 'Cargando Chat',
				  onOpen: () => {
				    swal.showLoading()
				  },
				  allowOutsideClick: false
				})
			}
		}).done(function(json){
			
			//console.log(json);

			json.chats.forEach( chat=>{
				
				var nodoMsg;
				
				if( chat.remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
					if( chat.file !== null && chat.file !== "" ){
						nodoMsg = userAdjunto(chat.mensaje, chat.fecha, chat.file, chat.userId);
					}
					else{//si no es un adjuinto
						nodoMsg = user(chat.mensaje, chat.fecha);
						if( chat.mensaje === 'El cliente abandonó la conversación' || chat.mensaje.trim() === 'El tiempo de la sesión expiró' ){
							$('#containerChats #'+idUser+' .panel-body .msg').prop('disabled', true);
							$('#containerChats #'+idUser+' .panel-body .adjunto').prop('disabled', true);
							$('#containerChats #'+idUser+' .panel-body :submit').prop('disabled', true);
						}
					}
				}
				else{//si no es asi lo mando microtec

					if( chat.file !== null && chat.file !== "" ){
						nodoMsg = microtecAdjunto(chat.mensaje, chat.fecha,chat.file, chat.userId);
					}
					else{
						nodoMsg = microtec(chat.mensaje, chat.fecha);
					}
				}

				$('#containerChats #'+idUser+' .panel-body .chat-content').append(nodoMsg);
				autoScroll('#containerChats #'+idUser+' .panel-body .chat-content');
			});

			//mi mensaje automatico
			var msgBot = 'Hola, le atiende ' + $('#nameSoporte > span:nth-child(2)').text().split(' ')[0] + ". ¿En qué puedo ayudarle?";
			var msgSoporte = microtec(msgBot);
				$.ajax({
					url: "php/peticionesManager.php",
					type: "POST",
					dataType: "json",
					data: {'fn': 'enviarMsg', 'cliente': idUser, 'msg': msgBot, id: $('#idUser').text()}
				}).done(function(json){
					console.log(json);
					if( json.status == 1 ){
						firebase.database().ref('Chat').push({idChat: json.msg[0].idChat, msg: json.msg[0].mensaje, userId: json.msg[0].userId });
					}
					else{
						console.log('No se envio el msg');
					}

				}).fail(function(jqXHR, textStatus, errorThrown){
					console.error(jqXHR);
					console.error(textStatus);
				});
			swal.close();

		}).fail(function(jqXHR, textStatus, errorThrown){
			swal.close();
			console.error(jqXHR);
			console.error(textStatus);
		});



	});

}

//este escuha los mensajes de un usuario determinado
var listenFirebase = function(){
	
	//escucha los nodos que se agregan
	firebase.database().ref('Chat').on('child_added', snapshot=>{
		var userMongo = snapshot.val().userId;
  		var chatId = snapshot.val().idChat;
  		var elMsg = snapshot.val().msg;
  		//cuando haya un cambio lanza el ajax
  		ajaxChatDetenidos();
  		//console.log(snapshot.val())
  		
  		var idUsuarios = [];
  		$('#containerChats .ventanaChat').each(function(index, el) {
			idUsuarios.push( $(this).attr('id') );
  		});

  		//console.log(idUsuarios);
  		//el usuario que mando el mensaje tiene un panel abierto para su conversacion.

  		if( idUsuarios.indexOf( userMongo ) != -1 ){
  			
  			//como el usuario si existe y tiene un panel abierto, hago el ajax para rescatar toda la informacion del msg
  			$.ajax({
				url: "php/peticionesManager.php",
				type: "POST",
				dataType: "json",
				data: {'fn': 'getOne', 'chat': chatId}
			}).done(function(json){
				
				console.log(json);

				json.chats.forEach( chat=>{
					
					var nodoMsg;
					if( chat.remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
						
						if( chat.file !== null && chat.file !== ""){
							nodoMsg = userAdjunto(chat.mensaje, chat.fecha, chat.file, chat.userId);
						}
						else{//si no es un adjuinto
							nodoMsg = user(chat.mensaje, chat.fecha);

							if( chat.mensaje === 'El cliente abandonó la conversación' || chat.mensaje.trim() === 'El tiempo de la sesión expiró' ){
								$('#containerChats #'+userMongo+' .panel-body .msg').prop('disabled', true);
								$('#containerChats #'+userMongo+' .panel-body .adjunto').prop('disabled', true);
								$('#containerChats #'+userMongo+' .panel-body :submit').prop('disabled', true);
							}

						}
					}
					else{//si no es asi lo mando microtec

						if( chat.file !== null && chat.file !== "" ){
							nodoMsg = microtecAdjunto(chat.mensaje, chat.fecha,chat.file, chat.userId);
						}
						else{
							
							nodoMsg = microtec(chat.mensaje, chat.fecha);
						}
					}

					$('#containerChats #'+userMongo+' .panel-body .chat-content').append(nodoMsg);
					autoScroll('#containerChats #'+userMongo+' .panel-body .chat-content');
				});
					
			}).fail(function(jqXHR, textStatus, errorThrown){
				alertify.message('Fallando el envio');
				console.error(jqXHR);
				console.error(textStatus);
			});

  			//$('#containerChats #'+userMongo+' .panel-body').append(elMsg);


  		}

  	});
}

var nodoChatSoporte = function(idUser){
	//modificar el popover
	var panel = '<div id="'+idUser+'" class="col-sm-6 ventanaChat"><div class="panel panel-primary" style="margin: 10px 0;">'+
	  '<div class="panel-heading">Conversación con <a href="javascript://" style="color: orange; font-weight: bold"> </a> <span id="cerrar'+idUser+'" class="cerrar pull-right" style="cursor: pointer" title="cerrar"> <i class="fa fa-times fa-lg"></i> </span> </div>'+
	  '<div class="panel-body">'+
	  '<div class="chat-content"></div>'+
	  '<div class="chat-input"></div>'+
	'</div></div>';
	return panel;
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
	var nodo = '<div class="user userAdjunto text-center" style="background: #EBEBEB">'+
		"<a href='https://www.micro-tec.com.mx/pagina/chatMT/php/d_doc.php?f=" + id + "&p=" + file + "'> <img src='assets/imgs/Descargar2.png' height='50' title='"+msg+"' alt='"+msg+"' /> </a> "+
		'<span class="fecha">'+ formatearFecha(fecha) +'</span>'+
	'</div>';
	return nodo;
}

var microtec = function(msg, fecha){
	fecha = fecha || "1970-01-01 00:00:00";
	var nodo = '<div class="microtec">'
    			+'<div class="media">'
				  +'<img class="media-object pull-right img-circle filterGray" src="assets/imgs/logomt.jpg" alt="logo-micro-tec" />'
				  +'<div class="media-body bg-primary">'
				  	+ msg
				  	+'<span class="fecha">'+ formatearFecha(fecha) +'</span>'
				  +'</div>'
				+'</div>'
    		+'</div>'
    return nodo;
}

var microtecAdjunto = function(msg, fecha, file, id){
	var nodo = '<div class="microtec">'
    			+'<div class="media">'
				  +'<img class="media-object pull-right img-circle" src="assets/imgs/logomt.jpg" alt="logo-micro-tec" />'
				  +'<div class="media-body bg-primary text-center">'
				  	+"<a href='https://www.micro-tec.com.mx/pagina/chatMT/php/d_doc.php?f=" + id + "&p=" + file + "'> <img src='assets/imgs/Descargar2.png' height='50' title='"+msg+"' alt='"+msg+"' /> </a>"
				  	+'<span class="fecha">'+ formatearFecha(fecha) +'</span>'
				  +'</div>'
				+'</div>'
    		+'</div>'
    return nodo;
}
//agregar el evento click al boton cerrar
var addClickClose = function(selector, id){
//addClickClose('div#'+idUser+' div.panel-heading > span.cerraridUser');
	$(selector).click(ev=>{
		
		swal({
		  title: '¿Eliminar?',
		  text: "Seguro que deseas cerrar la conversación",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, cerrar!',
		  cancelButtonText: 'cancelar'
		}).then((result) => {
		  if (result.value) {
		   	
		   	ev.currentTarget.parentNode.parentNode.parentNode.parentNode.removeChild(ev.currentTarget.parentNode.parentNode.parentNode);
			//una vez removido el nodo, tambien lo elimino del localStorage
			var paneles = JSON.parse( localStorage.getItem('paneles') );
			var misId = [];
			paneles.paneles.forEach( function(element, index) {
				misId.push( element.id );
			});
			var index = misId.indexOf(id);
			if( index !== -1 ){
				paneles.paneles.splice( index, 1 );
				localStorage.setItem('paneles', JSON.stringify(paneles) );
			}

		   	swal(
		      '¡Eliminado!',
		      'Conversación finalizada',
		      'success'
		    )
		  
		  }
		})

	});
}

var addSubmit = function(selector,idUser){
	btnAdjunto(selector,idUser);
//$('.form-chat').submit( (ev)=>{
$(selector).submit( (ev)=>{
	ev.preventDefault();
	//obtengo el id del panel el cual es el id del usuario.
	//var idCliente = ev.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
	var idCliente = ev.target.parentNode.parentNode.parentNode.parentNode.id;
	//recupero el txt del input
	var msg = $('div#'+idCliente+' .form-chat input.msg').val();
	
	msg = msg.trim();
	//////////////////////////////////////////////
	if( msg.length > 0 ){

		var data = [];
		data.push({name: 'fn', value: 'enviarMsg'});
		data.push({name: 'msg', value:  msg});
		data.push({name: 'id', value:  $('#idUser').text() });
		data.push({name: 'cliente', value: idCliente});
		
		if( typeof ev.target.dataset.locked === 'undefined' || ev.target.dataset.locked == "false"){

			/*
		$.ajax({
			url: 'php/peticionesManager.php',
			type: 'POST',
			dataType: 'json',
			data: data
		}).done((resp)=>{
			console.log(resp);
			if( resp.status == 1 ){
	 			$('div#'+idCliente+' .form-chat')[0].reset();
  				firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
			}
		}).fail(()=>{
			swal("Upss!!", "Lo sentimos ocurrio un error durante el envio del mensaje, intente nuevamente, gracias", "error");
			console.log('Fallo el envio');
		}).always(function(jqXHR, textStatus,errorThrown){
			ev.target.dataset.locked = "false";
		});
		*/

		
	  	$.ajax({
 			url: 'php/peticionesManager.php',
			type: 'POST',
			dataType: 'json',
			data: data,
 			beforeSend: ()=>{
 				ev.target.dataset.locked = "true";
 			}
			}).done((resp)=>{
				if( resp.status == 1 ){
	  				$('div#'+idCliente+' .form-chat')[0].reset();
	  				firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
				}
			}).fail((jqXHR, textStatus, errorThrown)=>{
				swal("Upss!!", "Lo sentimos ocurrio un error durante el envio del mensaje, intente nuevamente, gracias", "error");
				console.log('Fallo el envio');
			}).always(function(jqXHR, textStatus,errorThrown){
				ev.target.dataset.locked = "false";
			});
		}
		else{
			//console.log('formulario bloqueado')
		}

	}
	/////////////////////////////////////////////
});//endSubmit
}//endAddSubmit

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

var autoScroll = function(nodo){
	$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 0);
}


var nodoFormChat = function(){
	var nodo ='<form class="form-chat" method="POST" action="#" enctype="multipart/form-data" style="display: flex; flex-direction: row;">'+
			  '<input class="form-control msg" name="msg" placeholder="Escribir mensaje" autocomplete="off" />'+
			  //'<button type="submit" class="btn btn-primary btn-sm ml-2">Enviar</button>'+
			  '<button type="button" style="margin: 0 3px; border-radius: 50%;" class="btn btn-primary btn-sm adjunto" title="Seleccionar Archivo"><i class="fa fa-paperclip"></i></button>'+
			  '<button type="submit" class="btn btn-primary btn-sm" style="border-radius: 50%;" title="Enviar"> <i class="fa fa-paper-plane" aria-hidden="true"></i> </button>'+
			'</form>';
    	return nodo;
}


var btnAdjunto = function(selector,idUser){
	//var inputFile =  $('#chat-microtec #adjunto');
	//<input type="file" class="fileToUpload">
	var inputHidden = '<input type="file" data-user="'+idUser+'" name="attachment"  class="hide fileToUpload" />';
	$(selector+" .msg").after(inputHidden);
	

	$(selector+' .adjunto').on('click', function(event) {
		$(selector+" .fileToUpload").trigger('click');
		console.log('algo');
	});

}

/*Jose Luis*/
var test_subirArchivo = function(id,nombre,binario,tipo,idUser){
	console.log("idUser tsa", idUser);
	console.log("fun js test_subirArchivo");

/*test subir archivo*/
var data = new FormData();
data.append("archivo", binario);
data.append("nombre", nombre+idUser );
data.append("id", id );
//data.append("nombre", nombre);
var url = 'php/upld.php';

if(tipo == "image/jpeg" ||tipo == "image/jgp" ||tipo == "image/png" || tipo == 'application/pdf'){
	$.ajax({
	    url: url,
	    type: 'POST',
	    dataType: 'json',
	    contentType: false,
	    processData: false,
	    data: data,
	    beforeSend: function() {
	        swal({
			  title: 'Cargando archivo..',
			  onOpen: () => {
			    swal.showLoading()
			  },
			  allowOutsideClick: false
			});
	    },
	    success: function(result) {
		    swal.close();
		    console.log("result", result);
		    guardarRuta_file(nombre,idUser);

	    },
	    error: function (xhr, ajaxOptions, thrownError){
			console.log(xhr);
		}
	});
	
}
else{
	console.log('formato de archivo no aceptado');
}


/* #END# subir archivo */

}

var guardarRuta_file = function(nombre,idUser) {
	console.log("idUser grf", idUser);
	console.log("nombre grf", nombre);
		$.ajax({
		url: 'php/peticionesManager.php',
		type: 'POST',
		dataType: 'json',
		data: {'fn': 'test_subirArchivo',
			'nombre': nombre,
			idUsuario: idUser,
			id: $('#idUser').text()
		},
		success:function(resp) {
			console.log("response", resp);
			//$('div#'+idUser+' .form-chat')[0].reset();
		  	firebase.database().ref('Chat').push({idChat: resp.msg[0].idChat, msg: resp.msg[0].mensaje, userId: resp.msg[0].userId });
		},
		error: function (xhr, ajaxOptions, thrownError){
			console.log(xhr);
		}
	});
}
