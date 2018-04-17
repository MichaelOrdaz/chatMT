/*Mis codigos js*/

/*Logeo de usuarios*/
$("#logeo").submit(function(ev){
	ev.preventDefault();
	$.ajax({
		url: "php/login.php",
		type: "POST",
		dataType: "json",
		data: $("#logeo").serializeArray(),
		beforeSend: function(){
			$("#logeo :submit").prop("disabled", true);
		}
	}).done(function(json){
			$("#logeo :submit").prop("disabled", false);
			if(json.success === 1){
				$("#resp").html('<div class="alert alert-success"><b>Correcto!! </b>sera redirigido automaticamente.</div>');
				var timer = setTimeout( ()=>{ window.location.href="dashboard.php"; }, 2000);
			}
			else{
				$("#resp").html('<div class="alert alert-danger"><b>Algo Mal,</b> '+json.msg+'.</div>');
			}
	}).fail(function(jqXHR, textStatus, errorThrown){
		//console.error("Error en la petición " + jqXHR + " estado " + textStatus);
	});
});

/*Fin del logeo de usuarios*/

/*Salir de la sesión*/
$("#logout").click(()=>{
	window.location.href = "php/logout.php";
});
/*Fin de salir sesion*/

/*validar video extension mp4*/
var validarVideo = function(formulario, input){
	formulario = formulario || "";
	if( formulario != "" ){
		document.querySelector(formulario+" "+input).addEventListener("change", function(ev){
		const TIPO = "mp4";
		var valor = this.value.replace(/\\/g, '/');
		var vectores = valor.split("/");
		var largo = vectores.length;
		var last = vectores[largo-1];
		var nv = last.split(".");
		var nlargo = nv.length;
		var nlast = nv[nlargo-1];
		if(nlast === TIPO){
			$(formulario+" :submit").prop("disabled", false);
		}
		else{
			$(formulario+" #msgFile").html('<p style="padding: 3px; margin-left: 3em; font-weigth: bold; " class="text-danger" >Solo archivos MP4</p>');
			$(formulario+" :submit").prop("disabled", true);
			setTimeout(function(){
				$(formulario+" #msgFile").empty();
			}, 2000);

		}

		});
	}
}
validarVideo("#newVideo", "#video");

//subir informacion de video
$("#newVideo").submit(function(ev){
	ev.preventDefault();
	var data = new FormData(document.querySelector("#newVideo"));
	$.ajax({
		url: "php/uploadFile.php",
 		type: "POST",
  		data: data,
  		dataType: "json",
  		processData: false,  // tell jQuery not to process the data
  		contentType: false,   // tell jQuery not to set contentType
  		beforeSend: function(){
  			$("#newVideo :submit").prop("disabled", true);
  		}
	}).done(function(json){
		swal(
		  'Estatus',
		  json.msg,
		  json.status
		);
		document.querySelector("#newVideo").reset();
		$("#newVideo :submit").prop("disabled", false);
		queryVideos();

	}).fail(function(jqXHR, textStatus, errorThrown){
		//console.error("Error en la petición " + jqXHR + " estado " + textStatus);
	});

});

var queryVideos = function(){
	$.ajax({
			url: "php/getAllVideos.php",
			type: "POST",
			dataType: "json",
			beforeSend: function(){
				$("#queryVideos").empty();
				$("#queryVideos").html("<p class='text-center'><i class='fas fa-sync fa-spin'></i></p>");

			}
		}).done(function(json){
			
			var reg = "";
			if(json.length == 0){
				reg += "<p class='text-primary lead text-center'>No hay Videos</p>";
			}
			else{
				reg+='<thead><tr> <th>Titulo</th> <th>Descripción</th> <th>Ver video</th> </tr>'
				reg+='</thead><tbody>';
				json.forEach(function(ob){
					reg+= '<tr> <td data-video="'+ob.vt_id+'">'+ob.vt_titulo+'</td> <td>'+ob.vt_descripcion+'</td> <td> <button class="btn btn-default" type="button" data-backdrop="static" title="Lanzar video" data-url="'+ob.vt_location.substring(3)+'" data-toggles="tooltip" data-toggle="modal" data-target="#videoModal" > <i class="fas fa-eye fa-lg"></i> </button> </td> </tr>';
				});
				reg+="</tbody>";
			}
			
			$("#queryVideos").html(reg);
			loadVideo();
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.error("Error en la petición " + jqXHR + " estado " + textStatus);
		});
}

//video subida listo

$(document).ready(function(){
	$('[data-toggles="tooltip"]').tooltip({container: "body"});
	$("video#demo").on("contextmenu", function(ev){
		//ev.preventDefault();
	});



});
/*Consulta de videos*/
var loadVideo = function(){
$('[data-target="#videoModal"]').click(function(ev){
	ev.preventDefault();
	$('#videoModal .modal-title').text( $(this).parent().prev().prev().text() );
	$('#videoModal #desVideo').html("<b>Descripción: </b>" + $(this).parent().prev().text() );

	var newRuta = $(this).data("url");
	$("video source").attr("src", newRuta);
	var video = document.querySelector("video#demo");
	video.load();
	//video.dataset.vt = $(this).parent().prev().prev().data("video");
	var id = $(this).parent().prev().prev().data("video");

	video.onended = function(){
		alert("Finalizo el video con id " + id +"\n ahora puedo marcarlo como que ya se vio y no puede reproducirse otra vez");
		/*
			esto lo debo hacer pero del lado del cliente. aun asi me sirve este codigo. yo como administrador lo veo las veces que quiera.
		*/
	}


});	
}

$("#editVideo").submit(function(ev){
	ev.preventDefault();
	//alert("Se enviara la informacion del formulario");
	var data = new FormData(document.querySelector("#editVideo"));
	$.ajax({
		url: "php/editVideo.php",
 		type: "POST",
  		data: data,
  		dataType: "json",
  		processData: false,  // tell jQuery not to process the data
  		contentType: false,   // tell jQuery not to set contentType
  		beforeSend: function(){
  			$("#editVideo :submit").prop("disabled", true);
  		}
	}).done(function(json){
		console.log(json);
		$("#modiVideoModal").modal('hide');
		swal(
		  'Estatus',
		  json.msg,
		  json.status
		);
		$("#editVideo :submit").prop("disabled", false);
		queryVideos();
	}).fail(function(jqXHR, textStatus, errorThrown){
		console.error("Error en la petición " + jqXHR + " estado " + textStatus);
	});
});


/*Controles del video */
var play = function(){
	var video = document.querySelector("video#demo");
	if( video.paused == false && video.ended == false ){//se reproduce y no ha finalizado
		video.pause();
		$("#play").empty();
		$("#play").html("<span class='glyphicon glyphicon-play'></span>");
		$("#play").attr('title', 'Play');
	}
	else{
		video.play();
		$("#play").empty();
		$("#play").html("<span class='glyphicon glyphicon-pause'></span>");
		$("#play").attr('title', 'Pause');
	}
}
$("#play").click( play );

$("button#minVol").click(function(ev){
	var video = document.querySelector("video#demo");
	if(video.volume > 0.){
		video.volume-=0.2;
		video.volume=video.volume.toFixed(1);
	}
});
$("button#maxVol").click(function(ev){
	var video = document.querySelector("video#demo");
	if(video.volume < 1.0){
		video.volume+=0.2;
	}
});
/*Fin de los controles*/
