import axios from "axios";

// PriceRepository.ts
class PriceRepository {
	constructor() {
	}

	async search(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/price/search", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawl(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/price/crawl`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async compile(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/price/compile`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async purge(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/price/purge", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async deduplicate(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/price/deduplicate", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async download(filename: string, onSuccess?: any, onError?: any, element?: any) {
		return axios({
			url: "./api/price/download",
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
	async downloadNoStreaming(filename: string, onSuccess?: any, onError?: any, element?: any) {
		return axios({
			url: "./api/price/download-no-streaming",
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
		return axios.post(`./api/price/upload`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}

}
export default new PriceRepository();
