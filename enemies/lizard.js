
let UP;
let DOWN;
let LEFT;
let RIGHT;

let Direction = {
	UP,
	DOWN,
	LEFT,
	RIGHT
};

const randomDirection = (exclude = Direction) => {
	let newDirection = Phaser.Math.Between(0, 3)
	while (newDirection === exclude)
	{
		newDirection = Phaser.Math.Between(0, 3)
	}

	return newDirection
};

export default class Lizard extends Phaser.Physics.Arcade.Sprite
{
	direction = Direction.RIGHT
	moveEvent = Phaser.Time.TimerEvent

	moveEvent = scene.time.addEvent({
		delay: 2000,
		callback: () => {
			this.direction = randomDirection(this.direction)
		},
		loop: true
	})

	destroy(fromScene = boolean)
	{
		this.moveEvent.destroy()

		super.destroy(fromScene)
	}

	handleTileCollision(go = Phaser.GameObjects.GameObject, tile= Phaser.Tilemaps.Tile)
	{
		if (go !== this)
		{
			return
		}

		this.direction = randomDirection(this.direction)
	}

	preUpdate(t= number, dt= number)
	{
		super.preUpdate(t, dt)

		const speed = 50

		switch (this.direction)
		{
			case Direction.UP:
				this.setVelocity(0, -speed)
				break

			case Direction.DOWN:
				this.setVelocity(0, speed)
				break

			case Direction.LEFT:
				this.setVelocity(-speed, 0)
				break

			case Direction.RIGHT:
				this.setVelocity(speed, 0)
				break
		}
	}
};