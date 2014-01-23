<?php
ini_set('error_reporting', -1);
date_default_timezone_set('America/Sao_Paulo');

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim;

$m = new MongoClient();
$db = $m->selectDB('openchat');
$collection = new MongoCollection($db, 'messages');

$app->post('/hash-start', function() {
  echo sha1(uniqid(rand()));
});

$app->post('/save-message', function() use ($db, $collection) {
  if (isset($_POST['message'])) {        
    $insertData = array(
        'change_date'     => date("Y-m-d H:i:s"),
      	'date'            => new MongoDate(),
      	'conversation_id' => $_POST['conversation_id'],
      	'user_name'       => $_POST['user_name'],
      	'message'         => $_POST['message']
    );
    
    $insertArray = array('message' => $insertData);
    $insertArray['_id'] = new MongoId();
    
    if ($collection->insert($insertArray)) {
    	echo $insertArray['_id'];
    }
  }
});

$app->post('/get-message', function() use ($db, $collection) {
  if (isset($_POST['conversation_id'])) {
    if (!empty($_POST['date_consult'])) {
      $start = new MongoDate(strtotime($_POST['date_consult']) + 1);
      $end = new MongoDate(strtotime(date('Y-m-d H:i:s')));
      $queryLastMessages = $collection->find(array("message.date" => array('$gt' => $start, '$lte' => $end)));
    } else {
    	$queryLastMessages = $collection->find(array('message.conversation_id' => $_POST['conversation_id']));
    }

    $i = 0;
    
    $viewArray[] = 'var messagesArray = new Array();';
    $numItens = $queryLastMessages->count() - 1;
    
    foreach($queryLastMessages as $rowMessage) {
      $viewArray[] = 'messagesArray['.$i.'] = '.json_encode($rowMessage).';'; 
      
        if ($numItens == $i) {
          $viewArray[] = 'var newStorageDate = "'.$rowMessage['message']['change_date'].'"'; 
        }
      
      	$i++;
    }
    
    echo implode('', $viewArray);
  }
});
 
$app->run();