import axios from "axios";
import Item from "../model/Item";

// StockRepository.ts
class StockRepository {
	constructor() {
	}

	async batch(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/batch", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async create(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/stock", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async update(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.put("./api/" + request.id, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async remove(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.delete(`./api/${request.id}`)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async upload(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/upload`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async download(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios({
			url: "./api/download",
			method: "GET",
			responseType: "blob",
		}).then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", request.filename);
			document.body.appendChild(link);
			link.click();
			link.parentNode!.removeChild(link);
			onSuccess && onSuccess(request, response.data, element);
		})
			.catch(error => onError && onError(request, error, element));
	}
	async deduplicate(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/deduplicate`)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async parse(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/parse", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async parseFile(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/parse-file", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async backup(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/backup", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async compileGet(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/compile", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async compilePost(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./api/compile", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawl(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/crawl", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}

	// stock item section
	async searchItem(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`./api/item/search?page=${request!.page}&size=${request!.size}`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async updateItem(request: Item, onSuccess?: any, onError?: any, element?: any) {
		return axios.put(`./api/item/${request.id}`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}


}
export default new StockRepository();
