<?php
function xml_encode($mixed,$domElement=null,$DOMDocument=null) {
  if(is_null($DOMDocument)) {
    $DOMDocument=new DOMDocument;
    $DOMDocument->formatOutput=true;
    xml_encode($mixed,$DOMDocument,$DOMDocument);
    echo $DOMDocument->saveXML();
  } else {
    if(is_array($mixed)) {
      foreach($mixed as $index=>$mixedElement) {
	if(is_int($index)) {
	  if($index==0) {
	    $node=$domElement;
	  } else {
	    $node=$DOMDocument->createElement($domElement->tagName);
	    $domElement->parentNode->appendChild($node);
	  }
	} else {
	  $plural=$DOMDocument->createElement($index);
	  $domElement->appendChild($plural);
	  $node=$plural;
	  if(rtrim($index,'s')!==$index) {
	    $singular=$DOMDocument->createElement(rtrim($index,'s'));
	    $plural->appendChild($singular);
	    $node=$singular;
	  }
	}
	xml_encode($mixedElement,$node,$DOMDocument);
      }
    } else {
      $domElement->appendChild($DOMDocument->createTextNode($mixed));
    }
  }
}

// want:
// { GRAPHNAME:
//   { SETNAME :
//     { "start" : N,
//  	 "end"   : N,
//	 "step"  : N,
//	 "data"  : { ... }
//     }
//   },
//   { SETNAME :
//     ...
//   }
function reorganize_data($data, $s) {
  $d = array($s => array());
  $vars = array("start", "end", "step");
  switch($s){
  case "load": {
    $names = array("shortterm" => "1m", "midterm" => "5m", "longterm" => "15m");
    foreach($names as $key => $name){
      $d[$s][$name] = array();
      foreach($vars as $var){
	$d[$s][$name][$var] = $data[$s][$var];
      }
      $d[$s][$name]["data"] = $data[$s]["data"][$key];
    }
  }break;
  case "memory": {    
    $names = array("buffered" => "bu", "cached" => "ca", "used" => "us", "free" => "fr");
    foreach($names as $key => $name){
      $d[$s][$name] = array();
      foreach($vars as $var){
	$d[$s][$name][$var] = $data[$key][$var];
      }
      $d[$s][$name]["data"] = $data[$key]["data"]["value"];
    }
  }break;
  default: {
    // might want to make sure this doesn't happen
  }
  }
  return $d;
}

?>
