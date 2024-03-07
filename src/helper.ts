export const area = (width: number, height: number) => {
	return width * height;
};

export const randColor = () => {
	return (
		'#' +
		Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, '0')
			.toUpperCase()
	);
};

export const sum = (arr: number[]) => {
	return arr.reduce((total, current) => total + current, 0);
};

export const aspect = (width: number, height: number) => {
	if (width === height) return 1;
	return Math.max(width, height) / Math.min(width, height);
};

export const isBetween = (min: number, value: number, max: number) => value >= min && value <= max;

export const zero = (value: number, returnValue: number) => (value === 0 ? returnValue : value);

export const toFixed = (value: number, l: number) => {
	const [integer, decimal] = String(value).split('.');
	if (!decimal || l === 0) return Number(integer) * 1;

	const slicedDecimal = decimal.slice(0, l);

	return Number(`${integer}.${slicedDecimal}`) * 1;
};

export const modifyTvData = (data: Api.Root[]) => {
	const x: Record<string, [number, string, [number, string][]]> = {};

	data.forEach((item) => {
		const d = item.d;
		const gn = d[31];

		if (gn in x) {
			x[gn][0] += d[15];
			x[gn][2].push([d[15], d[35]]);
		} else x[gn] = [d[15], gn, [[d[15], d[35]]]];
	});

	const y: TGStock<TStock>[] = [];

	for (const g in x) {
		// @ts-expect-error: unknown
		x[g].sort((a, b) => b[0] - a[0]);
		y.push(x[g]);
	}

	y.sort((a, b) => b[0] - a[0]);

	return y;
};
