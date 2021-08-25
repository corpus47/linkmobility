<?php

error_reporting(E_ALL ^ E_DEPRECATED);

class User_loggedDB {
	
	private $connection = NULL;
	
	private $parent = NULL;

	private $table_name = NULL;
	
	public function __construct($parent = NULL) {
		$this->parent = $parent;

		try {
			$this->connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
		} catch(mysqli_sql_exception $ex) {
			die('System halted. ' . $ex->getMessage());
			exit;
		}

		// Check table

		$this->table_name = str_replace('.db', '', pathinfo(__FILE__, PATHINFO_FILENAME));

		$sql = "SELECT * FROM information_schema.tables WHERE table_schema = '".DB_NAME."' AND table_name = '".$this->table_name."' LIMIT 1;";

		$result = $this->connection->query($sql);

		if($result->num_rows == 0) {
			die("Table not found :" . $this->table_name);
			exit();
		}
	}

	private function open_db() {
			
	}
	
	private function close_db() {
		//mysql_close($this->connection);
	}
	
	public function add_log($uid = null, $master = false) {
		
		//$this->open_db();
		
		//var_dump($_SESSION);
		
		//$uid = $_SESSION['HDT_uid'];
		
		if($master !== false){
		
			$master_uid = $uid;
			
		} else {
		
			$master_uid = 'NULL';
		
		}
		//var_dump($master);exit;
		$session_id = session_id();
		//var_dump($session_id);
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		}
		
		$sql = "INSERT INTO user_logged ( Uid, MasterUid, LoginTime, Session, IP ) VALUE ( " . $uid .", " . $master_uid . ", now(), '" . $session_id . "', '" . $ip . "')";
		//var_dump($sql);exit;

		//$ret = mysql_query($sql,$this->connection) or die(mysql_error());

		try{
			$ret = $this->connection->query($sql);
		} catch(mysqli_sql_exception $ex) {
			die($ex->getMessage());
			exit;
		}
		
		$this->close_db();
		
		return $ret;
		
	}
	
	public function add_check() {
		
		$this->open_db();
		
		if(isset($_SESSION['HDT_master_user'])) {
			$sql = "UPDATE user_logged SET LastCheck = now() WHERE MasterUid = " . $_SESSION['HDT_master_user'] . " AND Session = '" . session_id() . "' AND Logout IS NULL";
		} else {
			$sql = "UPDATE user_logged SET LastCheck = now() WHERE Uid = " . $_SESSION['HDT_uid'] . " AND Session = '" . session_id() . "' AND Logout IS NULL";
		}
		
		$ret = mysqli_query($this->connection,$sql) or die(mysqli_error());

		$this->close_db();
		
		return $ret;
		
	}
	
	public function close_logout($uid = null,$session = false, $master = false) {
		$this->open_db();
		
		if($master != false) {
			$sql = "UPDATE user_logged SET Logout = now() WHERE MasterUid = " . $uid . " AND Session = '" . $session . "'";
		} else {
			$sql = "UPDATE user_logged SET Logout = now() WHERE Uid = " . $uid . " AND Session = '" . $session . "'";
		}
		
		$ret = mysqli_query($this->connection,$sql) or die(mysqli_error());

		$this->close_db();
		
		return $ret;
	}
	
	public function set_logout() {
		
		//$this->open_db();
		
		if(isset($_SESSION['HDT_master_user'])) {
			$sql = "UPDATE user_logged SET Logout = now() WHERE MasterUid = " . $_SESSION['HDT_master_user'] . " AND Session = '" . session_id() . "'";
		} else {
			$sql = "UPDATE user_logged SET Logout = now() WHERE Uid = " . $_SESSION['HDT_uid'] . " AND Session = '" . session_id() . "'";
		}
		
		$ret = mysqli_query($this->connection,$sql) or die(mysqli_error());

		$this->close_db();
		
		return $ret;
		
	}
	
	public function get_logs($filter = null) {
	
		if(!is_array($filter) || $filter == null) {
			return false;
		}
		
		$sql = "SELECT * FROM " . $this->table_name;
		
		$sql .= $this->build_where($filter);
		
		//var_dump($sql);
		
		//$this->open_db();
		
		//$ret = mysql_query($sql,$this->connection) or die(mysql_error());

		try {
			$ret = $this->connection->query($sql);
			var_dump($ret);
		} catch(mysqli_sql_exception $ex){
			die($ex->getMessage());
			exit;
		}

		$this->close_db();
		
		return $ret;
	
	}
	
	private function build_where($wheres = NULL) {
	
		if(is_array($wheres)) {
			$where = ' WHERE ';
			$order = '';
			$limit = '';
			foreach($wheres as $row) {
				if(strpos($row,"ORDER") !== false) {
					$order = trim($row);
				} elseif(strpos($row,"LIMIT") !== false){
					$limit = trim($row);
				} else {
					$where .= $row . " AND ";
				}
			}
			$where = preg_replace('/ AND $/','',$where);
			//$where .= ")";
			if(trim($order) != "") {
				$where .= " " . trim($order);
			}
			if(trim($limit) != "") {
				$where .= " " . trim($limit);
			}			
		}
		
		return $where;
	}
	
}
?>
