<?php 
	include ("/var/www/api/mtools.php");

	//instancia con el nombre de la variable de subida
	$tools = new MtcTools("file");
	// comprobar si existe
	$file = "img/tar/eee.png";
	$res=$tools->exist($file);
	if ($res) {
		//se descarga el archivo con el nombre asignado
		$res=$tools->download($file, 'eee1.png');
	}

 ?>