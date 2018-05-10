<?php 
header("Content-type: application/json");
require_once "autoload.php";
date_default_timezone_set('America/Mexico_City');
include ("/var/www/api/antisql.php");

$fn = $_POST['fn'];

function logOut($var=""){
	session_start();
	$_SESSION = array();
	if (session_destroy() )
		return array('status'=>1, 'msg'=>'sesión destruida');
	else
		return array('status'=>0, 'msg'=>'Error al eliminar sesion');
}

function chatDetenidos( $post = array() ){
	session_start();
	$chats = new Chat();
	$data = $chats->chatDetenidos();
	if($data){
		return array('status'=>1, 'chats'=>$data);
	}
	else{
		return array('status'=>0, 'msg'=>$data);
	}
}

function cargarMsgs( $post = array() ){
	session_start();
	$chat = new Chat();
	$data = $chat->get( $post['cliente'] );
	if($data){
		return array('status'=>1, 'chats'=>$data);
	}
	else{
		return array('status'=>0, 'msg'=>'Sin Mensajes');
	}
}


function getOne($post){
	$chat = new Chat();
	$msg = $chat->getOne( $post['chat'] );
	if($msg){
		return array('status'=>1, 'chats'=>$msg);
	}
	else{
		return array('status'=>0, 'msg'=>'Sin Mensaje');
	}
}

function asignarManager( $post ){
	$soporte = $post['id'];
	$chat = new Chat();
	$res = $chat->asignarManager( $post['cliente'], $soporte );
	return array('status'=>1);

}

function enviarMsg($post){
	session_start();
	$chat = new Chat();
	$chat->mensaje = $post['msg'];
	$chat->userId = $post['cliente'];
	$chat->remitente = 2;
	$chat->atendioId = $post['id'];
	$chat->status = 1;
	$lastId = $chat->set();
	if( $lastId > 0 ){
		$infoMsg = $chat->getOne($lastId);
		$data = array('status'=>1, 'msg'=>$infoMsg);
	}
	else{
		$data = array('status'=>0, 'msg'=>'mensaje no enviado');
	}
	return $data;
}
/*
function consultarID($post){
	session_start();
	return array('id'=>$_SESSION['id']);
}
*/


/* jose Luis*/
function test_subirArchivo($post){
	session_start();

	$chat = new Chat();
	$chat->file = $post['nombre'];
	$chat->ruta = md5($post['nombre'].$post['id']);

	$chat->mensaje = 'archivo adjunto '. $post['nombre'];
	$chat->userId = $post['idUsuario'];
	$chat->remitente = 2;
	$chat->atendioId = $post['id'];
	$chat->status = 1;

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


function getChats($post = ""){
	$chat = new Chat();
	$data = $chat->userHistory();
	if($data){
		return array('status'=>1, 'chats'=>$data);
	}
	else{
		return array('status'=>0, 'msg'=>'Sin Conversaciones');
	}
}


function getCoversacion($post = ""){

	$chat = new Chat();
	$data = $chat->history($post['user']);
	if($data){
		return array('status'=>1, 'chat'=>$data);
	}
	else{
		return array('status'=>0, 'msg'=>'Sin Conversación');
	}

}

function getUserSamtec( $post = "" ){
	$user = new UserChat();
	$datos = $user->getSamtec( $post['username'] );
	if( $datos ){
		return array('status'=>1, 'datos'=>$datos);
	}
	else{
		return array('status'=>1, 'datos'=>'Usuario no encontrado');
	}
}
$data = $fn($_POST);
echo json_encode($data);
?>