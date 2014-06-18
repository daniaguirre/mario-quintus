$(function() {
	//obtenemos quintus
	var Q = Quintus({
		development : true
	});
	//modulos a utilizar
	Q.include("Sprites, Scenes, Input, 2D, Anim, Touch, TMX");
	//que se maximize el canvas
	Q.setup("juego");
	//activamos los controles del teclado y touch para moviles y tabletas
	Q.controls().touch();

	//definimos las animaciones de mario
	Q.animations("mario_anim", {
		caminar : {
			frames : [4, 5, 8],
			rate : 1 / 6,
			loop : false
		},
		quieto : {
			frames : [1],
			rate : 1 / 2,
			loop : false
		},
		saltar : {
			frames : [2],
			rate : 1 / 2,
			loop : false
		},
		morir : {
			frames : [12],
			rate : 1,
			loop : false,
			trigger : "muerto"
		}
	});

	//animaciones de goomba
	Q.animations("goomba_anim", {
		caminar : {
			frames : [1, 0],
			rate : 1 / 4
		},
		aplastar : {
			frames : [3],
			rate : 1,
			loop : false,
			trigger : "aplastado"
		}
	});

	//animaciones de tortuga verde
	Q.animations("tortuga_verde_anim", {
		caminar : {
			frames : [1, 0],
			rate : 1 / 4
		},

		concha : {
			frames : [2, 4],
			rate : 1 / 2,
			loop: false
		}
	});

	//animaciones de tortuga cafe alada
	Q.animations("tortuga_cafe_alada_anim", {
		caminar : {
			frames : [3, 7],
			rate : 1 / 4
		},
		concha : {
			frames : [6, 5],
			rate : 1 / 2,
			loop: false
		}
	});

	//definimos el jugador
	Q.Sprite.extend("Jugador", {
		init : function(p) {
			this._super(p, {
				sheet : "jugador", /*también se puede poner vx*/
				sprite : "mario_anim",
				jumpSpeed : -700,
				vx : 180,
				frame : 1
			});

			this.add("2d, platformerControls, animation");

			this.on("bump.left, bump.right", function(colision) {
				if (colision.obj.isA("Enemigo")) {
					this.play("morir");
				}
			});

			this.on("muerto", function() {
				//una vez que termine la animacion del goomba aplastado
				//destruimos a mario
				this.destroy();
			});

		},
		step : function(dt) {
			if (this.p.vx > 0 && this.p.vy === 0) {

				this.p.flip = false;
				this.play("caminar");
			} else if (this.p.vx < 0 && this.p.vy === 0) {

				this.p.flip = "x";
				this.play("caminar");
			} else if (this.p.vx === 0 && this.p.vy === 0) {

				this.play("quieto");
			} else if (this.p.vy !== 0) {

				this.play("saltar");
			}
		}
	});

	//enemigo de 32x32
	Q.Sprite.extend("Goomba", {
		init : function(p) {
			this._super(p, {
				sheet : "goomba",
				sprite : "goomba_anim",
				vx : -100,
				frame : 1,
				visibleOnly : true
			});

			this.add("2d, aiBounce, animation");

			this.play("caminar");

			this.on("bump.top", function(colision) {
				if (colision.obj.isA("Jugador")) {
					colision.obj.p.vy = -300;
					this.p.vx = 0;
					this.play("aplastar");
				}
			});

			this.on("aplastado", function() {
				//una vez que termine la animacion del goomba aplastado
				//destruimos al goomba
				this.destroy();
			});

		}
	});

	//enemigo Tortuga Verde
	Q.Sprite.extend("TortugaVerde", {
		init : function(p) {
			this._super(p, {
				sheet : "tortugaVerde",
				sprite : "tortuga_verde_anim",
				vx : -100,
				frame : 1,
				visibleOnly : true
			});

			this.add("2d, aiBounce, animation");

			this.play("caminar");

			this.on("bump.top", function(colision) {
				if (colision.obj.isA("Jugador")) {
					this.p.vx = 300;
					colision.obj.p.vy = -300;
					this.sheet("goomba", true);
					this.play("concha");
				}
			});

			/*this.on("aplastado", function() {
			 //una vez que termine la animacion del goomba aplastado
			 //destruimos al goomba
			 this.destroy();
			 });*/

		},

		step : function() {
			if (this.p.vx > 0 && this.p.vy === 0) {
				this.p.flip = "x";
			}
			if (this.p.vx < 0 && this.p.vy === 0) {
				this.p.flip = false;
			}
		}
	});

	//enemigo Tortuga Cafe Alada
	Q.Sprite.extend("TortugaCafeAlada", {
		init : function(p) {
			this._super(p, {
				sheet : "tortugaCafeAlada",
				sprite : "tortuga_cafe_alada_anim",
				vx : -100,
				frame : 3,
				visibleOnly : true
			});

			this.add("2d, aiBounce, animation");

			this.play("caminar");

			this.on("bump.top", function(colision) {
				if (colision.obj.isA("Jugador")) {
					this.p.vx = 300;
					colision.obj.p.vy = -300;
					this.sheet("goomba", true);
					this.play("concha");
				}
			});


			/*this.on("aplastado", function() {
			 //una vez que termine la animacion del goomba aplastado
			 //destruimos al goomba
			 this.destroy();
			 });*/

		},
		step : function() {
			if (this.p.vx > 0 && this.p.vy === 0) {
				this.p.flip = "x";
			}
			if (this.p.vx < 0 && this.p.vy === 0) {
				this.p.flip = false;
			}
		}
	});

	//Definimos una escena
	Q.scene("mundo1", function(stage) {
		Q.stageTMX("mapa_nivel1.tmx", stage);

		var capaFondo = Q("TileLayer").first();

		stage.add("viewport").follow(Q("Jugador").first(), {
			x : true,
			y : true
		}, {
			minX : 0,
			maxX : capaFondo.p.w,
			minY : 0,
			maxY : capaFondo.p.h
		});
	});

	Q.loadTMX("mapa_nivel1.tmx, jugador.json, goomba.json, tortugaVerde.json, tortugaCafeAlada.json", function() {
		Q.compileSheets("mosaicos_mario_enano.png", "jugador.json");
		Q.compileSheets("mosaicos_enemigos_32x32.png", "goomba.json");
		Q.compileSheets("mosaicos_enemigos_32x46.png", "tortugaVerde.json");
		Q.compileSheets("mosaicos_enemigos_32x46.png", "tortugaCafeAlada.json");
		Q.stageScene("mundo1");
	});
});
