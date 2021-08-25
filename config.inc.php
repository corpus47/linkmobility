<?php

define("HOME_URL","/");

define("ROOT_URL",($_SERVER['HTTP_HOST'].HOME_URL));

define('DEFAULT_MODULE','linkmobility');

define("THEME","default");


// Databases

if($_SERVER['HTTP_HOST'] === 'linkmobility.test') {
	
	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PASSWORD','sc1959op');
	define('DB_NAME','linkmob');

} elseif($_SERVER['HTTP_HOST'] === 'linkmob.wplabor.hu') { 

	define('DB_HOST','localhost');
	define('DB_USER','');
	define('DB_PASSWORD','');
	define('DB_NAME','linkmob');
	
}

// User levels

define('ADMIN',0);
define('EDITOR',1);

// Rules template

$rules = array(
			'linkmobility' => array(
									'listusers' => '',
								),
		);
		
define('RULES',serialize($rules));
