<?php
require("../config.php");

$rrds = array();

// let's figure out which rrd we're trying to find
$s = explode("?", $_SERVER["REQUEST_URI"]);
$s = explode("/", $s[0]);
$s = $s[count($s)-1];
switch($s) {
case "load": { 
  $rrds["load"] = $data_dir . "/load/load.rrd"; 
} break;
case "memory": {
  $rrds["buffered"] = $data_dir . "/memory/memory-buffered.rrd";
  $rrds["cached"] = $data_dir . "/memory/memory-cached.rrd";
  $rrds["free"] = $data_dir . "/memory/memory-free.rrd";
  $rrds["used"] = $data_dir . "/memory/memory-used.rrd";
} break;
default: { 
  header("HTTP/1.0 404 Not Found"); 
  // TODO provide a 404 page
}
}

// options
$cf = isset($_GET["cf"]) ? $_GET["cf"] : $DEFAULT_CF;
$opts = array($cf);
if(isset($_GET["s"])){
  $opts[] = "--start";
  $opts[] = $_GET["s"];
}
if(isset($_GET["e"])){
  $opts[] = "--end";
  $opts[] = $_GET["e"];
}
if(isset($_GET["r"])){
  $opts[] = "--resolution";
  $opts[] = $_GET["r"];
}

// grab the data from the RRDs
$data = array();
foreach($rrds as $key => $rrd) {
  $data[$key] = rrd_fetch($rrd, $opts);
}

// ...and spit it out as json
echo json_encode($data);
?>
