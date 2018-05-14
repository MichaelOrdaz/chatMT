<?php
header("Content-type: application/json");
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

require_once "autoload.php";
date_default_timezone_set('America/Mexico_City');

include ("/var/www/api/antisql.php");


$fn = $_POST['fn'];

function registrar($post){
	session_start();
	$user = new UserChat();
	$user->nombre = $post['name'];
	$user->correo = $post['correo'];
	$user->usuario = 'no aplica';
	$user->origen= 'Portal Web';
	$id = $user->set();
	if( $id > 0 ){
		$data = array('status'=>1, 'id'=>$id);
		$_SESSION['idUser'] = $id;
	}
	else{
		$data = array('status'=>0);
	}
	return $data;
}

function registrarSamtec($post){
	session_start();
	$user = new UserChat();
	$user->nombre = $post['name'];
	$user->correo = $post['correo'];
	$user->usuario = $post['user'];
	$user->origen = 'Samtec';
	$id = $user->set();
	if( $id > 0 ){
		$data = array('status'=>1, 'id'=>$id);
		$_SESSION['idUser'] = $id;
	}
	else{
		$data = array('status'=>0);
	}
	return $data;
}

function checkSession($var=""){
	session_start();
	if( isset( $_SESSION['idUser'] ) ){
		
		$id = $_SESSION['idUser'];
		//si esta iniciada verificar la fecha y hora del ultimo mensaje que se mando
		$chat = new Chat();
		$lastMsg = $chat->getLast( $id );
		$fechaUltimoMsg = $lastMsg[0]->fechaExpiracion;

		$fechaActual = strtotime(date("d-m-Y H:i:s",time()));
		$fechaUltimoMsg = strtotime($fechaUltimoMsg);
		//echo "fecha actual normal: " . date("d-m-Y H:i:s",time()) . " fecha Unix " . $fechaActual . " fechaExpiracion " . $fechaUltimoMsg;
		//si a esa fecha y hora han pasado una hora eliminamos la session
		if( $fechaActual < $fechaUltimoMsg ){
			//echo "Esta en el tiempo de sesion aun permitido";
			//como la sesion an sigue vigente, cargamos todos los mesnajes de la sesion.
			$msgs = $chat->get( $id );
			return array('status'=>1, 'msg'=>$msgs);
		}
		else{
			//echo "La fecha expiracion ya paso";
			//si es falso destruyo la sesion, por que ya paso el periodo de acividad;
			//logOut();
			//pero despues de esto deberiamos de volver a checar la sesion, como le hago
			//deeria volver a llamar a checkSession? tal vez la falle pero la sesion seguirua activa hasta volver hacer la peticion nuevamente, o no??
			$_SESSION = array();
			session_destroy();
			return array('status'=>0, 'msg'=>'La sesión Expiró');
		}
	}
	//la sesion no esta iniciada
	else{
		//entonces que trabaje normalmente
		return array('status'=>0, 'msg'=>'No hay variables de sesion');
		
	}
}

function checkSessionSamtec($var=""){
	session_start();
	if( isset( $_SESSION['idUser'] ) ){
		$id = $_SESSION['idUser'];
		$chat = new Chat();
		$msgs = $chat->get( $id );
		return array('status'=>1, 'msg'=>$msgs);
	}
	else{
		return array('status'=>0, 'msg'=>'No hay variables de sesion');
	}
}

function logOut($var = ""){
	session_start();
	$_SESSION = array();
	if (session_destroy() )
		return array( 'status'=> 1, 'accion' => 'sesion destruida' );
	else
		return array( 'status'=> 0, 'accion' => 'error al destruir sesion' );
}


function enviarMsg($post){
	session_start();
	$chat = new Chat();
	$chat->file = null;
	$chat->ruta = null;
	$chat->mensaje = $post['msg'];
	$chat->userId = $_SESSION['idUser'];
	$chat->remitente = $post['remitente'];
	$chat->atendioId = $post['atendio'];
	$chat->status = $post['status'];
	//var_dump($chat);

	$lastId = $chat->set();
	if( $lastId > 0 ){
		$infoMsg = $chat->getOne($lastId);
		$data = array('status'=>1, 'msg'=>$infoMsg);
	}
	else{
		$data = array('status'=>0, 'msg'=>'mensaje no enviado', 'sesion'=>$_SESSION['idUser']);
	}
	return $data;
}

function getMsg($post){
	session_start();
	$chat = new Chat();
	$infoMsg = $chat->getOne($post['idChat']);
	if( $infoMsg ){
		$data = array('status'=>1, 'msg'=>$infoMsg);
	}
	else{
		$data = array('status'=>0, 'msg'=> 'No existe Msg');
	}
	return $data;
}


function consultarID($post){
	session_start();
	return array('id'=>$_SESSION['idUser']);
}


/* jose Luis*/
function test_subirArchivo($post){
	session_start();

	$chat = new Chat();
	$chat->file = $post['nombre'];
	$chat->ruta = md5($post['nombre'].$_SESSION['idUser']);

	$chat->mensaje = 'archivo adjunto '. $post['nombre'];
	$chat->userId = $_SESSION['idUser'];
	$chat->remitente = 1;
	$chat->atendioId = $post['atendio'];
	$chat->status = $post['status'];

	$lastId = $chat->set();

	if( $lastId ){
		$infoMsg = $chat->getOne($lastId);
		$data = array('status'=>1, 'msg'=>$infoMsg);
	}
	else{
		$data = array('status'=>0, 'msg'=> 'No existe Msg');
	}
	return $data;
}
/*jose Luis*/

$data = $fn($_POST);
echo json_encode($data);
?>