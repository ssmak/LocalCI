<?php
// var_dump($_REQUEST);
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

define('SECRET', '34f9b51db8c17845c993ef215c03fa64');

/*
 * Check action: push | pull
 */
// Push event
if($_GET['action'] === 'push') {
	// Check if GitHub event
	if(!empty($_SERVER['HTTP_X_GITHUB_EVENT']) && !empty($_SERVER['HTTP_X_GITHUB_DELIVERY']) && !empty($_SERVER['HTTP_X_HUB_SIGNATURE'])) {
		$githubEvent = $_SERVER['HTTP_X_GITHUB_EVENT'];
		$githubDelivery = $_SERVER['HTTP_X_GITHUB_DELIVERY'];
		$githubSignature = $_SERVER['HTTP_X_HUB_SIGNATURE'];

		// Push event
		if($githubEvent === 'push') {
			// Save the event
			$payload = json_decode($_POST['payload'], true);
			$projectName = preg_replace('/(:|\/|\.)/', '_', $payload['repository']['clone_url']);
			$projectFolder = dirname(__FILE__).'/.cache/'.$projectName;
			// Make group folder if not exist
			if(!file_exists($projectFolder)) {
				mkdir($projectFolder);
			}
			file_put_contents($projectFolder.'/'.time(), json_encode($payload));
		}
	}
}

// Pull event
if($_GET['action'] === 'pull') {
	if(!empty($_SERVER['HTTP_X_SECRET']) && !empty($_POST['repository_url']) && !empty($_POST['branch'])) {
    $result = array();

    // Check secret
    if($_SERVER['HTTP_X_SECRET'] === SECRET) {
      $projectName = preg_replace('/(:|\/|\.)/', '_', $_POST['repository_url']);
  		$projectFolder = dirname(__FILE__).'/.cache/'.$projectName;
      if(file_exists($projectFolder)) {
        $files = scandir($projectFolder);
        foreach($files as $file) {
          $cachedFile = $projectFolder.'/'.$file;

          if(in_array($file, array('.', '..'))) {
            // Skip files
            continue;
          }

          // Read cached content
          $f = file_get_contents($cachedFile);

          // Branch check
          $event = json_decode($f, true);
          if($event['ref']) {
            $branch = explode('/', $event['ref']);
            $branch = $branch[sizeof($branch) - 1];
            // Check if branch matched
            if(!($branch === $_POST['branch'])) {
              // Not this branch
              continue;
            }
          }

          $result[] = $f;

          // Remove the cached file
          unlink($cachedFile);
        }
      }
    }

    echo json_encode($result);
	}
}
?>
