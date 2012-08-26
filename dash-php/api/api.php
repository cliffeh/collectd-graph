<?php
require("../config.php");
include("../util.php");

$rrds = array();
// we might want some of these to have different names
$renames = array();

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

// grab the data from the RRDs
$data = array();
foreach($rrds as $key => $rrd) {
  $data[$key] = rrd_fetch($rrd, $opts);
}

// reorganize the data a bit
$data = reorganize_data($data, $s);

// TODO check Accept header, output XML if it's asked for
// ...and spit it out
echo json_encode($data);
// echo xml_encode($data);
?>
