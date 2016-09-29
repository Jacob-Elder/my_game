$(document).ready(function(){
	console.log("Hello!");

	//putting all the game code in a runGame function to be called after the opening credits
	var runGame = function() {
		//clear the html from the opening credits
		$("body").html("");
		//declaring variables that will be used in multiple functions
		var player;
		var flag;
		var shells;
		var shell;
		var laser;
		var spacefield;
		var backgroundv;
		var roar;
		var blaster;
		var die;
		var video;
		var super_mario_bros;
		var location;
		var emitter;
		var gameOver;
		var lives = 5;
		var playerWon = false;
		var text;
		var finalMessage;
		//initialize a new phaser game
		var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

		//load all the images to be used 
		function preload() {
			game.load.image('starfield', 'img/starfield.jpeg');
			game.load.image('spinning_asteroid', 'img/spinning_asteroid.gif-c200');
			game.load.image('pebble', 'img/pebble.png');
		    game.load.image('ground', 'img/kong_platform.png');
		    game.load.image('flag', 'img/tie_fighter.png');
		    game.load.image('smash_platform', 'img/smash_platform.png');
		    game.load.image('vertical_platform', 'img/vertical_platform.png');
		    game.load.image('line', 'img/line.png');//<-handles physics for main platform
		    game.load.image('crate', 'img/crate.png');
		    game.load.spritesheet('dude', 'img/mario.png', 60, 95);
		    game.load.image('green_laser', 'img/green_laser.png');
		    game.load.image('turtle_shell', 'img/turtle_shell.png');
		    //load audio files
		    game.load.audio('roar', ['audio/chewy_roar.mp3', 'audio/chewy_roar.ogg']);
		    game.load.audio('blaster', ['audio/blaster.mp3', 'audio/blaster.ogg']);
		    game.load.audio('die', ['audio/mario-die.mp3', 'audio/mario-die.ogg']);
		    game.load.audio('gameOver', ['audio/mario-gameover.mp3', 'audio/mario-gameover.ogg']);
		    game.load.audio('super_mario_bros', ['audio/super_mario_bros.mp3', 'audio/super_mario_bros.ogg']);
		    //load final cut-scene
		    game.load.video('final_scene', 'video/final_scene.mp4');
		}

		//place all elements on the page and give them the appropriate physical properties
		function create() {
			//create the final cut-scene (to be played when the player wins)
			video = game.add.video('final_scene');
			//create audio sounds
			roar = game.add.audio('roar');
			blaster = game.add.audio('blaster');
			die = game.add.audio('die');
			gameOver = game.add.audio('gameOver');
			super_mario_bros = game.add.audio('super_mario_bros');
			super_mario_bros.play();

			//enable arcade physics to be used
			game.physics.startSystem(Phaser.Physics.ARCADE);
			//add a background to the game
			spacefield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
			backgroundv = -.8;
			//create a physics group for the ledges
			platforms = game.add.group();
			//enable physics for objects in the platforms group
			platforms.enableBody = true;

			//create the super-smash bros platform at the bttom of the world 
			smash_platform = game.add.sprite(107, game.world.height-80, 'smash_platform');
			//add a line in the middle of the super-smash platform to handle physics
			//this looks more real than items sitting on the outer edge
			line = game.add.sprite(125, game.world.height-67, 'line');
			game.physics.arcade.enable(line);
			line.body.immovable = true;
			//line.body.friction = .1;
			line.scale.setTo(.81, 5);

			//create ledes to make up the map
			var ledge = platforms.create(150, 250, 'vertical_platform');
			ledge.scale.setTo(1, .9)
			ledge.body.immovable = true;
			ledge = platforms.create(310, 330, 'vertical_platform');
			ledge.scale.setTo(1, .5);
			ledge.body.immovable = true;
			ledge = platforms.create(150, 400, 'ground');
			ledge.scale.setTo(.3, 1);
			ledge.body.immovable = true;
			ledge = platforms.create(-150, 210, 'ground');
			ledge.body.immovable = true;
			ledge = platforms.create(150, 90, 'vertical_platform');
			ledge.body.immovable = true;
			ledge = platforms.create(340, 360, 'ground');
			ledge.body.immovable = true;
			ledge = platforms.create(500, 360, 'ground');
			ledge.body.immovable = true;
			ledge = platforms.create(140, 210, 'ground');
			ledge.body.immovable = true;
			ledge = platforms.create(155, -10, 'ground');
			ledge.body.immovable = true;
			ledge = platforms.create(620, 195, 'ground');
			ledge.scale.setTo(.3, 1);
			ledge.body.immovable = true;
			ledge = platforms.create(700, 195, 'ground');
			ledge.scale.setTo(.3, 1);
			ledge.body.immovable = true;
			ledge = platforms.create(420, 300, 'ground');
			ledge.scale.setTo(.3, 1);
			ledge.body.immovable = true;
			ledge = platforms.create(420, 94, 'vertical_platform');
			ledge.scale.setTo(1, .76);
			ledge.body.immovable = true;
			ledge = platforms.create(180, 150, 'ground');
			ledge.scale.setTo(.3, .5);
			ledge.body.immovable = true;

			//add the tie_fighter, which is also the goal
			flag = game.add.sprite(10, 50, 'flag');
			game.physics.arcade.enable(flag);
			flag.body.gravity.y = 200;
			flag.body.collideWorldBounds = true;
			flag.body.immovable = false;

			//add turtle shell obstacles
			shells = game.add.group();
			shells.enableBody = true;
			shell = shells.create(290, 120, 'turtle_shell', 'img/turtle_shell.png');
			game.physics.arcade.enable(shell);
			shell.body.gravity.y = 50;
			shell.body.velocity.x = 250;
			shell.body.bounce.x = 1;
			shell = shells.create(450, 300, 'turtle_shell', 'img/turtle_shell.png');
			game.physics.arcade.enable(shell);
			shell.body.gravity.y = 50;
			shell.body.velocity.x = 350;
			shell.body.bounce.x = 1;
			shell.body.collideWorldBounds = true;
			shell = shells.create(320, 300, 'turtle_shell', 'img/turtle_shell.png');
			game.physics.arcade.enable(shell);
			shell.body.gravity.y = 50;
			shell.body.velocity.x = 100;
			shell.scale.setTo(1, .9);
			shell.body.bounce.x = 1;

			//create randomly-placed flying lasers
			lasers = game.add.group();
			lasers.enableBody = true;
			//a function to create lasers
			var shoot = function(){laser = lasers.create(game.world.width, game.rnd.integerInRange(0, game.world.height - 85), 'green_laser', 'img/green_laser.png');
			laser.body.velocity.x = -140;
			laser.scale.setTo(1, 2);
			blaster.play();
			}
			//shoot a laser every 2 seconds
			setInterval(shoot,1000);

			//add the crate and give proper physics properties
			crate = game.add.sprite(game.world.width-210, game.world.height-100, 'crate');
			game.physics.arcade.enable(crate);
			crate.body.gravity.y = 1000;
			//crate.body.velocity.x = 0;
			crate.body.collideWorldBounds = false;
			crate.checkWorldBounds = true;
			crate.events.onOutOfBounds.add(crateOut, this);
			crate.body.immovable = false;


			//create your character
			player = game.add.sprite(180, 500, 'dude');
			//enable physics for your character
			game.physics.arcade.enable(player);
			//add physics properties ie: give weight and a little bounce
			player.body.bounce.y = 0.2;
			player.body.gravity.y = 300;
			player.body.collideWorldBounds = false;
			//add physics to check when player leaves the world bounds
			player.checkWorldBounds = true;
			player.events.onOutOfBounds.add(playerOut, this);
			//make character the right size
			player.scale.setTo(0.5);
			//give anchor for flipping animation
			player.anchor.setTo(0.5);
			//animations for walking left and right
			player.animations.add('left', [2, 3, 4, 5, 6, 7], 10, true);
			player.animations.add('right', [2, 3, 4, 5, 6, 7], 10, true);

			//create randomly-placed flying asteroids
			asteroids = game.add.group();
			asteroids.enableBody = true;
			function launchAsteroid(){
			asteroid = asteroids.create(game.rnd.integerInRange(0, game.world.width - 100), game.world.height, 'spinning_asteroid', 'img/spinning_asteroid.gif-c200'); 
			asteroid.scale.setTo(.5, .5);
			asteroid.body.velocity.y = game.rnd.integerInRange(-45, -75);
			asteroid.body.velocity.x = game.rnd.integerInRange(5, 35);
			}
			setInterval(launchAsteroid, 9000);


			//display lives remaining in the top-right
			text = game.add.text(game.world.width - 160, 35, 'lives: 5');
			text.addColor("#ff0000", 0);

			//To display final message
			finalMessage = game.add.text(160, 250, '', { fontSize: '80px'});
			finalMessage.addColor("#1ed811", 0);

			//create emitter when asteroid dies
			emitter = game.add.emitter(0, 0, 100);
			emitter.makeParticles('pebble');
			emitter.gravity = 200;


		}

		//handle in-game action
		function update() {
			spacefield.tilePosition.y += backgroundv;
			//reset the player, subtract a life, and see if player is out of lives when they get hit by a laser
			var killPlayerByLaser = function(a, b){
				roar.play();
				b.destroy();
				player.kill();
				lives --;
				text.text = 'lives: ' + lives;
				isGameOver();
				resetPlayer();
			}
			game.physics.arcade.collide(player, lasers, killPlayerByLaser, null, this);

			//kill the player when hit by an asteroid
			var killPlayerByAsteroid = function(a, b){
				particleBurst();
				roar.play();
				b.kill();
				player.kill();
				lives --;
				text.text = 'lives: ' + lives;
				isGameOver();
				resetPlayer();
			}
			game.physics.arcade.collide(player, asteroids, killPlayerByAsteroid);

			//Kill the player when they are hit by a turtle shell
			//uses same function as when player falls off the map
			game.physics.arcade.collide(player, shells, playerOut);
			
			//have physics check for collisions between certain objects
			game.physics.arcade.collide(player, platforms);
			game.physics.arcade.collide(crate, platforms);
			game.physics.arcade.collide(player, crate);
			game.physics.arcade.collide(flag, platforms);
			game.physics.arcade.collide(shells, platforms);
			game.physics.arcade.collide(player, line);
			game.physics.arcade.collide(crate, line);
			game.physics.arcade.collide(player, flag, youWin);

			//built in keyboard manager that populates cursors object with up, down, left, and right
			cursors = game.input.keyboard.createCursorKeys();
			//set the crates velocity to 0 so it doesnt slide forever
			crate.body.velocity.x = 0;
			//set the players horizontal velocity to 0
			player.body.velocity.x = 0;
			//apply movement and animation to the character when a key is pressed
			if(cursors.left.isDown) {
				//move to the left
				player.scale.setTo(-.5, .5);
				player.body.velocity.x = -150;

				player.animations.play('left');
			}
			else if (cursors.right.isDown) {
				//move to the right 
				player.scale.setTo(.5, .5);
				player.body.velocity.x = 150;

				player.animations.play('right');
			}
			else {
				//stand still
				player.animations.stop();

				player.frame = 1;
			}

			//allow the player to jump if they are on the ground
			if (cursors.up.isDown && player.body.touching.down) {
				player.body.velocity.y = -250;
			}

			//alert the player when they reach the tie fighter
			function youWin() {
				playerWon = true;
				window.location.href = "final_credits.html";
			//alert("Congratulations! You made it to the ship and escaped from the Galactic Empire!!! Wait for Episode II to figure out what happens next.");
			}
		}
		/*****************************
		callback function to be used for overlap detection
		*******************************/
		function checkOverlap(spriteA, spriteB) {
		    var boundsA = spriteA.getBounds();
		    var boundsB = spriteB.getBounds();
		    return Phaser.Rectangle.intersects(boundsA, boundsB);
		}
		//kill and reset player if they leave the map
		function playerOut(player) {
				die.play();
				player.kill();
				lives --;
				text.text = 'lives: ' + lives;
				isGameOver();
				resetPlayer();
		}
		//reset crate if it falls off the map
		function crateOut(crate) {
				crate.kill();
				crate.reset(game.world.width-210, game.world.height-100);
		}
		function resetPlayer() {
			if (lives >= 1) {
				player.reset(180, game.world.height-120);
			}
		}
		//used to reload the page when player loses
		function refresh() {
			window.location.reload();
		}
	 	//display final message 
		function isGameOver() {
			if(lives < 1) {
				setTimeout(refresh, 5000);
				finalMessage.text = 'Game Over!';
				gameOver.play();
			}
		}
		//callback functions for emitter
		function particleBurst() {
		location = asteroid.body;
	    emitter.x = location.x;
	    emitter.y = location.y;
	    emitter.start(true, 4000, null, 10);
		}
	}
	//run the hard game code when the player clicks Savage!
	setTimeout(runGame, 14000);
});






