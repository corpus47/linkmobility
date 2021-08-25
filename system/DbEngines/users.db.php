<?php

error_reporting(E_ALL ^ E_DEPRECATED);

class UsersDB {
	
	private $connection = NULL;

	private $table_name = NULL;
	
	public function __construct() {

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
		/*$this->connection = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD) or die(mysql_error());
		mysql_set_charset('utf8',$this->connection);
		mysql_select_db(DB_NAME, $this->connection) or die(mysql_error());*/

		//var_dump($this->connection); exit;

		

	}
	
	private function close_db() {
		//mysql_close($this->connection);
	}
	
	public function get_user($id = NULL) {
		if($id == NULL || $id == 0){
			return false;
		}
		$this->open_db();
		
		$sql = "SELECT * FROM " . $this->table_name . " WHERE ID = " . $id;
		//var_dump($sql);
		$ret = mysqli_fetch_assoc(mysqli_query($this->connection,$sql)) or die (mysqli_error());
		
		$this->close_db();
		
		return $ret;
	}
	
	public function locked($id = NULL) {
		// Lezárás vizsgálata
		if($id == NULL) {
			return;
		}
		
		//$this->open_db();
		
		$sql = "SELECT ". $this->table_name . ".Locked FROM ". $this->table_name . " WHERE ID = " . $id;

		//var_dump($sql); exit;
		
		$user = mysqli_fetch_assoc(mysqli_query($this->connection,$sql)) or die (mysqli_error());
		
		$ret =true;
		
		if($user['Locked'] == $_SESSION['HDT_uid']) {
			$ret =false;
			$this->close_db();
			return $ret;
		} elseif($user['Locked'] === null || $user['Locked'] == 0) {
			$ret =false;
			$this->close_db();
			return $ret;
		}
		$this->close_db();
			return $ret;
		
	}
	
	public function unlock($id = NULL) {
		// Felszabadítás
		if($id == NULL) {
			return;
		}
		
		//$this->open_db();
		
		$sql = "SELECT sys_users.Locked FROM sys_users WHERE ID = " . $id;
		
		$user = mysqli_fetch_assoc(mysqli_query($this->connection,$sql)) or die(mysqli_error());
		
		if($user['Locked'] == $_SESSION["HDT_uid"]) {
		
			$sql = "UPDATE sys_users SET Locked = 0 WHERE ID = " . $id;
			
			mysqli_query($this->connection,$sql) or die(mysqli_error());

		}
		
		$this->close_db();
		
		return;
		
	}
	
	public function lock($id = NULL) {
		// Lezárás
		if($id == NULL) {
			return;
		}
		
		//$this->open_db();
			
		if(isset($_SESSION["HDT_uid"])) {
			
			$sql = "UPDATE " . $this->table_name. " SET Locked = " . $_SESSION['HDT_uid'] . " WHERE ID = ". $id;

			mysqli_query($this->connection,$sql) or die(mysqli_error());
		}
		
		$this->close_db();
		return;
	}
	
	public function set_active($id = NULL,$value = NULL) {
		if($id == NULL || $value == NULL){
			return false;
		}
		$this->open_db();
		
		$sql = "UPDATE sys_users SET Active = " . $value . " WHERE ID = " . $id;
		
		$ret = mysqli_query($this->connection,$sql) or die (mysqli_error());
		
		$this->close_db();
		
		if($ret == NULL) {
			return false;
		} else {
			return true;
		}
	}
	
	public function check_unique($fieldname = NULL, $value = NULL) {

		//$this->open_db();
		if($fieldname != NULL && $value != NULL ) {

			$sql = "SELECT * FROM sys_users WHERE " . $fieldname . " = '" . $value . "'";

			$ret = mysqli_fetch_assoc(mysqli_query($this->connection,$sql));
		} else {
			$ret = true;
		}
		$this->close_db();

		if(isset($ret['ID'])) {
			$ret = false;
		} else {
			$ret = true;
		}

		return $ret;
	}
	
	public function update_user($inserted = NULL) {
		
		if($inserted != NULL && is_array($inserted)) {
			//$this->open_db();
			
		
			if(isset($inserted['user-active']) && $inserted['user-active'] == 'on') {
				$inserted['user-active'] = 1;
			} else {
				$inserted['user-active'] = 0;
			}
			
			if(isset($inserted['user-list_style']) && $inserted['user-list_style'] == 'on') {
				$inserted['user-list_style'] = 1;
			} else {
				$inserted['user-list_style'] = 0;
			}
			
			if($inserted['pwd-one'] != "") {
				
				$salt = substr( md5(rand()), 0, 10);
				$password = sha1($inserted['pwd-one']. $salt);
				
				$sql = "UPDATE " . $this->table_name . " SET Pwd ='".$password."', Salt = '".$salt."', Fullname = '".$inserted['user-fullname']."', Phone = '".$inserted['user-phonenum']."', Email = '".$inserted['user-email']."', Active = ".$inserted['user-active'].", UserType = '".$inserted['user-level']."', List_style = ".$inserted['user-list_style'].", Partner_ID = ".$inserted['user-partner-id']." WHERE ID = " . $inserted['id'];
			} else {
				$sql = "UPDATE " . $this->table_name . " SET Fullname = '".$inserted['user-fullname']."', Phone = '".$inserted['user-phonenum']."', Email = '".$inserted['user-email']."', Active = ".$inserted['user-active'].", UserType = '".$inserted['user-level']."', List_style = ".$inserted['user-list_style'].", Partner_ID = ".$inserted['user-partner-id']." WHERE ID = " . $inserted['id'];
			}
			var_dump($sql);
			
			//var_dump($sql);exit;
			$ret =  mysqli_query($this->connection,$sql) or die (mysqli_error($this->connection));
			//exit;
			$this->close_db();
			
			return $ret;
			
		}
	}
	
