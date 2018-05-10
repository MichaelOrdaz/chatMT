<?php 

session_start();


$_SESSION['nombre'] = "Fernando Martinez Serrano";
$_SESSION['usr'] = "fSerrano940";
$_SESSION['dis'] = "mic015";

//fSerrano940
//67106237
/*
session_destroy();
$_SESSION = array();
*/

?>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Probando Firebase</title>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="assets/alertify/css/alertify.min.css">
	<link rel="stylesheet" type="text/css" href="assets/alertify/css/themes/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/inspinia/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="assets/css/chat.css">
</head>
<body>
<div class="panel panel-primary" id="chat-microtec" >
	<div class="hide">
		<span id="ndues"> <?php echo base64_encode( isset( $_SESSION['nombre'] ) ? $_SESSION['nombre'] : null ); ?> </span>
		<span id="ues">   <?php echo base64_encode( isset( $_SESSION['usr'] ) ? $_SESSION['usr'] : null ); ?> </span>
		<span id="cddu">  <?php echo base64_encode( isset( $_SESSION['dis'] ) ? $_SESSION['dis'] : null ); ?> </span>
	</div>
  <div class="panel-heading bg-microtec">
  	<button type="button" class="close" title="Cerrar Sesión" id="closeSession" style="color: white; visibility: hidden;">
  		<span class="end"> <i class="fa fa-sign-out"></i> </span>
	</button>
  	<button type="button" class="close" id="colapsar" title="Maximizar" style="margin: 0 2px; color: white; visibility: hidden;" >
  		<span class="up"><i class="fa fa-sort-up fa-lg"></i></span>
	</button>
  	Chat Micro-tec <i class="fa fa-comments" aria-hidden="true"></i>
  	</div>
  	<div class="panel-body">
  		<div class="alert alert-info" >
  			Para poder Chatear con nosotros por favor llena el formulario.
  		</div>
  		<form action="#" method="GET" accept-charset="utf-8" role="formulario" id="loginChat">
			<div class="form-group">
				<label class="sr-only" for="name">Nombre</label>
				<div class="input-group">
				    <span class="input-group-addon"><i class="fa fa-user"></i></span>
					<input type="text" name="name" id="name" class="form-control" placeholder="Ingresa tu nombre" title="Tu nombre" autocomplete="off" required />
				</div>
			</div>
			<div class="form-group">
				<label class="sr-only" for="correo">Correo</label>
				<div class="input-group">
				    	<span class="input-group-addon"><i class="fa fa-envelope"></i></span>
					<input type="email" name="correo" id="correo" class="form-control" placeholder="Ingresa tu correo eletrónico" title="Tu correo" autocomplete="off" required />
				</div>
			</div>
			<button type="submit" class="btn btn-primary btn-block">Chatear</button>
		</form>
  	</div>
</div>

<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js"></script>
<script src="assets/jquery/jquery-3.3.1.min.js"></script>
<script src="assets/popover/popover.js"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script type="text/javascript" src="assets/alertify/alertify.min.js"></script>
<script src="assets/js/chat-microtec.js"></script>

</body>
</html>