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
	$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: {'fn': 'checkSession'}
	}).done(function(json){
		//console.log(json);
		if(json.status == 1){	
			$('.nav.navbar-nav.navbar-right span.glyphicon.glyphicon-user').after(" "+json.msg[0].nombre);
		}
		else{
			window.location.href = "manager";
		}
			
	}).fail(function(jqXHR, textStatus, errorThrown){
		console.error(jqXHR);
		console.error(textStatus);
	});

//salir de sesion
	$('#logout').click(function(event) {
		event.preventDefault();
		$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: {'fn': 'logOut'}
		}).done(function(json){
			//console.log('success');
			if(json.status === 1){
				window.location.href = 'manager';
			}
			else{
				alertify.error('No se cerro la sesión, intenta nuevamente');
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.error(jqXHR);
			console.error(textStatus);
		});

	});


	//cargamos los chat que no han sido atendidos, pero esto con un setTimeout y ademas sera cada 30 segundos que se haga la verificacion de las peticiones.
	//ajaxChatDetenidos();
	listenFirebase();
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
		console.log(json);
		//console.log('success');
		if(json.status === 1){
			$('#chats-detenidos tbody').empty();
			
			var tbody = '';
			json.chats.forEach(chat=>{
				tbody += '<tr><td>'+chat.nombre+'</td>'+'<td>'+chat.ultimoMsg+'</td>'+
				'<td><button type="button" class="btn btn-primary initChat" data-chat='+chat.userId+'>Chatear</button></td></tr>';
			});
			$('#chats-detenidos tbody').html( tbody );
			
			initChat();
		}
		else{
			$('#chats-detenidos tbody').empty();
			$('#chats-detenidos tbody').html('<tr> <td colspan="3"> Sin Conversaciones </td> </tr>');
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
		console.log( idUser);
  		var newChat = nodoChatSoporte(idUser);
  		$('#containerChats').append(newChat);
  		ev.target.disabled = true;
  		ev.target.parentNode.parentNode.style.opacity = '0';
  		ev.target.parentNode.parentNode.style.transition = 'all ease-out 1s';
  		ev.target.parentNode.parentNode.addEventListener('transitionend', ()=>{
  			ev.target.parentNode.parentNode.style.display = 'none';
  		}, false);

  		var formulario = nodoFormChat();
  		$('#containerChats #'+idUser+' .panel-body .chat-input').html(formulario);

  		//asignar el atendioId
  		$.ajax({
			url: "php/peticionesManager.php",
			type: "POST",
			dataType: "json",
			data: {'fn': 'asignarManager', 'cliente': idUser}
		}).done(function(json){
			console.log(json);
			
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.error(jqXHR);
			console.error(textStatus);
		});

  		//ev.target.parentNode.parentNode.hide('slow');
  		//ajax que me carga los messajes del usuario qye ya estan en espera
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
			
			console.log(json);

			json.chats.forEach( chat=>{
				
				var nodoMsg;
	 			if( chat.remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
					nodoMsg = user(chat.mensaje, chat.fecha);
				}
				else{//si no es asi lo mando microtec
					nodoMsg = microtec(chat.mensaje, chat.fecha);
				}
				$('#containerChats #'+idUser+' .panel-body .chat-content').append(nodoMsg);
				autoScroll('#containerChats #'+idUser+' .panel-body .chat-content');
			});

			//mi mansaje automatico
			var msgBot = 'En unos momentos uno de nuestros Agentes se comunicará contigo';
			var msgSoporte = microtec(msgBot);
				$.ajax({
					url: "php/peticionesManager.php",
					type: "POST",
					dataType: "json",
					data: {'fn': 'enviarMsg', 'cliente': idUser, 'msg': msgBot}
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

			//$('#containerChats #'+idUser+' .panel-body .chat-content').append(test);
			//autoScroll('#containerChats #'+idUser+' .panel-body .chat-content');
			

			swal.close();

		}).fail(function(jqXHR, textStatus, errorThrown){
			swal.close();
			console.error(jqXHR);
			console.error(textStatus);
		});



	});

}
//necestio que se actualice la tabla con cada mensaje nuevo recibido, como hago esto.
//pues necesitaria cuando cargue la pagina que cargue todos los nodos, el problema es que al cargas los nodos, presentaria un acarga al servidor en el procesamiento de los datos
//dejando esa parte de fuera necesito que desde el momento en que se entra escuhe los cambio en la base de datos
//cuando cargue necestio que escuhe y cargue la tabla.


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
  			//console.log("el", el);
  			//console.log(el.id);
			//console.log( $(this).attr('id') );
			idUsuarios.push( $(this).attr('id') );
  		});

  		console.log(idUsuarios);
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
						nodoMsg = user(chat.mensaje, chat.fecha);
					}
					else{//si no es asi lo mando microtec
						nodoMsg = microtec(chat.mensaje, chat.fecha);
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
	var panel = '<div id="'+idUser+'" class="col-sm-6 ventanaChat"><div class="panel panel-primary" style="margin: 10px 0;">'+
	  '<div class="panel-heading">Conversacion con SOMENAME</div>'+
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

var microtec = function(msg, fecha){
	fecha = fecha || "1970-01-01 00:00:00";
	var nodo = '<div class="microtec">'
    			+'<div class="media">'
				  +'<img class="media-object pull-right img-circle" src="https://i1.wp.com/wp.micro-tec.com.mx/wp-content/uploads/2017/11/cropped-microtec-2-1.png" alt="logo-micro-tec" />'
				  +'<div class="media-body bg-primary">'
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

var autoScroll = function(nodo){
	$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 100);
}


var nodoFormChat = function(){
	var nodo ='<div class="row"><form class="" id="form-chat" method="POST" action="#" enctype="multipart/form-data">'+
			  '<div class="col-xs-10"><input class="form-control" name="msg" id="msg" placeholder="Escribir mensaje" autocomplete="off" /> </div>'+
			  //'<button type="submit" class="btn btn-primary btn-sm ml-2">Enviar</button>'+
			  '<div class="col-xs-2"><button type="button" style="margin-right: 2px;" id="adjunto" class="btn btn-primary btn-sm" title="Seleccionar Archivo"><i class="fas fa-paperclip"></i></button>'+
			  '<button type="submit" class="btn btn-primary btn-sm" title="Enviar"><i class="fas fa-location-arrow"></i></button></div>'+
			'</form></div>';
    	return nodo;
}