create database chat_microtec;
use chat_microtec;

create table userTemporal(
	idUser int unsigned not null auto_increment,
	nombre varchar(100) not null,
	correo varchar(100) not null,
	primary key (idUser)
)ENGINE=InnoDB, charset=utf8;

insert into usertemporal values
	(default, "juanito perez web", "juan@mail.com"),
	(default, "maria mercedez web", "maria@mail.com"),
	(default, "roberto zediño web", "robert@mail.com"),
	(default, "martin barraggan web", "martin@mail.com"),
	(default, "luz anitita web", "luz@mail.com");

create table soportemt(
	idSoporte int unsigned not null auto_increment,
	nombre varchar(100) not null,
	primary key (idSoporte)
)ENGINE=InnoDB, charset=utf8;

insert into soportemt values
(default, "Michael"),
(default, "Criss"),
(default, "Jose"),
(default, "Rene"),
(default, "Fer"),
(default, "Carlos");


-- necesito saber quien mando el msnsaje, pues podria hacer en el remitente, y destinatario y dejar el campo atendio como esta
create table chats(
	idChat bigint unsigned not null auto_increment,
	mensaje text not null,
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	userId int unsigned not null,
	atendioId int unsigned not null default 0,
	remitente int unsigned, -- este campo sera el clave, sera una bandera, si es 1 = escribio el userId, si es 2 = escribio el atendioId
	status tinyint not null default 0,
	primary key (idChat),
	foreign key (userId) references userTemporal (idUser), 
	foreign key (atendioId) references soporteMT (idSoporte)
)ENGINE=InnoDB, charset=utf8;


insert into chats values
(default, "hola Soporte Microtec", default, 1, 2, 1, 1),
(default, "Buenas tareds juanito en que te podemos ayudar", default, 1, 2, 2, 1),
(default, "quisiera uyn plan", default, 1, 2, 1, 1),
(default, "que onda", default, 3, 4, 1, 1),
(default, "buen dia Robert", default, 3, 4, 2, 1),
(default, "hey", default, 4, 3, 1, 1),
(default, "para obtenre un plan ...", default, 4, 3, 2, 1),
(default, "hola micro tec", default, 5, 3, 1, 1),
(default, "hola Luz", default, 5, 3, 2, 1),
(default, "en que te podemos ayudar", default, 5, 3, 2, 1);




-- ultimo registro agrupado.











