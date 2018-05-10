<?php 
/**
* Clase Chat con los mensaje de los usuarios
*/
include_once("/var/www/api/bd.php");
class Chat{

	function __construct($user = ""){
		$this->user = $user;
	}

	public function set(){

		$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
		$dbapi = new DataDb;

		$atendio = $this->atendioId == '' ? null: $this->atendioId;
		$file = !isset( $this->file ) ? null: $this->file;
		$ruta = !isset( $this->ruta ) ? null: $this->ruta;
		$valores = [$this->mensaje, $this->userId, $this->remitente, $atendio, $this->status, $file, $ruta];
		
		$sql = "INSERT INTO chat_microtec.chats(mensaje, userId, remitente, atendioId, status, file, ruta) VALUES ( '{$this->mensaje}', '{$this->userId}', '{$this->remitente}', '{$atendio}', '{$this->status}', '{$file}', '{$ruta}' )";
		$res = $dbapi->exec($sql, $meta);
		return $dbapi->idMod;
		/*
		$this->sql = "INSERT INTO chat_microtec.chats(mensaje, userId, remitente, atendioId, status, file, ruta) VALUES ( ?, ?, ?, ?, ?, ?, ? )";
		$this->runQuery( $valores );
		return $this->data;
		*/
	}

	public function get($id=""){
		$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
		$dbapi = new DataDb;

		if( $id == "" ){
			$sql = "SELECT * FROM chat_microtec.chats";
			$res = $dbapi->exec($sql, $meta);
			return $res;
			/*
			$this->sql = "SELECT * FROM chat_microtec.chats";
			$this->runQuery();
			return $this->data;
			*/
		}
		else{
			$sql = "SELECT * FROM chat_microtec.chats WHERE userId = $id ORDER BY fecha ASC";
			$res = $dbapi->exec($sql, $meta);
			return $res;
			/*
			$this->sql = "SELECT * FROM chat_microtec.chats WHERE userId = ? ORDER BY fecha ASC";
			$this->runQuery([$id]);
			return $this->data;
			*/
		}
	}
	protected function delete(){}
	protected function update(){}

	public function getLast($id = ""){

		if( $id != ''){

			$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
			$dbapi = new DataDb;
			$sql = "SELECT *, DATE_ADD(fecha, INTERVAL 15 MINUTE) as fechaExpiracion FROM chat_microtec.chats WHERE fecha = (SELECT MAX(fecha) FROM chat_microtec.chats WHERE userId = $id)";
			$res = $dbapi->exec($sql, $meta);
			return $res;

			/*
			$this->sql = "SELECT *, DATE_ADD(fecha, INTERVAL 15 MINUTE) as fechaExpiracion FROM chat_microtec.chats WHERE fecha = (SELECT MAX(fecha) FROM chat_microtec.chats WHERE userId = $id)";
			$this->runQuery([$id]);
			return $this->data;	
			*/
		}
	}
	public function getOne($id=""){
		if( $id != "" ){
			$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
			$dbapi = new DataDb;
			$sql = "SELECT * FROM chat_microtec.chats WHERE idChat = $id";
			$res = $dbapi->exec($sql, $meta);
			return $res;
			/*
			$this->sql = "SELECT * FROM chat_microtec.chats WHERE idChat = $id";
			$this->runQuery();
			return $this->data;
			*/
		}
	}

	public function chatDetenidos(){
		$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
		$dbapi = new DataDb;
		$sql = "SELECT us.nombre, ch.userId, us.correo, us.origen, us.usuario, (SELECT MAX(ch.fecha) ) as ultimoMsg FROM chat_microtec.chats ch INNER JOIN chat_microtec.usertemporal us ON ch.userId=us.idUser where status = 0 GROUP BY userId ORDER BY ultimoMsg DESC";
		$res = $dbapi->exec($sql, $meta);
		return $res;
		/*
		$this->sql = "SELECT us.nombre, ch.userId, us.correo, us.origen, (SELECT MAX(ch.fecha) ) as ultimoMsg FROM chat_microtec.chats ch INNER JOIN chat_microtec.usertemporal us ON ch.userId=us.idUser where status = 0 GROUP BY userId ORDER BY ultimoMsg DESC";
		$this->runQuery();
		return $this->data;
		*/
	}

	public function asignarManager( $idUser = "", $atendio = "" ){
		$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
		$dbapi = new DataDb;
		$sql = "UPDATE chat_microtec.chats SET atendioId = '{$atendio}', status = 1 WHERE userId = '{$idUser}'";
		$res = $dbapi->exec($sql, $meta);
		return $res;
		
		$this->sql = "UPDATE chat_microtec.chats SET atendioId = ?, status = 1 WHERE userId = ?";
		$this->runQuery([ $atendio, $idUser ]);
		return $this->data;
		
	}

	public function userHistory(){
		$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
		$dbapi = new DataDb;
		$sql = "SELECT us.nombre, ch.userId, ch.fecha, us.origen FROM chat_microtec.chats ch INNER JOIN chat_microtec.usertemporal us ON ch.userId=us.idUser where status = 1 GROUP BY userId ORDER BY ch.fecha DESC";
		$res = $dbapi->exec($sql, $meta);
		return $res;
		/*
			$this->sql = "SELECT us.nombre, ch.userId, ch.fecha FROM chat_microtec.chats ch INNER JOIN chat_microtec.usertemporal us ON ch.userId=us.idUser where status = 1 GROUP BY userId ORDER BY ch.fecha DESC";
			$this->runQuery();
			return $this->data;
			*/
	}

	public function history( $id = "" ){
		if( $id != "" ){
			$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
			$dbapi = new DataDb;
			$sql = "SELECT * FROM chat_microtec.chats WHERE userId = $id ORDER BY fecha ASC";
			$res = $dbapi->exec($sql, $meta);
			return $res;
			/*
			$this->sql = "SELECT * FROM chats WHERE userId = ? ORDER BY fecha ASC";
			$this->runQuery([ $id ]);
			return $this->data;*/
		}
	}


}

?>