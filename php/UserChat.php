<?php  
/**
* class oara Registrar el usuario en el chat
*/
include_once("/var/www/api/bd.php");
class UserChat{

	public function set(){
		$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
		$dbapi = new DataDb;
		$sql = "INSERT INTO chat_microtec.usertemporal(nombre, correo, origen, usuario) VALUES ( '{$this->nombre}', '{$this->correo}', '{$this->origen}', '{$this->usuario}' )";
		$res = $dbapi->exec($sql, $meta);
		return $dbapi->idMod;
	}
	public function get($id=""){
		if( $id == "" ){

			$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
			$dbapi = new DataDb;
			$sql = "SELECT * FROM chat_microtec.usertemporal";
			$res = $dbapi->exec($sql, $meta);
			return $res;
			/*
			$this->sql = "SELECT * FROM chat_microtec.usertemporal";
			$this->runQuery();
			return $this->data;
			*/
		}
		else{

			$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
			$dbapi = new DataDb;
			$sql = "SELECT * FROM chat_microtec.usertemporal WHERE idUser = $id";
			$res = $dbapi->exec($sql, $meta);
			return $res;
			/*
			$this->sql = "SELECT * FROM chat_microtec.usertemporal WHERE idUser = ?";
			$this->runQuery([$id]);
			return $this->data;
			*/
		}
	}

	public function getSamtec($user = ""){
		if( $user != "" ){
			$meta = $_SERVER['REMOTE_ADDR']."|módulo de chat|portal web";
			$dbapi = new DataDb;
			$sql = "SELECT u.nombre, l.dis as sucursal, u.dis, u.email, u.celular, case l.tipo when 0 then 'Bodega' when 1 then 'Tienda Propia' when 2 then 'Franquicia' when 3 then 'MicroFranquicia' when 4 then 'FranquiciaSmart' when 5 then 'FranquiciaSmart' when 6 then 'MicroPayments' end as tipo from canal.usuarios u left join canal.lista l on u.dis=l.user where u.user='$user'";
			$res = $dbapi->exec($sql, $meta);
			return $res;
		}
	}
	/*
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
	*/
}
?>