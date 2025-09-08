import { makeAutoObservable } from "mobx";
import moment from "moment";

import repository from "../repository/StockRepository";
import { PriceEarningsRatioCellRenderer, PriorityCellRenderer, OperateColumn, SymbolTypeCode as SymbolEtfTypeCode, PriceRecentCellRenderer } from "../view/AgGridCellRenderer";
import Item from "../model/Item";

const CELL_STYLE_LEFT = { textAlign: "left", padding: 1, };
const CELL_STYLE_RIGHT = { textAlign: "right", padding: 1, paddingRight: 4, };
const CELL_STYLE_CENTER = { textAlign: "center", padding: 1, };
const CELL_STYLE_CENTER_CANCEL = { ...CELL_STYLE_CENTER, textDecoration: "line-through",};
// StockStore.ts
class StockStore {
	constructor() {
		makeAutoObservable(this);
	}

	batch(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.batch(request, onSuccess, onError, element);
	}
	create(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.create(request, onSuccess, onError, element);
	}
	update(request: any[], onSuccess?: any, onError?: any, element?: any) {
		repository.update(request, onSuccess, onError, element);
	}
	remove(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.remove(request, onSuccess, onError, element);
	}
	upload(file?: any, onSuccess?: any, onError?: any, element?: any) {
		const request = new FormData();
		request.append("file", file);
		repository.upload(request, onSuccess, onError, element);
	}
	download(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.download(request, onSuccess, onError, element);
	}
	deduplicate(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.deduplicate(request, onSuccess, onError, element);
	}
	parse(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.parse(request, onSuccess, onError, element);
	}
	parseFile(file: any, onSuccess?: any, onError?: any, element?: any) {
		const request = new FormData();
		request.append("file", file);
		repository.parseFile(request, onSuccess, onError, element);
	}
	backup(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.backup(request, onSuccess, onError, element);
	}
	compile(request?: any, onSuccess?: any, onError?: any, element?: any) {
		if (request) {
			repository.compilePost(request, onSuccess, onError, element);
		} else {
			repository.compileGet(request, onSuccess, onError, element);
		}
	}
	// 

	//	stock item section
	searchItem(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.searchItem(request, onSuccess, onError, element);
	}
	updateItem(request: Item, onSuccess?: any, onError?: any, element?: any) {
		repository.updateItem(request, onSuccess, onError, element);
	}


	//	stock dividend section

	//	stock dividend history section

	//	utils
	range(size: number): number[] {
		const result: number[] = [];
		for (let cx = 0; cx < size; cx++) {
			result.push(cx);
		}
		return result;
	}
	formatDateReadable(dateString: any): string {
		const date = moment(dateString);
		const now = moment();
		const duration = moment.duration(now.diff(date));
		if (duration.asMonths() > 24) {
			return `${duration.years().toFixed(0)} Y`;
		}
		if (duration.asWeeks() > 10) {
			return `${duration.asMonths().toFixed(0)} M`;
		}
		if (duration.asDays() > 21) {
			return `${duration.asWeeks().toFixed(0)} W`;
		}
		if (duration.asHours() > 72) {
			return `${duration.asDays().toFixed(0)} D`;
		}
		if (duration.asMinutes() > 180) {
			return `${duration.asHours().toFixed(0)} H`;
		}
		if (duration.asSeconds() > 180) {
			return `${duration.asMinutes().toFixed(0)} m`;
		}
		return `${duration.asSeconds().toFixed(0)} s`;
	}
	sleep(ms: number): any {
		return new Promise(r => setTimeout(r, ms));
	}
	pushIfNotNaNAndGreaterOrEqualsZero(array: number[], value: any) {
		if (!isNaN(value) && value >= 0) {
			array.push(value);
		}
	}
	isInDay(day: moment.Moment, start: moment.Moment, end: moment.Moment): boolean {
		const startx = day.clone().startOf("day");
		const endx = day.clone().add(1, "days").startOf("day");
		return start.isBefore(endx) && end.isAfter(startx);
	}
	isInDayEvent(day: moment.Moment, event: any): boolean {
		for (let period of event!.periods) {
			const start = moment(period.start);
			const end = moment(period.end);
			if (this.isInDay(day, start, end)) {
				return true;
			}
		}

		return false;
	}
	priceEarningsRatio(dividend: any, histories: any[]): number {
		if (dividend!.currentPrice > 0) {
			if (dividend!.dividend > 0) {
				return Math.round(dividend!.dividend / dividend!.currentPrice * 10000) / 100;
			}
			
			const lastYear = moment().year() - 1;
			let sum = 0;
			histories!.forEach((history: any) => {
				const date = moment(history.base);
				if (date.year() == lastYear) {
					sum += history.dividend;
				}
			});

			return Math.round(sum / dividend!.currentPrice * 10000) / 100;
		} else if (dividend!.priceEarningsRatio > 0) {
			return dividend!.priceEarningsRatio;
		}

		return 0;
	}
	colorPriceEarningsRatio(value: number) {
		if (value > 10) { return `rgb(255, 255, ${32 * 0})`; }
		if (value > 9) { return `rgb(255, 255, ${32 * 3})`; }
		if (value > 8) { return `rgb(255, 255, ${32 * 4})`; }
		if (value > 7) { return `rgb(255, 255, ${32 * 5})`; }
		if (value > 6) { return `rgb(255, 255, ${32 * 6})`; }
		if (value > 5) { return `rgb(255, 255, ${32 * 7})`; }
		return `rgb(255, 255, 255)`;
	}
	colorSigma(value: number) {
		if (Math.abs(value) < 0.1) { return `rgb(${128 + 16 * 0}, ${128 + 16 * 0}, 255)`; }
		if (Math.abs(value) < 0.2) { return `rgb(${128 + 16 * 1}, ${128 + 16 * 1}, 255)`; }
		if (Math.abs(value) < 0.3) { return `rgb(${128 + 16 * 2}, ${128 + 16 * 2}, 255)`; }
		if (Math.abs(value) < 0.4) { return `rgb(${128 + 16 * 3}, ${128 + 16 * 3}, 255)`; }
		if (Math.abs(value) < 0.5) { return `rgb(${128 + 16 * 4}, ${128 + 16 * 4}, 255)`; }
		if (Math.abs(value) < 0.6) { return `rgb(${128 + 16 * 5}, ${128 + 16 * 5}, 255)`; }
		if (Math.abs(value) < 0.7) { return `rgb(${128 + 16 * 6}, ${128 + 16 * 6}, 255)`; }
		if (Math.abs(value) < 0.8) { return `rgb(${128 + 16 * 7}, ${128 + 16 * 7}, 255)`; }
		return `rgb(255, 255, 255)`;
	}

