import { makeAutoObservable } from "mobx";

import repository from "../repository/CrawlRepository";

// CrawlStore.ts
class CrawlStore {
	constructor() {
		makeAutoObservable(this);
	}

	crawlItem(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlItem(request, onSuccess, onError, element);
	}
	crawlPriceAll(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlPriceAll(request, onSuccess, onError, element);
	}
	crawlItemAll(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlItemAll(request, onSuccess, onError, element);
	}
	crawlDividendAllRecent(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlDividendAllRecent(request, onSuccess, onError, element);
	}
	crawlItemIpoCloseAll(request?: any, onSuccess?: any, onError?: any, element?: any) {
		console.warn("deprecated");
		repository.crawlItemIpoCloseAll(request, onSuccess, onError, element);
	}
	crawlItemIpoCloseRecent(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlItemIpoCloseRecent(request, onSuccess, onError, element);
	}
	test(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.test(request, onSuccess, onError, element);
	}


}
export default new CrawlStore();
