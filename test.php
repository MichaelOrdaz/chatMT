<?php
session_start();
?>
<h1>Entro al Sistema</h1>

<ol>
	<li><?php echo $_SESSION['userEncry']; ?></li>
	<li><?php echo $_SESSION['name']; ?></li>
	<li><?php echo $_SESSION['id']; ?></li>
	<li><?php echo $_SESSION['user']; ?></li>
</ol>