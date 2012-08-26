<?php // config.php
// we'll inspect the collectd config file to see where the RRDs are
$DEFAULT_DATA_DIR = "/var/lib/collectd/rrd";
$DEFAULT_CF = "AVERAGE";
$collectd_conf = "/etc/collectd/collection.conf";
$data_dir = $DEFAULT_DATA_DIR;

$fp = fopen($collectd_conf, "r");
while($line = fgets($fp)){
  // echo $line;
  $pieces = explode(": ", $line);
  if($pieces[0] == "datadir"){ // found it!
    $data_dir = trim(trim($pieces[1]), '"');
  }
}
fclose($fp);

// need the host-specific bit
$data_dir = $data_dir . gethostname();
?>
