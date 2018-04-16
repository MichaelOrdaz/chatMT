<?php 
spl_autoload_register(function ($clase) {
    include_once $clase . '.php';
});
?>