	public function delete_user($inserted = NULL) {
		
		//$this->open_db();
		
		$sql = "DELETE FROM sys_users WHERE ID = ". $inserted['id'];
		
		$ret =  mysqli_query($this->connection,$sql) or die (mysqli_error());
		
		$this->close_db();
		
		return $ret;
		
	}
	
	public function add_user($inserted = NULL) {
		
		//var_dump($inserted);exit;
		
		if($inserted != NULL && is_array($inserted)) {
			
			//$this->open_db();
			
			
			
			// Jelszó sózás
			
			$salt = substr( md5(rand()), 0, 10);
			
			$password = sha1($inserted['pwd-one']. $salt);
			
			if($inserted['user-active'] == 'on') {
				$active = 1;
			} else {
				$active = 0;
			}
			
			if(isset($inserted['user-list_style']) && $inserted['user-list_style'] == 'on') {
				$inserted['user-list_style'] = 1;
			} else {
				$inserted['user-list_style'] = 0;
			}
			//var_dump($inserted);
			$sql = "INSERT INTO sys_users (
										Login,
										Pwd,
										Salt,
										FullName,
										Phone,
										Email,
										Active,
										LPNumber,
										UserType,
										ModulesRule,
										List_style,
										DateOfAdd,
										Partner_ID,
										Locked
										)
										VALUES
										(
										'".$inserted['user-name']."',
										'".$password."',
										'".$salt."',
										'".$inserted['user-fullname']."',
										'".$inserted['user-phonenum']."',
										'".$inserted['user-email']."',
										'".$active."',
										'',
										".$inserted['user-level'].",
										'',
										".$inserted['user-list_style'].",
										now(),
										'".$inserted['user-partner-id']."',
										NULL
										)";
			
			//var_export($sql);
			
			$ret =  mysqli_query($this->connection,$sql) or die (mysqli_error());
		
			$this->close_db();
		
			return $ret;
		}
	}
	
	private function build_where($wheres = NULL) {
	
		/*if(is_array($wheres)) {
			$where = ' WHERE ';
			foreach($wheres as $row) {
				$where .= $row . ",";
			}
			$where = preg_replace('/,$/','',$where);	
		}
		
		return $where;*/
		
		if(is_array($wheres)) {
			$where = ' WHERE ';
			$order = '';
			foreach($wheres as $row) {
				if(strpos($row,"ORDER") !== false) {
					$order = trim($row);
				} else {
					$where .= $row . " AND ";
				}
			}
			$where = preg_replace('/ AND $/','',$where);
			if(trim($order) != "") {
				$where .= " " . trim($order);
			}	
		}
		
		return $where;
	}
	
	public function list_users($filter = NULL) {
	
		//$this->open_db();
		
		$sql = "SELECT * FROM " . $this->table_name;
		
		if($filter != NULL) {
			$sql .= $this->build_where($filter);
		}
		//var_dump($sql);
		$result = mysqli_query($this->connection,$sql);
		
		$this->close_db();
		
		return $result;
	}
	
	public function login_service($username = NULL,$password = NULL) {
		
		if($username !== NULL && $password !== NULL) {
		
			//$this->open_db();
			
			$uname = mysqli_real_escape_string($username);
			
			$sql = "SELECT * FROM sys_users WHERE Login = '".$uname."' AND Active = 1 AND ( UserType = ".EXPORT_USER." OR UserType = ".IMPORT_USER.")";
			
			$result = mysqli_query($this->connection,$sql);
			
			$user = mysqli_fetch_assoc($result);
			
			if($user != false) {
				
				$passwd = sha1($password . $user['Salt']);

				if($user['Pwd'] !== $passwd) {
					$ret = false;
				} else {
					$ret = true;
				}
			} else {
				$ret = false;
			}
		
			$this->close_db();
			
			return $ret;
		
		}
		
	}
	
	public function login_user($username = NULL,$password = NULL, $id = NULL,$array = true) {
		
		//$this->open_db();
		
		// Az id ha sessionból érkezik
		/*if($id !== NULL) {
			$sql = "SELECT * FROM sys_users WHERE ID = '".$id."'";
			
			$result = mysql_query($sql,$this->connection);
			
		} else*/
		
		if($username !== NULL && $password !== NULL) {

			$uname = $this->connection->real_escape_string($username);

			$sql = "SELECT * FROM " . $this->table_name . " WHERE Login = '".$uname."'";

			$result = $this->connection->query($sql);

			$user = $result->fetch_assoc();
			
			if($user !== false && $user !== NULL) {
				$passwd = sha1($password . $user['Salt']);

				if($user['Pwd'] !== $passwd) {
					$ret = false;
				}
			} else {

				$ret = false;
			}	
		}

		$this->close_db();
		
		if(isset($ret) && $ret === false) {
			return false;
		} else {
			return $user['ID'];
		}
	}
}
?>
