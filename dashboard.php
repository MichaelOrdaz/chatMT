<?php session_start(); 
if( !isset( $_SESSION['userEncry'] )  ){
	//como no existe la variable entra al ciclo y lo redirecciono.
	header('location: manager.html');
}
else{
	//si el falso existe la variable y entra a la pagina
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <link href="assets/inspinia/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/inspinia/font-awesome/css/font-awesome.css" rel="stylesheet">
    <link href="assets/inspinia/css/animate.css" rel="stylesheet">

	<link rel="shortcut icon" href="assets/imgs/favicon.png" />
	<link rel="stylesheet" type="text/css" href="assets/alertify/css/alertify.min.css">
	<link rel="stylesheet" type="text/css" href="assets/alertify/css/themes/semantic.min.css">
	<link rel="stylesheet" type="text/css" href="assets/DataTables/datatables.min.css">

    <link href="assets/inspinia/css/style.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="assets/css/myStyle.css">	
    <title>CHAT MT | Dashboard</title>
	<link rel="stylesheet" type="text/css" href="assets/css/dashboard.css">

</head>
<body>
    <div id="wrapper">
        <nav class="navbar-default navbar-static-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav" id="side-menu">
                    <li class="nav-header">
                        <div class="dropdown profile-element"> <span>
                            <img alt="image" class="img-circle profile-img" src="assets/imgs/logomt.jpg" />
                             </span>
                            <span class="clear"> <span class="block m-t-xs"> <strong class="font-bold text-white" id="nameSoporte"><span id="idUser" class="hide"><?php echo $_SESSION['id']; ?></span><span><?php echo $_SESSION['name']; ?></span></strong>
                             </span> <span class="text-muted text-xs block">Soporte MicroTec</span> </span>
                        </div>
                        <div class="logo-element">
                            MT
                        </div>
                    </li>
                    <li class="active">
                        <a href="dashboard.php" ><i class="fa fa-comments" aria-hidden="true"></i> <span class="nav-label"> Conversaciones </span></a>
                    </li>
                    <li>
                        <a href="historial.php" ><i class="fa fa-list"></i> <span class="nav-label">Historial</span></a>
                    </li>
                </ul>

            </div>
        </nav>

        <div id="page-wrapper" class="gray-bg dashbard-1">

	        <div class="row border-bottom">
		        <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
			        <div class="navbar-header">
			            <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="javascript://"><i class="fa fa-bars"></i> </a>
			        </div>
			        <ul class="nav navbar-top-links navbar-right">
		                <li>
		                    <span class="m-r-sm welcome-message">Administración de Mensajeria Soporte.</span>
		                </li>
		                <li>
		                    <a href="javascript://" id="logout">
		                        <i class="fa fa-sign-out"></i> Salir
		                    </a>
		                </li>
		            </ul>
		        </nav>
		    </div>
		<div id="main-wrap"><!-- Envoltorio principal -->
			
		    <div class="row  border-bottom white-bg dashboard-header">
                <div class="col-sm-3">
                    <h2>Conversaciones</h2>      
                </div>
            </div>
		    <div class="row">
	            <div class="col-lg-12">
	                <div class="wrapper wrapper-content">
	                	<div class="row">
	                		<div class="col-sm-10 col-sm-offset-1">
	                			

	                			<div class="ibox float-e-margins">
	                                <div class="ibox-title">
	                                    <h5>Conversaciones en Espera <span class="badge" id="badgeChat"> </span></h5>
	                                    <div class="ibox-tools">
	                                        <a class="collapse-link">
	                                            <i class="fa fa-chevron-up"></i>
	                                        </a>
	                                        <a class="close-link">
	                                            <i class="fa fa-times"></i>
	                                        </a>
	                                    </div>
	                                </div>
	                                <div class="ibox-content">
	                                    <div class="table-responsive" id="tablaChatDetenidos" style="overflow-y: auto; max-height: 400px; min-height: 200px;">
												<table class="table table-bordered table-hover table-condensed" id="chats-detenidos">
													<thead>
														<tr>
															<th>Cliente</th>
															<th>Fecha</th>
															<th>Origen</th>
															<th>Chatear</th>
														</tr>
													</thead>
													<tbody>
														
													</tbody>
												</table>
                                        </div>
                                    </div>
                                </div>
								

	                		</div>
							
							<div class="clearfix"></div>
	                		
	                		<div class="col-md-12">
				
								<div class="row" id="containerChats">

								</div>
							
							</div>

	                	</div>

	                </div>
	                <div class="footer">
	                    <div>
	                    	<strong>Copyright</strong> Microtecnologías del Golfo S.A. de C.V. &copy; 2018
	                    </div>
	                </div>
	            </div>
	        </div>

		</div><!-- final del envoltorio principal -->

        </div>
    </div>
	<div id="scripting">
		
	<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js"></script>

	<script src="assets/jquery/jquery-3.3.1.min.js"></script>
    <script src="assets/inspinia/js/bootstrap.min.js"></script>
    <script src="assets/inspinia/js/plugins/metisMenu/jquery.metisMenu.js"></script>
    <script src="assets/inspinia/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
    <script src="assets/inspinia/js/inspinia.js"></script>
    <script src="assets/inspinia/js/plugins/jquery-ui/jquery-ui.min.js"></script>
	

	<script src="assets/swal/swalalert.js"></script>
	<script type="text/javascript" src="assets/DataTables/datatables.min.js"></script>
	<script type="text/javascript" src="assets/alertify/alertify.min.js"></script>

	<script type="text/javascript" src="assets/js/dashboard.js"></script>
	
	</div>
</body>
</html>
<?php 
}//final de else 
?>