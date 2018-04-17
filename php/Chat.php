<?php 
/**
* Clase Chat con los mensaje de los usuarios
*/
class Chat extends DB{
	
	function __construct($user = ""){
		$this->user = $user;
	}

	public function set(){
		$this->sql = "INSERT INTO chat_microtec.chats(mensaje, userId, remitente, atendioId) VALUES ( ?, ?, ?, ? )";
		$this->runQuery( [$this->mensaje, $this->userId, $this->remitente, null] );
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


}

?>