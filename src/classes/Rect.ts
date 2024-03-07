import { randColor } from '../helper';

class Rect {
	private _ctx: CanvasRenderingContext2D;

	public x: number;

	public y: number;

	public width: number;

	public height: number;

	readonly _radius = 8;

	readonly _lineWidth = 4;

	readonly isVertical: boolean;

	constructor(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		this._ctx = context;

		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.isVertical = width / height < 1;
	}

	draw() {
		const lineWidth = this._lineWidth;

		const x = this.x + lineWidth;
		const y = this.y + lineWidth;
		const radius = this._radius;
		const width = this.width - lineWidth;
		const height = this.height - lineWidth;

		this._ctx.beginPath();
		this._ctx.fillStyle = randColor();
		this._ctx.lineWidth = lineWidth;
		this._ctx.beginPath();
		this._ctx.moveTo(x + radius, y);
		this._ctx.arcTo(x + width, y, x + width, y + height, radius);
		this._ctx.arcTo(x + width, y + height, x, y + height, radius);
		this._ctx.arcTo(x, y + height, x, y, radius);
		this._ctx.arcTo(x, y, x + width, y, radius);
		this._ctx.closePath();
		this._ctx.fill();
	}
}

export default Rect;
