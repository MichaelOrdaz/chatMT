<?php
//permitir dominios cruzados
header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if (strstr($_SERVER['HTTP_REFERER'], "promotormicrotec.mx")) {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Max-Age: 86400');
    }
}
//end allowed cross domain

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
