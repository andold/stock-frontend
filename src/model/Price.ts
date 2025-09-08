// Price.ts

export default interface Price {
	id: number;
	code: string;
	base: string;
	closing: number;
	market: number;
	high: number;
	low: number;
	volume: number;
	flag: number;
	created: string;
	updated: string;

	// not support field. user custom.
	custom: any;
}
