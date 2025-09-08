import { makeAutoObservable } from "mobx";

import repository from "../repository/ItemRepository";

// ItemStore.ts
class ItemStore {
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
	download(filename: string, onSuccess?: any, onError?: any, element?: any) {
		repository.download(filename, onSuccess, onError, element);
	}
	upload(file?: any, onSuccess?: any, onError?: any, element?: any) {
		const request = new FormData();
		request.append("file", file);
		repository.upload(request, onSuccess, onError, element);
	}

}
export default new ItemStore();
