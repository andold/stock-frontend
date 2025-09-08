// Item.ts

export default interface Item {
	id: number;

	code?: string;		//	종목코드
	symbol?: string;	//	종목이름
	priority?: number;	//	우선순위
	priceEarningsRatio?: number;	//	배당수익률(%)
	volumeOfListedShares?: number;	//	상장주식수
	type?: string;		//	코스피, 코스닥
	category?: string;	//	분류
	ipoOpen?: number;	//	상장일
	ipoClose?: number;	//	상장폐지일

	created?: number;	//	생성일
	updated?: number;	//	수저일

	// not support field. user custom.
	custom?: any;
}
