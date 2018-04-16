<?php  
/**
* class oara Registrar el usuario en el chat
*/
require_once "autoload.php";
class UserChat extends DB{

	public function set(){
		$this->sql = "INSERT INTO chat_microtec.usertemporal(nombre, correo) VALUES ( ?, ? )";
		$this->runQuery( [$this->nombre, $this->correo] );
		return $this->data;
	}
	public function get($id=""){
		if( $id == "" ){
			$this->sql = "SELECT * FROM chat_microtec.usertemporal";
			$this->runQuery();
			return $this->data;
		}
		else{
			$this->sql = "SELECT * FROM chat_microtec.usertemporal WHERE idUser = ?";
			$this->runQuery([$id]);
			return $this->data;
		}
	}
	public function delete($id = ""){
		if( $id !="" ){
			if( is_array( $id ) && !empty( $id ) ){
				$ids = "(";
				foreach ($id as $val) {
					$ids .= "?,";
				}
				$ids = substr($ids, 0, -1);
				$ids .= ")";
				echo "DELETE FROM chat_microtec.usertemporal WHERE idUser IN ".$ids;
				$this->sql = "DELETE FROM chat_microtec.usertemporal WHERE idUser IN ".$ids;
				$this->runQuery($id);
				return $this->data;
			}
			else{
				$this->sql = "DELETE FROM chat_microtec.usertemporal WHERE idUser = ?";
				$this->runQuery([$id]);
				return $this->data;
			}
		}

	}
	public function update($id = ""){
		if( $id != "" ){
			$this->sql = "UPDATE chat_microtec.usertemporal SET nombre = ?, correo = ? WHERE idUser = ?";
			$this->runQuery( [ $this->nombre, $this->correo, $id ] );
			return $this->data;
		}
	}
}
?>