<?php 
/**
* Clase Chat con los mensaje de los usuarios
*/
class Chat extends DB{
	
	function __construct($user = ""){
		$this->user = $user;
	}

	public function set(){
		$atendio = $this->atendioId == '' ? null: $this->atendioId;
		$file = !isset( $this->file ) ? null: $this->file;
		$ruta = !isset( $this->ruta ) ? null: $this->ruta;
		$valores = [$this->mensaje, $this->userId, $this->remitente, $atendio, $this->status, $file, $ruta];
		$this->sql = "INSERT INTO chat_microtec.chats(mensaje, userId, remitente, atendioId, status, file, ruta) VALUES ( ?, ?, ?, ?, ?, ?, ? )";
		$this->runQuery( $valores );
		return $this->data;
	}

	public function get($id=""){
		if( $id == "" ){
			$this->sql = "SELECT * FROM chat_microtec.chats";
			$this->runQuery();
			return $this->data;
		}
		else{
			$this->sql = "SELECT * FROM chat_microtec.chats WHERE userId = ? ORDER BY fecha ASC";
			$this->runQuery([$id]);
			return $this->data;
		}
	}
	protected function delete(){}
	protected function update(){}

	public function getLast($id = ""){
		if( $id != ''){
			$this->sql = "SELECT *, DATE_ADD(fecha, INTERVAL 1 HOUR) as fechaExpiracion FROM chat_microtec.chats WHERE fecha = (SELECT MAX(fecha) FROM chat_microtec.chats WHERE userId = $id)";
			$this->runQuery([$id]);
			return $this->data;	
		}
	}
	public function getOne($id=""){
		if( $id != "" ){
			$this->sql = "SELECT * FROM chat_microtec.chats WHERE idChat = $id";
			$this->runQuery();
			return $this->data;
		}
	}

	public function chatDetenidos(){
		$this->sql = "SELECT us.nombre, ch.userId, us.correo, (SELECT MAX(ch.fecha) ) as ultimoMsg FROM chat_microtec.chats ch INNER JOIN chat_microtec.usertemporal us ON ch.userId=us.idUser where status = 0 GROUP BY userId ORDER BY ultimoMsg DESC";
		$this->runQuery();
		return $this->data;
	}

	public function asignarManager( $idUser = "", $atendio = "" ){
		$this->sql = "UPDATE chat_microtec.chats SET atendioId = ?, status = 1 WHERE userId = ?";
		$this->runQuery([ $atendio, $idUser ]);
		return $this->data;
	}

	public function userHistory(){
			$this->sql = "SELECT us.nombre, ch.userId, ch.fecha FROM chat_microtec.chats ch INNER JOIN chat_microtec.usertemporal us ON ch.userId=us.idUser where status = 1 GROUP BY userId ORDER BY ch.fecha DESC";
			$this->runQuery();
			return $this->data;
	}

	public function history( $id = "" ){
		if( $id != "" ){
			$this->sql = "SELECT * FROM chats WHERE userId = ? ORDER BY fecha ASC";
			$this->runQuery([ $id ]);
			return $this->data;
		}
	}


}

?>