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
				alertify.error('No se cerró la sesión, intenta nuevamente');
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			alertify.error('No se cerró la sesión, intenta nuevamente');
			console.error(jqXHR);
			console.error(textStatus);
		});

	});




	$('#historialConversaciones tbody').on('click', 'tr', function(event) {
		//event.preventDefault();
		console.log( $(this).data('user') );
		var userId = $(this).data('user');

		$.ajax({
			url: "php/peticionesManager.php",
			type: "POST",
			dataType: "json",
			data: {'fn': 'getCoversacion', user: userId},
			beforeSend: ()=>{
				$('#conversacionPersonal').html('<img src="assets/imgs/cargando.gif" alt="cargando..." style="width: 60px; display: block; margin: 4rem auto" />');
			}
		}).done(function(json){
			
			if(json.status === 1){
				$('#conversacionPersonal').empty();
				
				$('#conversacionPersonal').html( nodoConversacion() );

				//alertify.success('Todo vbien');

				json.chat.forEach( item=>{
					
					var nodoMsg;
					if( item.remitente == 1 ){//si remitente es uno quiere decir que lo mando el usuario
						
						if( item.file !== null ){
							nodoMsg = userAdjunto(item.mensaje, item.fecha, item.file, item.userId);
						}
						else{//si no es un adjuinto
							nodoMsg = user(item.mensaje, item.fecha);
						}
					}
					else{//si no es asi lo mando microtec

						if( item.file !== null ){
							nodoMsg = microtecAdjunto(item.mensaje, item.fecha,item.file, item.userId);
						}
						else{
							nodoMsg = microtec(item.mensaje, item.fecha);
						}
					}

					$('#conversacionPersonal .panel .panel-body').append(nodoMsg);
					autoScroll('#conversacionPersonal .panel .panel-body');
				});

			}
			else{
				alertify.error('El usuario no tiene conversación');
			}

		}).fail(function(jqXHR, textStatus, errorThrown){
			alertify.error('Error al cargar la conversación, intenta nuevamente');
			console.error(jqXHR);
			console.error(textStatus);
		});

	});
	//Cargar las personas que han tenido conversaciones anteriores
	getChats();

});//ENdDocuemntReady

var autoScroll = function(nodo){
	$(nodo).animate({ scrollTop: $(nodo)[0].scrollHeight}, 0);
}

function getChats(){
	$.ajax({
		url: "php/peticionesManager.php",
		type: "POST",
		dataType: "json",
		data: {'fn': 'getChats'},
		beforeSend: ()=>{
			swal({
			  	title: 'Cargando Conversaciones',
			  	onOpen: () => {
			    	swal.showLoading()
			 	 },
				allowOutsideClick: false
			})
		}
	}).done(function(json){
		if(json.status === 1){

			/////////////////////////////////////////////
			$('#historialConversaciones tbody').empty();
			
			if ( $.fn.dataTable.isDataTable( '#historialConversaciones' ) ) {
				$('#historialConversaciones').DataTable().destroy();
			}
			
			var body = "";
			json.chats.forEach(chat=>{
				body += '<tr data-user="'+chat.userId+'">'
					+'<td>'+chat.nombre+'</td>'
					+'<td>'+chat.fecha+'</td>'
				+'</tr>';
			});

			$('#historialConversaciones tbody').html(body);
			
			$('#historialConversaciones').DataTable({
				"language": {
                	"url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
            	},
            	responsive: true,
        		"order": [[ 1, "desc" ]]
    		});
    		///////////////////////


		}
		else{
			alertify.message('No hay Conversaciones');
		}
		swal.close();
	}).fail(function(jqXHR, textStatus, errorThrown){
		swal.close();
		alertify.error('Fallo la carga, refresca la pagina nuevamente');
		console.error(jqXHR);
		console.error(textStatus);
	});
}



var nodoConversacion = function(idUser){
	//modificar el popover
	var panel = '<div class="panel panel-primary zoomInDown">'+
	  '<div class="panel-heading">Conversación con <a href="javascript://" style="color: orange; font-weight: bold"> </a> </div>'+
	  '<div class="panel-body" style="height: 400px; overflow-y: auto;"> </div>'+
	'</div>';
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
	var nodo = '<div class="user" style="background: #EBEBEB">'+
		"<a  href='https://www.micro-tec.com.mx/pagina/chatMT/php/d_doc.php?f=" + id + "&p=" + file + "'>" + msg + "</a> "+
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
				  +'<div class="media-body bg-primary">'
				  	+"<a href='https://www.micro-tec.com.mx/pagina/chatMT/php/d_doc.php?f=" + id + "&p=" + file + "'>" + msg + "</a> "
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