	// stock item section
	columnDefs(hides?: string[], onChange?: any): any {
		return [{
			field: "id",
			hide: hides && hides.includes("id"),
			editable: false,
			rowDrag: true,
			cellStyle: CELL_STYLE_RIGHT,
			width: 16,
		}, {
			field: "symbolEtfTypeCode",
			headerName: "종목",
			hide: hides && hides.includes("symbolEtfTypeCode"),
			valueGetter: (params: any) => `${params.data.symbol == null ? "" : params.data.symbol} ${params.data.type} ${params.data.code}`,
			cellRenderer: SymbolEtfTypeCode,
			cellStyle: CELL_STYLE_LEFT,
			width: 96,
			flex: 5,
		}, {
			field: "symbol",
			headerName: "종목이름",
			hide: hides && hides.includes("symbol"),
			valueFormatter: (params: any) => `${params.value} ${params.data.code}`,
			cellStyle: CELL_STYLE_LEFT,
			width: 96,
		}, {
			field: "code",
			headerName: "종목코드",
			hide: hides && hides.includes("code"),
			cellStyle: CELL_STYLE_LEFT,
			width: 32,
		}, {
			field: "priority",
			headerName: "우선순위",
			hide: hides && hides.includes("priority"),
			cellRenderer: PriorityCellRenderer,
			cellStyle: CELL_STYLE_RIGHT,
			width: 8,
			flex: 1,
		}, {
			field: "priceEarningsRatio",
			headerName: "최근 배당수익률(%)",
			hide: hides && hides.includes("priceEarningsRatio"),
			comparator: (valueA: number, valueB: number, nodeA: any, nodeB: any, isDescending: boolean) => {
				const p = nodeA.data.priority - nodeB.data.priority;
				if (p != 0) {
					return p * (isDescending ? -1 : 1);
				}
                return (valueA - valueB);
            },
			cellRenderer: PriceEarningsRatioCellRenderer,
			cellStyle: (params: any) => ({
				...CELL_STYLE_RIGHT,
				color: this.colorPriceEarningsRatio(params.value),
			}),
			width: 64,
			flex: 4,
		}, {
			field: "currentPrice",
			headerName: "현재가",
			hide: hides && hides.includes("currentPrice"),
			valueGetter: (params: any) => params.data.custom.dividend
												&& params.data.custom.dividend.currentPrice
												&& params.data.custom.dividend.currentPrice.toLocaleString(),
			cellRenderer: PriceRecentCellRenderer,
			cellStyle: CELL_STYLE_RIGHT,
			width: 64,
			flex: 4,
		}, {
			field: "volumeOfListedShares",
			headerName: "상장주식수",
			hide: hides && hides.includes("volumeOfListedShares"),
			valueFormatter: (params: any) => params.value!.toLocaleString(),
			cellStyle: CELL_STYLE_RIGHT,
			width: 32,
		}, {
			field: "category",
			headerName: "분류",
			hide: hides && hides.includes("category"),
			cellStyle: CELL_STYLE_LEFT,
			width: 64,
			flex: 2,
		}, {
			field: "ipoOpen",
			headerName: "상장",
			hide: hides && hides.includes("ipoOpen"),
			editable: false,
			valueFormatter: (params: any) => params.value && moment(params.data.ipoClose || params.value).format("YYYY-MM"),
			cellStyle: (params: any) => params.data.ipoClose ? CELL_STYLE_CENTER_CANCEL : CELL_STYLE_CENTER,
			width: 32,
			flex: 1,
		}, {
			field: "created",
			hide: hides && hides.includes("created"),
			editable: false,
			valueFormatter: (params: any) => this.formatDateReadable(params.value),
			cellStyle: CELL_STYLE_RIGHT,
			width: 16,
		}, {
			field: "updated",
			hide: hides && hides.includes("updated"),
			editable: false,
			valueFormatter: (params: any) => this.formatDateReadable(params.value),
			cellStyle: CELL_STYLE_RIGHT,
			width: 16,
		}, {
			field: "operate",
			hide: hides && hides.includes("operate"),
			headerName: "▦",
			cellRenderer: OperateColumn,
			cellRendererParams: {
				onChange: onChange,
			},
			cellStyle: CELL_STYLE_LEFT,
			width: 48,
			flex: 2,
		}];
	}

	// stock dividend history section
	makeMapDividendHistory(histories: any[]) {
		const map = new Map();
		histories.forEach((history: any) => {
			const prev = map.get(history.code);
			if (prev) {
				map.set(history.code, [
					...prev,
					history,
				]);
			} else {
				map.set(history.code, [history]);
			}
		});
		return map;
	}
}
export default new StockStore();
