declare type TStock = [number, string];

declare type TFunc<T, K> = (arg: T) => K;

declare type TGStock<T> = [number, string, T[]];

declare interface IRect {
	v: number;
	r: number;
	w: number;
	h: number;
	children: number[];
}

declare namespace Api {
	export type s = string;

	export type d = [];

	export interface Root {
		s: s;
		d: [
			[string],
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			null,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			string,
			string,
			number,
			number,
			string,
			string,
			string,
		];
	}
}
