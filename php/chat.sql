create database chat_microtec;
use chat_microtec;

create table usertemporal(
	idUser int unsigned not null auto_increment,
	nombre varchar(100) not null,
	correo varchar(100) not null default 'Desconocido',
	origen varchar(80) not null default 'Desconocido',
	primary key (idUser)
)ENGINE=InnoDB, charset=utf8;

create table chats(
	idChat bigint unsigned not null auto_increment,
	mensaje text not null,
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	userId int unsigned not null,
	atendioId int unsigned default null,
	remitente int unsigned default null, -- este campo sera el clave, sera una bandera, si es 1 = escribio el userId, si es 2 = escribio el atendioId
	status tinyint not null default 0,
	file varchar(200) default null,
	ruta varchar(200) default null,
	primary key (idChat),
	foreign key (userId) references usertemporal (idUser)
)ENGINE=InnoDB, charset=utf8;