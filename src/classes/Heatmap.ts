import { aspect, isBetween, toFixed, zero } from '../helper';
import Rect from './Rect';

class Heatmap<T> {
	private _data: TGStock<T>[] = [];

	private _rects: Rect[] = [];

	private _sum: number = 0;

	private _length = 0;

	private _width = 0;

	private _height = 0;

	readonly _gr = 1; // Golden Ratio

	private _ctx!: CanvasRenderingContext2D;

	size(width: number, height: number) {
		this._width = width;
		this._height = height;

		return this;
	}

	context(ctx: CanvasRenderingContext2D) {
		this._ctx = ctx;
		return this;
	}

	hierarchy(data: TGStock<T>[]) {
		this._data = JSON.parse(JSON.stringify(data)) as TGStock<T>[];
		this._length = this._data.length;

		return this;
	}

	sort(gcv: TFunc<TGStock<T>, number>, rcv: TFunc<T, number>) {
		this._data.sort((a, b) => gcv(b) - gcv(a));

		for (let i = 0; i < this._length; i++) {
			this._data[i][2].sort((a, b) => rcv(b) - rcv(a));
		}

		return this;
	}

	sum() {
		this._sum = this._data.reduce((total, current) => total + current[0], 0);
		return this;
	}

	// Squarified & Golden
	treemapSquarified() {
		const width = this._width;
		const height = this._height;
		const area = width * height;
		const ratios: number[] = [];
		const d = JSON.parse(JSON.stringify(this._data)) as TGStock<T>[];

		for (let i = 0; i < this._length; i++) {
			ratios.push(d[i][0] / this._sum);
		}

		let availableWidth = width;
		let availableHeight = height;

		for (let i = 0; i < this._length; i++) {
			const item1: TGStock<T> | undefined = d[i];

			if (item1) {
				let totalValueAsPercent = ratios[i];

				const isVertical = availableWidth / availableHeight < 1;
				let itemsArea = totalValueAsPercent * area;

				let totalWidth = isVertical ? availableWidth : itemsArea / availableHeight;
				let totalHeight = isVertical ? itemsArea / availableWidth : availableHeight;

				const rect: IRect = {
					w: totalWidth,
					h: totalHeight,
					v: item1[0],
					r: isVertical ? totalHeight / totalWidth : totalWidth / totalHeight,
					children: [item1[0]],
				};

				let availableAspectRatio = aspect(
					zero(availableWidth - totalWidth, availableWidth),
					zero(availableHeight - totalHeight, availableHeight),
				);

				for (let j = i + 1; j < this._length; j++) {
					if (d[j]) {
						const item2 = d[j];
						const itemsLength = j - i + 1;

						totalValueAsPercent += ratios[j];
						itemsArea = totalValueAsPercent * area;

						totalWidth = isVertical ? rect.w : itemsArea / availableHeight;
						totalHeight = isVertical ? itemsArea / availableWidth : rect.h;

						const currentRatio = isVertical ? totalHeight / totalWidth : totalWidth / totalHeight;
						const totalRatio = (rect.r + currentRatio) / itemsLength;

						const previousRatioBetterThanCurrentRatio =
							(toFixed(availableAspectRatio, 1) === this._gr && isBetween(this._gr - 0.4, totalRatio, this._gr + 0.4)) ||
							toFixed(rect.r, 1) === this._gr ||
							Math.abs(this._gr - totalRatio) - Math.abs(this._gr - rect.r) > 0;

						if (previousRatioBetterThanCurrentRatio) {
							totalValueAsPercent -= ratios[j];
							break;
						}

						availableAspectRatio = aspect(
							zero(availableWidth - totalWidth, availableWidth),
							zero(availableHeight - totalHeight, availableHeight),
						);

						rect.w = totalWidth;
						rect.h = totalHeight;
						rect.r = totalRatio;
						rect.v += item2[0];
						rect.children.push(item2[0]);

						delete d[j];
					}
				}

				let x = width - availableWidth;
				let y = height - availableHeight;
				for (let j = 0; j < rect.children.length; j++) {
					const value = rect.children[j] / rect.v;
					const w = isVertical ? value * rect.w : rect.w;
					const h = isVertical ? rect.h : value * rect.h;
					const r = new Rect(this._ctx, 0, 0, w, h);

					r.x = x;
					r.y = y;

					x += isVertical ? w : 0;
					y += isVertical ? 0 : h;

					r.draw();

					this._rects.push(r);
				}

				if (isVertical) availableHeight -= rect.h;
				else availableWidth -= rect.w;

				delete d[i];
			}
		}
	}
}

export default Heatmap;
