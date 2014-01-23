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
		'server'        => $_POST['server'],
		'client'        => $_POST['client'],
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

	$collectionCursor = $messagesCollection->find(
		array('$or' => array( 
				array('_message.client' => $_POST['client'], '_message.server' => $_POST['server']), 
				array('_message.client' => $_POST['server'], '_message.server' => $_POST['client'])
			)
		)
	);
	$numItens = $messagesCollection->count() -1;

	$viewArray[] = 'var messagesArray = new Array();';

	$i = 0;

	foreach ($collectionCursor as $docMessage) {
		$viewArray[] = 'messagesArray['.$i.'] = '.json_encode($docMessage).';'; 

		if ($numItens == $i) {
			$_SESSION[$_POST['listen']] = $docMessage['message']['change_date'];
		}

		$i++;
	}

	echo implode('', $viewArray);
});

///////////////////////////
// Requests execution //
///////////////////////////

$app->run();