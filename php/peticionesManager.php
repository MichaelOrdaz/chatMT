<?php 
header("Content-type: application/json");
require_once "autoload.php";
date_default_timezone_set('America/Mexico_City');

$fn = $_POST['fn'];

function login($post){
	session_start();
	$soporte = new UserSoporte();
	$info = $soporte->get($post['user']);
	if( $info ){
		$_SESSION['idSoporte'] = $info[0]->idSoporte;
		return array('status'=>1, 'data'=>$info);
	}
	else{
		return array('status'=>0, 'msg'=>'No hay registro');;
	}
}

function checkSession($var=""){
	session_start();
	//la sesion esta iniciada
	if( isset( $_SESSION['idSoporte'] ) ){
		$id = $_SESSION['idSoporte'];
		$soporte = new UserSoporte();
		$data = $soporte->getxId($id);
		return array('status'=>1, 'msg'=>$data);
	}
	else{
		return array('status'=>0, 'msg'=>'No hay variables de sesion');
	}
}

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

$data = $fn($_POST);
echo json_encode($data);
?>