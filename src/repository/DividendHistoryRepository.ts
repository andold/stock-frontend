import axios from "axios";

// DividendHistoryRepository.ts
class DividendHistoryRepository {
	constructor() {
	}

	async search(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/dividend/history/search", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawl(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/dividend/history/crawl`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async download(filename: string, onSuccess?: any, onError?: any, element?: any) {
		return axios({
			url: "./api/dividend/history/download",
			method: "GET",
			responseType: "blob",
		}).then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.parentNode!.removeChild(link);
			onSuccess && onSuccess(filename, response.data, element);
		})
			.catch(error => onError && onError(filename, error, element));
	}
	async upload(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/dividend/history/upload`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}

}
export default new DividendHistoryRepository();
