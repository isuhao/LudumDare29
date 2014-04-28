'use strict';

var POWER_DURATION = 200; // how long the powerup lasts, in frames
var NORMAL_SPEED = 100; // speed of the player, normally
var POWER_SPEED = 200; // speed of the player when carroted
var SLOW_SPEED = 50; // speed when drilling through a rock
var INITIAL_HEALTH = 100; // how much health the player starts with

var Bunny = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'drilling', frame);
	// scale up!
	this.smoothed = false;
	this.scale.x = 2;
	this.scale.y = 2;
	// center rotations
	this.anchor.setTo(0.5, 0.5);
	// enable physics
	this.game.physics.arcade.enableBody(this);
	// set body size
	this.body.setSize(12, 14, 0, 12);
	// enable input
	this.cursors = game.input.keyboard.createCursorKeys();
	// wiggle wiggle
	this.baseY = this.y;
	// animate
	this.animations.add('drill', [0, 1, 2], 12, true);
	this.animations.add('power', [3, 4, 5], 24, true);
	this.animations.play('drill');
	// POWER UP
	this.powertimer = 0;
	// moooove
	this.body.velocity.y = NORMAL_SPEED;
	// set initial health
	this.health = INITIAL_HEALTH;
	// set to false to deny input (menu screen)
	this.controllable = true;
	// whether or not a rock is slowing us down
	this.slowed = false;
};

Bunny.prototype = Object.create(Phaser.Sprite.prototype);
Bunny.prototype.constructor = Bunny;

Bunny.prototype.update = function() {
	this.body.velocity.x = 0;
	
	if (this.cursors.left.isDown && this.controllable) {
		this.body.velocity.x = -100;
	}
	
	if (this.cursors.right.isDown && this.controllable) {
		this.body.velocity.x = 100;
	}
	
	if (this.body.velocity.x < 0 && this.angle < 22.5) {
		this.body.angularVelocity = 200;
	} else if (this.body.velocity.x > 0 && this.angle > -22.5) {
		this.body.angularVelocity = -200;
	} else if (this.angle != 0){
		if (this.angle < 0) {
			this.body.angularVelocity = 50;
		} else if (this.angle > 0) {
			this.body.angularVelocity = -50;
		}
	}
	
	// carrot powerup neglects slowing by rocks
	
	if (this.powertimer > 0)
	{
		this.powertimer--;
		
		if (this.powertimer === 0)
		{
			this.animations.play('drill');
			this.body.velocity.y = NORMAL_SPEED;
		}
	} else if (this.slowed) {
		this.body.velocity.y = SLOW_SPEED;
		this.slowed = false;
	} else {
		this.body.velocity.y = NORMAL_SPEED;
	}
	
	if (this.x < 0) this.x = 0;
	if (this.x > 320) this.x = 320;
};

Bunny.prototype.powerup = function() {
	this.animations.play('power');
	this.powertimer = POWER_DURATION;
	this.body.velocity.y = POWER_SPEED;
};

Bunny.prototype.hitRock = function() {
	this.slowed = true;
}

module.exports = Bunny;
