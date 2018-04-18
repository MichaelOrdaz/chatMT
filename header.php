<?php
session_start();
if(!isset( $_SESSION['user']) ){
	header("location: index.php");
}
else{
?>
<!doctype html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1"  />
		<meta charset="utf-8">
		<link rel="shortcut icon" href="img/favicon.png" />
		<title>Microtec</title>
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<script src="js/fontawesome-all.min.js"></script>
		<!-- <link href="js/jquery-ui/jquery-ui.min.css" /> -->
	</head>
	<body id="dashboard">
	<div class="container-fluid">
		<div class="row">
			<nav class="navbar navbar-inverse navbar-static-top">
			  <div class="container-fluid">
			    <div class="navbar-header">
			      <a class="navbar-brand" href="#"><img src="img/logo.png" class="img-responsive" /></a>
			    </div>
			    <ul class="nav navbar-nav navbar-right">
			      <li><a href="#"><span class="glyphicon glyphicon-user"></span> <?php echo $_SESSION['user']; ?></a></li>
			      <li><a href="#" id="logout" ><span class="glyphicon glyphicon-log-out"></span> Salir</a></li>
			    </ul>
			  </div>
			</nav>
			<!-- end Navigation -->
		</div>
	</div>
<!-- endSlide -->

<?php } ?>