<?php 
/**
 * Class db
 */
require_once "autoload.php"; 
abstract class DB{
	/*
	private static $h = "localhost";
	private static $u = "michaelo_1";
	private static $p = "%some_pass2018";
	protected $dbName = "michaelo_ventilacion";
	*/

	private static $h = "localhost";
	private static $u = "root";
	private static $p = "";
	protected $dbName = "chat_microtec";
	
	protected $pdo;//objeto pdostatement
	protected $sql;//sql
	protected $data = array();//valores devueltos

	//metodos abstractos
	abstract protected function get();
	abstract protected function set();
	abstract protected function delete();
	abstract protected function update();

	private function start(){
		try {
			$this->pdo = new PDO("mysql:dbname=".$this->dbName.";host=".self::$h.";charset=utf8", self::$u, self::$p);
		}catch (PDOException $e) {
			echo 'Falló la conexión: ' . $e->getMessage();
		}
	}

	private function close(){
		$this->pdo = null;
	}

	protected function runQuery( $param = array() ){
		$this->start();
		$sth = $this->pdo->prepare($this->sql);
		$sth->execute($param);
		if( preg_match('/^SELECT/', $this->sql) ){
			$this->data = $sth->fetchAll(PDO::FETCH_OBJ);
		}
		else if( preg_match('/^INSERT/', $this->sql) ){
			$this->data = $this->pdo->lastInsertId();
		}
		else{
			$this->data = $sth->rowCount();
		}
		$sth = null;
		$this->close();
	}

}

?>