import { makeAutoObservable } from "mobx";

import repository from "../repository/PriceRepository";
import Price from "../model/Price";
import moment from "moment";

// PriceStore.ts
class PriceStore {
	constructor() {
		makeAutoObservable(this);
	}

	search(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.search(request, onSuccess, onError, element);
	}
	crawl(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawl(request, onSuccess, onError, element);
	}
	compile(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.compile(request, onSuccess, onError, element);
	}
	purge(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.purge(request, onSuccess, onError, element);
	}
	deduplicate(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.deduplicate(request, onSuccess, onError, element);
	}
	download(filename: string, onSuccess?: any, onError?: any, element?: any) {
		repository.download(filename, onSuccess, onError, element);
	}
	downloadNoStreaming(filename: string, onSuccess?: any, onError?: any, element?: any) {
		repository.downloadNoStreaming(filename, onSuccess, onError, element);
	}
	upload(file?: any, onSuccess?: any, onError?: any, element?: any) {
		const request = new FormData();
		request.append("file", file);
		repository.upload(request, onSuccess, onError, element);
	}

	makeMap(prices: Price[]) {
		const map = new Map();
		prices.forEach((price: Price) => {
			const prev: any[] = map.get(price.code);
			if (!prev) {
				map.set(price.code, [price]);
				return;
			}

			prev.push(price);
		});
		return map;
	}
	makeMapByFlag(prices: Price[]) {
		const map = new Map();
		prices.forEach((price: Price) => {
			const week: any[] = map.get(`${price.code}.${price.flag & 32}`);
			const month: any[] = map.get(`${price.code}.${price.flag & 64}`);
			const year: any[] = map.get(`${price.code}.${price.flag & 128}`);
			if (!week) {
				map.set(`${price.code}.${price.flag & 32}`, [price]);
			} else {
				week.push(price);
			}
			if (!month) {
				map.set(`${price.code}.${price.flag & 64}`, [price]);
			} else {
				month.push(price);
			}
			if (!year) {
				map.set(`${price.code}.${price.flag & 128}`, [price]);
			} else {
				year.push(price);
			}
		});
		return map;
	}
	compare(left: Price, right: Price) {
		return moment(left.base).diff(moment(right.base));
	}

}
export default new PriceStore();
