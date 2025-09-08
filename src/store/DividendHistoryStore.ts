import { makeAutoObservable } from "mobx";

import repository from "../repository/DividendHistoryRepository";
import DividendHistory from "../model/DividendHistory";
import moment from "moment";

// DividendHistoryStore.ts
class DividendHistoryStore {
	constructor() {
		makeAutoObservable(this);
	}

	search(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.search(request, onSuccess, onError, element);
	}
	crawl(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawl(request, onSuccess, onError, element);
	}
	download(filename: string, onSuccess?: any, onError?: any, element?: any) {
		repository.download(filename, onSuccess, onError, element);
	}
	upload(file?: any, onSuccess?: any, onError?: any, element?: any) {
		const request = new FormData();
		request.append("file", file);
		repository.upload(request, onSuccess, onError, element);
	}

	makeMap(histories: DividendHistory[]) {
		const map = new Map();
		histories.forEach((history: DividendHistory) => {
			const prev: any[] = map.get(history.code);
			if (!prev) {
				map.set(history.code, [history]);
				return;
			}

			prev.push(history);
		});
		return map;
	}
	makeMapByYearMonth(histories: DividendHistory[]) {
		const map = new Map();
		histories!.forEach((history: DividendHistory) => {
			const mdate = moment(history.base);
			const year = mdate.year();

			map.set(mdate.format("YYYY-MM"), history);

			const previousDividend = map.get(year);
			if (previousDividend) {
				map.set(year, previousDividend + history.dividend);
			} else {
				map.set(year, history.dividend);
			}

			if (history.dividend && history.priceClosing) {
				const previousPriceEarningsRatio = map.get(year + 0.1);
				const priceEarningsRatio = history.dividend / history.priceClosing * 100;
				if (previousPriceEarningsRatio) {
					map.set(year + 0.1, previousPriceEarningsRatio + priceEarningsRatio);
				} else {
					map.set(year + 0.1, priceEarningsRatio);
				}
			}
		});
		return map;
	}
	compare(left: DividendHistory, right: DividendHistory) {
		return moment(left.base).diff(moment(right.base));
	}

}
export default new DividendHistoryStore();
