$(function() {
	//obtenemos quintus
	var Q = Quintus();
	//que se maximize el canvas
	Q.setup("juego");
	//modulos a utilizar
	Q.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX");
	//activamos los controles del teclado y touch para moviles y tabletas
	Q.controls().touch();

	//definimos el jugador
	Q.Sprite.extend("Jugador", {
		init : function(p) {
			this._super(p, {
				sheet : "jugador",
				jumpSpeed : -700,
				speed : 180,
				frame: 1
			});

			this.add("2d, platformerControls");
		}
	});

	//enemigo de 32x32
	Q.Sprite.extend("Enemigo", {
		init : function(p) {
			this._super(p, {
				sheet : "enemigo",
				vx : 100,
				frame: 1,
				visibleOnly: true 
			});

			this.add("2d, aiBounce");
		}
	});

	//Definimos una escena
	Q.scene("mundo1", function(stage) {
		Q.stageTMX("mapa1.tmx", stage);
		stage.add("viewport").follow(Q("Jugador").first());
	});

	Q.loadTMX("mapa1.tmx, jugador.json, enemigo.json", function() {
		Q.compileSheets("mosaicos_mario_enano.png", "jugador.json");
		Q.compileSheets("mosaicos_enemigos_32x32.png", "enemigo.json");
		Q.stageScene("mundo1");
	});
}); 