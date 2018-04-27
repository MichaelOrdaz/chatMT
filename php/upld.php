<?php
include_once("/var/www/api/antisql.php");
include ("/var/www/api/mtools.php");
//instancia con el nombre de la variable de subida
$tools = new MtcTools("archivo");
$nombre = $_POST['nombre'];
//echo "nombre: ".$nombre;
$_FILES["temp"]["name"]='img/tar/'.md5($nombre);
//$_FILES["temp"]["name"]='img/tar/'.md5($nombre.$id);
//se sube el archivo con el nombre asignado
$res=$tools->upload($_FILES["temp"]["name"]);
// devuelve booleano
echo json_encode( array($res) );
?>
