<?php
session_start();

ini_set('display_errors', true);
error_reporting(E_ALL);

header('Content-Type: text/html; charset=utf-8');

require_once('config.inc.php');
require_once('system/application.php');

define('DEBUG',true);

$app = new Application();

$app->run();

?>
