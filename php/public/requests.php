<?php

///////////////////////////////////
// Requests default constants //
///////////////////////////////////

define('ROOT_PATH', dirname(dirname(__FILE__)));
define('DS', 'DIRECTORY_SEPARATOR');

/////////////////////////////
// Requests dependences //
/////////////////////////////

require ROOT_PATH.'/vendor/autoload.php';

//////////////////////////
// Requests instance //
//////////////////////////

$app = new \Slim\Slim;

////////////
// Routes //
////////////

$app->post('/save-message', function() {
	$mongo = new Mongo('mongodb://localhost:27017');
	$messagesCollection = $mongo->selectDB('lazychat')->selectCollection('messages');

	$insertData['_id'] = new MongoId();
	$insertData['_message'] = array(
		'changed_date'  => date('Y-m-d H:i:s'),
		'register_date' => new MongoDate(),
		'content'       => htmlentities($_POST['message']),
	);

	if ($messagesCollection->insert($insertData)) {
		echo $insertData['_id'];
	}
});

$app->post('/get-message', function() {
	$mongo = new Mongo('mongodb://localhost:27017');
	$messagesCollection = $mongo->selectDB('lazychat')->selectCollection('messages');
});

///////////////////////////
// Requests execution //
///////////////////////////

$app->run();