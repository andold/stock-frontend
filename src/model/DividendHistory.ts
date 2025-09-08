// DividendHistory.ts

export default interface DividendHistory {
	id: number;
	code: string;

	base: string;
	pay: string;
	dividend: number;

	priceBase: string;
	priceClosing: number;	//	종가

	created: string;
	updated: string;

	// not support field. user custom.
	custom: any;
}
