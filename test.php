<?php
//$sesion = "algo";
//$val =  base64_encode(null);
//echo strlen($val);
$val = base64_encode( isset($sesion) ? $sesion : null );
echo $val;
echo "<br>";
echo strlen($val);