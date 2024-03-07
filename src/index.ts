import Heatmap from './classes/Heatmap';
import { aspect, modifyTvData } from './helper';

const APP = document.getElementById('__APP')!;

let CANVAS: HTMLCanvasElement;

let CTX: CanvasRenderingContext2D;

let DATA: TGStock<TStock>[] = [];

const SIZE: Record<'w' | 'h' | 'ar', number> = {
	w: 0,
	h: 0,
	ar: 0,
};

const HEATMAP = new Heatmap<TStock>();

const onLoadDOM = () => {
	try {
		if (!APP) throw new Error('Could not find <APP /> element');

		getSizes();
		createCanvas();
		refetchData();
	} catch (e) {
		console.error(e);
	}
};

const getSizes = () => {
	try {
		const { innerHeight, innerWidth } = window;

		SIZE.w = innerWidth;
		SIZE.h = innerHeight;
		SIZE.ar = aspect(SIZE.w, SIZE.h);
	} catch (e) {
		console.error(e);
	}
};

const createCanvas = () => {
	try {
		CANVAS = document.createElement('canvas');

		CANVAS.width = SIZE.w;
		CANVAS.height = SIZE.h;

		APP.appendChild(CANVAS);

		CTX = CANVAS.getContext('2d')!;
	} catch (e) {
		console.error(e);
	}
};

const removeLoading = () => {
	try {
		const eLoading = document.getElementById('__LOADING');
		if (eLoading) eLoading.remove();
	} catch (e) {
		//
	}
};

const refetchData = async () => {
	try {
		interface ServerResponse {
			totalCount: number;
			data: Api.Root[];
		}

		const url = 'https://scanner.tradingview.com/america/scan';
		const raw =
			'{"columns":["typespecs","change|60","change|240","change","Perf.W","Perf.1M","Perf.3M","Perf.6M","Perf.YTD","Perf.Y","premarket_change","postmarket_change","relative_volume_10d_calc","Volatility.D","gap","market_cap_basic","number_of_employees","dividend_yield_recent","price_earnings_ttm","price_sales_current","price_book_fq","volume|60","volume|240","volume","volume|1W","volume|1M","Value.Traded|60","Value.Traded|240","Value.Traded","Value.Traded|1W","Value.Traded|1M","sector","logoid","close|60","pricescale","name","description","update_mode"],"filter":[{"left":"market_cap_basic","operation":"nempty"},{"left":"name","operation":"not_in_range","right":["GOOG"]}],"ignore_unknown_fields":false,"options":{"lang":"en"},"sort":{"sortBy":"market_cap_basic","sortOrder":"desc"},"symbols":{"query":{"types":[]},"tickers":[],"groups":[{"type":"index","values":["SP:SPX"]}]},"markets":["america"]}';

		fetch(url, {
			method: 'post',
			body: raw,
		})
			.then((response) => response.json())
			.then(({ data }: ServerResponse) => {
				DATA = modifyTvData(data);
				removeLoading();
				draw();
			})
			.catch((e) => console.error(e));
	} catch (e) {
		//
	}
};

const draw = () => {
	try {
		HEATMAP.size(SIZE.w, SIZE.h)
			.context(CTX)
			.hierarchy(DATA)
			.sort(
				(g) => g[0],
				(s) => s[0],
			)
			.sum()
			.treemapSquarified();
	} catch (e) {
		console.error(e);
	}
};

document.addEventListener('DOMContentLoaded', onLoadDOM);
