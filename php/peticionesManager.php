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
		return array('status'=>1, 'msg'=>'Sesion existente');
	}
	else{
		return array('status'=>0, 'msg'=>'No hay variables de sesion');
	}
}

$data = $fn($_POST);
echo json_encode($data);
?>