import axios from "axios";

// CrawlRepository.ts
class CrawlRepository {
	constructor() {
	}

	async crawlItem(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/crawl/item", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlPriceAll(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/crawl/price/all", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlItemAll(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/crawl/item/all", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlDividendAllRecent(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/crawl/dividend/all/recent", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlItemIpoCloseAll(request: any, onSuccess?: any, onError?: any, element?: any) {
		console.warn("deprecated");
		return axios.get("./api/crawl/item/ipo-close/all", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlItemIpoCloseRecent(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/crawl/item/ipo-close/recent", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async test(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/crawl/test", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}

}
export default new CrawlRepository();
