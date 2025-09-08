// StockModel.ts

export interface StockForm {
	mode: number;

	//	pageable
	size: number,
	page: number,
	totalPages: number,
	rowHeight: number,

	filterDividendPayoutRatio: boolean;

	priority: null | number;	//	우선순위
	keyword: null | string;
	start: null | moment.Moment;
	end: null | moment.Moment;

	// not support field. user custom.
	custom?: any;
}
