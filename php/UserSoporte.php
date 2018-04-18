<?php  
/**
* class de los usuarios de Soporte
* esta clase de mofificara y es de prueba
* se espera implementacion la informacion de los usuarios de soporte que ya estan en produccion
*/
require_once "autoload.php";
class UserSoporte extends DB{

	public function set(){}
	public function get($id=""){
		if( $id == "" ){
			$this->sql = "SELECT * FROM chat_microtec.soportemt";
			$this->runQuery();
			return $this->data;
		}
		else{
			$this->sql = "SELECT * FROM chat_microtec.soportemt WHERE nombre = ?";
			$this->runQuery([$id]);
			return $this->data;
		}
	}
	public function delete($id = ""){}
	public function update($id = ""){}
}
?>