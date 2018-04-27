<?php 
	include ("/var/www/api/mtools.php");

	//$folio=security($_GET['f']);
	$id=$_GET['f'];
	$nombre=$_GET['p'];

	//instancia con el nombre de la variable de subida
	$tools = new MtcTools("file");
	// comprobar si existe
	//$file = "img/tar/".$nombre;
	$file = "img/tar/".md5($nombre.$id);
	$res=$tools->exist($file);
	if ($res) {
		//se descarga el archivo con el nombre asignado
		$res=$tools->download($file, $nombre);
	}
	else{
		echo "algo salio mal";
	}

 ?>