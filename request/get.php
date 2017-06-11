<?php
$url = (!empty($_POST['u']))?$_POST['u']:$_GET['u'];
echo file_get_contents($url);
?>
