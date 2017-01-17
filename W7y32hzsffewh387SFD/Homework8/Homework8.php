<?php 
	header('Access-Control-Allow-Origin:*');
	// get the q parameter from URL
	$q = $_REQUEST["q"];
	$id = $_REQUEST["id"];
	$apikey = "9496ffea4d7546de9d6d9f67959c8dc9";
	//$url = "http://104.198.0.197:8080/";
	$url = "http://congress.api.sunlightfoundation.com/";
	$json = "";

	if ($q == "leg") {
		$url .= "legislators?apikey=" . $apikey . "&per_page=all";
		//$url .= "legislators?apikey=" . $apikey;
	} else if ($q == "activebills") {
		$url .= "bills?apikey=" . $apikey . "&per_page=50&history.active=true&last_version.urls.pdf__exists=true";
	} else if ($q == "newbills") {
		$url .= "bills?apikey=" . $apikey . "&per_page=50&history.active=false&last_version.urls.pdf__exists=true";
	} else if ($q == "com") {
		$url .= "committees?apikey=" . $apikey . "&per_page=all";
	} else if ($q == "legcom") {
		$url .= "committees?apikey=" . $apikey . "&per_page=all&member_ids=" . $id;
	} else if ($q == "legbill") {
		$url .= "bills?apikey=" . $apikey . "&per_page=all&sponsor_id=" . $id . "&history.active=true&last_version.urls.pdf__exists=true";
	}

	if ($q == "getpdf") {
		$url = $id;
		$pdffile = file_get_contents($url);
		echo $pdffile;
	} else {
		$json = file_get_contents($url);
		echo $json;
	}
	
?>