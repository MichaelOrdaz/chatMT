<?php
	session_start();
	include_once("/var/www/api/antisql.php");
	include_once("/var/www/api/bd.php");
	$meta=$_SERVER['REMOTE_ADDR']."|Chat Soporte|Web";
	$dbapi = new DataDb;
	//recupero datos
	$x=security($_POST['datos']);
	$k=explode(",",$x);
	$tipo=$k[0];

	// check
	if ($tipo==="check") {
		if (isset($_SESSION["userEncry"])) {
			echo "V|Sesion iniciada|".$_SESSION["userEncry"];
		} else {
			echo "X|No ha iniciado sesion".$_SESSION["userEncry"];
		}
	}

	// login
	if ($tipo=="l1") {
		//recuperamos datos
		$us=security($k[1]);
		$pw=security($k[2]);
		$cp=security($k[3]);
		//respuesta de google
		$valr=null;
		$secretKey="6LdYZyUTAAAAAFp739spu4Rpbg5VsUDu7QBFTlgi";
		$ip=$_SERVER['REMOTE_ADDR'];
		$response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$cp."&remoteip=".$ip);
		$responseKeys=json_decode($response,true);
		if(intval($responseKeys["success"]) !== 1) {
			$valr='S';
		} else {
			$valr='V';
		}
		//revisamos el captcha
		if ($valr==="V") {
			// revisamos el usuario y pass
			$sql="select u.nombre, u.user, u.dis, l.dis as suc, u.token, u.id from canal.usuarios u left join canal.lista l on u.dis=l.user where u.user='".$us."' and u.pass=canal.crypto('".$us."','".$pw."')";
			$result = $dbapi -> exec($sql, $meta);
			
			//var_dump($result);

			if ($row=$dbapi->fetch($result)) {

				if ($row["user"]==='carlosAlva516' || $row["user"]==='CristinaR412' || $row["user"]==='fSerrano940') {
					//creamos las variables de session
	    			//aqui le doy el nombre qa mi sesion
	    			$_SESSION["userEncry"]=md5($row["user"]);//nombre encriptado
	    			$_SESSION["user"]= $row["user"];//nombre del usuario
	    			$_SESSION["name"]= $row["nombre"];//nombre del usuario
	    			$_SESSION["id"]= $row["id"];//id

					echo "S|Ingresando al sistema";
				} else {
					echo "E|Sitio restringido";
				}
			} else {
				echo "E|Usuario o contraseña no validos";
			}
		} else {
			echo "E|Acceso no permitido, debe validar que no es un robot.";
		}
	}