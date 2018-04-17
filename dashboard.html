<?php
include_once("php/header.php");
?>
<!-- slide -->
	<div class="container-fluid">
	<div class="row">
  <div class="col-sm-3">
    <div class="sidebar-nav">
      <div class="navbar navbar-inverse" role="navigation">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <span class="visible-xs navbar-brand">Menu</span>
        </div>
        <div class="navbar-collapse collapse sidebar-navbar-collapse">
          <ul class="nav navbar-nav">
           <!-- <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Videos <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li><a href="#">Administrar Videos</a></li>
              </ul>
            </li>
        -->
            <li class="active"><a href="#">Administrar Videos</a></li>
            <li class=""><a href="#">Usuarios Ventas</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>
  </div>
  <div class="col-sm-9">
  	<!-- beggin code -->
  	<ul class="nav nav-tabs">
	  <li class="active"><a data-toggle="tab" href="#home">Consultar</a></li>
	  <li><a data-toggle="tab" href="#menu1">Agregar</a></li>
	</ul>

	<div class="tab-content">
	  <div id="home" class="tab-pane fade in active">
	    <div class="row">
			<div class="col-md-10">
		
				<h3>Lista de videos</h3>
				<div class="table-responsive" >
					<table class="table table-bordered table-hover" id="queryVideos">
					</table>					
				</div><!-- table -->

			</div><!-- col -->
	    </div><!-- row -->
	  </div><!-- home -->
	  <div id="menu1" class="tab-pane fade">
	    <div class="row">
			<div class="col-md-10 col-md-offset-1">
				<h3>Agregar Nuevo Video</h3>
				<form role="form" name="newVideo" enctype="multipart/form-data" id="newVideo" action="#" method="POST">
						<div class="form-group">
							<label for="titulo">Titulo</label>
							<input type="text" name="titulo" class="form-control" id="titulo" maxlength="100" placeholder="Agregar Titulo al video" required />
						</div>
						<div class="form-group">
							<label for="descrip">Descripción</label>
							<textarea name="descrip" id="descrip" class="form-control" placeholder="Breve Descripción" maxlength="200"></textarea>
						</div>
						<div class="form-group">
							<label for="video">Elegir video</label>
							<input type="file" name="video" id="video" required />
							<div id="msgFile"></div>
						</div>
						<button type="submit" class="btn btn-primary btn-block btn-lg">Agregar</button>
				</form>
			</div>
	    </div>
	  </div>
	</div>


  </div>
</div>
</div>
<?php
include_once("php/footer.php");
?>
<script>
	$("#newVideo :submit").prop("disabled", true);
	$(function(){
		queryVideos();
		/*Limpiar formualrios despues de eventos*/
		$('.nav-tabs a').on('hide.bs.tab', function(e){
        	document.querySelector("#newVideo").reset();
    	});
$("#modiVideoModal").on("hide.bs.modal", function(){
	document.querySelector("#editVideo").reset();
});

/*End clear forms*/
	  	var $contextMenu = $("#contextMenu");

	 	$("body").on("contextmenu", "#queryVideos tbody tr", function(e) {
		    e.preventDefault();
		    $contextMenu.css({
		      display: "block",
		      left: e.pageX,
		      top: e.pageY
		    });
		    var vt_id = $(this).children().eq(0).data("video");
		    $("#contextMenu").data("video", vt_id);//creo el atributo data-video en contextmenu
	  	});//Fin context  menu

	  	$(document).click(function(e){
	        $contextMenu.hide();
	   	});

	  	/*Manupilar la pause del video desde el evento modal*/
	  	$("#videoModal").on("hide.bs.modal", function(){

	  	});



	});

/* Acciones al menu contextual */
$("#contextMenu #edit").click(function(ev){
	var vt_id = $(this).parents("#contextMenu").data("video");
	//console.log(vt_id);
	$.ajax({
			url: "php/getVideo.php",
			type: "POST",
			dataType: "json",
			data: {vt_id: vt_id},
			beforeSend: function(){
				//algo que hacer
				document.querySelector("#editVideo").reset();
			}
	}).done(function(json){
		$("#editVideo #titulo").val(json.vt_titulo);
		$("#editVideo #descrip").val(json.vt_descripcion);
		$("#editVideo #vt").val(json.vt_id);
		$("#editVideo #location").val(json.vt_location);
		$("#modiVideoModal").modal();
		//agregar el evento change a el input		
		validarVideo("#editVideo", "#video");
		$("#editVideo #video").change(function(){
			var $valor = $(this).val();
			if( $valor.length == 0 ){
				$("#editVideo :submit").prop("disabled", false);
			}
		});

	}).fail(function(jqXHR, textStatus, errorThrown){
		console.error("Error en la petición " + jqXHR + " estado " + textStatus);
	});

});

$("#contextMenu #questions").click(function(ev){
	var vt_id = $(this).parents("#contextMenu").data("video");
	console.log(vt_id);

});

$("#contextMenu #delete").click(function(ev){
	var vt_id = $(this).parents("#contextMenu").data("video");
	
	swal({
		  title: 'Eliminar!',
		  text: "¿Desea eliminar el video del sistema?",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, eliminar!'
	}).then((result) => {
		if (result.value) {
			$.ajax({
				url: "php/deleteVideo.php",
				type: "POST",
				dataType: "json",
				data: {vt_id: vt_id},
				beforeSend: function(){
					//algo que hacer
				}
			}).done(function(json){
				swal('Estatus', json.msg, json.type);
				queryVideos();
			}).fail(function(jqXHR, textStatus, errorThrown){
				//console.error("Error en la petición " + jqXHR + " estado " + textStatus);
			});
		}
		})
});




</script>