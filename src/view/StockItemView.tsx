import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

// domain
import { StockForm } from "../model/StockModel";

// store
import store from "../store/StockStore";
import priceStore from "../store/PriceStore";
import dividendHistoryStore from "../store/DividendHistoryStore";
import DividendHistory from "../model/DividendHistory";
import Price from "../model/Price";
import Item from "../model/Item";

//	StockItemView.tsx
export default ((props: any) => {
	const form = props.form as StockForm;
	const { onChange } = props;

	const gridRef = useRef<AgGridReact>(null);
	const [rowData, setRowData] = useState<Item[]>([]);
	const [columnDefs, setColumnDefs] = useState([]);

	useEffect(() => {
		const comlumDefs = store.columnDefs(["id", "symbol", "code", "etf", "type", "volumeOfListedShares", "baseMonth", "dividendCycle", "sigma", "created",], onChange);
		setColumnDefs(comlumDefs);
	}, []);
	useEffect(() => {
		setRowData([]);
		const request = {
			priority: form.priority,	//	우선순위
			keyword: form.keyword,
			start: null,
			end: null,
			size: form.size,
			page: form.page,
		};
		store.searchItem(request, (_: any, result: any) => {
			const items = result && result.items;
			if (!items) {
				return;
			}

			if (form.totalPages !== result.totalPages && result.totalPages > 0) {
				onChange && onChange({...form, totalPages: result.totalPages });
			}

			const codes = items.map((x: any) => x.code);
			priceStore.search({
					codes: codes,
					start: moment().subtract(28, "days").format("YYYY-MM-DD"),
				}, (_: any, prices: Price[]) => {
				processItemPrice(items, prices);
				dividendHistoryStore.search({
					start: moment().subtract(10, "years").startOf("year").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
					codes: codes,
				}, (_: any, histories: DividendHistory[]) => {
					processItemDividendHistory(items, histories);

					priceStore.search({
							codes: codes,
							flag: 1,
					}, (_: any, flagedPrices: Price[]) => {
						processItemFlagedPrices(items, flagedPrices);

						setRowData(items);
					});
				});
			});
		});
		return function() { setRowData([]); };
	}, [form]);

	function processItemFlagedPrices(items: Item[], prices: Price[]) {
		const map = priceStore.makeMapByFlag(prices);
		items.forEach((item: Item) => {
			item.custom = {
				...item.custom,
				weekPrices: map.get(`${item.code}.32`),
				monthPrices: map.get(`${item.code}.64`),
				yearPrices: map.get(`${item.code}.128`),
			};
		});
	}
	function processItemPrice(items: Item[], prices: Price[]) {
		const map = priceStore.makeMap(prices);
		items.forEach((item: Item) => {
			const itemPrices = map.get(item.code);
			const sorted = (itemPrices && itemPrices.length) ? itemPrices.sort(priceStore.compare) : [];
			const currentPrice = (sorted!.length > 0) ? sorted[sorted.length - 1].closing : 10000;
			let max = Number.MIN_SAFE_INTEGER;
			let min = Number.MAX_SAFE_INTEGER;
			sorted.forEach((price: Price) => {
				max = Math.max(max, price.closing);
				min = Math.min(min, price.closing);
			});
			item.custom = {
				...item.custom,
				prices: sorted,
				currentPrice: currentPrice,
				minPrice: min,
				maxPrice: max,
			};
		});
	}
	function processItemDividendHistory(items: Item[], histories: DividendHistory[]) {
		const map = dividendHistoryStore.makeMap(histories.filter((history: DividendHistory) => history.dividend > 0));
		items.forEach((item: Item) => {
			if (!item) {
				console.log("null or undefined - item");
				return;
			}

			const dividends = map.get(item.code) || [];
			if (!dividends) {
				console.log("null or undefined - dividends");
				return;
			}
			
			const sorted = dividends.sort(dividendHistoryStore.compare);
			const mapHistory = dividendHistoryStore.makeMapByYearMonth(sorted);
			item.custom = {
				...item.custom,
				histories: sorted,
				mapHistory: mapHistory,
			};
		});
	}
	function handleOnGridReady() {
		if (!gridRef.current) {
			return;
		}
		gridRef.current!.api.applyColumnState({
			state: [{ colId: 'priceEarningsRatio', sort: 'desc' }],
			defaultState: { sort: null },
		});
		gridRef.current!.api.setGridOption("domLayout", "autoHeight");
		gridRef.current!.api.sizeColumnsToFit();
	}

	return (<>
		<AgGridReact
			className="ag-theme-balham-dark"
			ref={gridRef}
			rowData={rowData}
			columnDefs={columnDefs}
			defaultColDef={{
				editable: true,
				sortable: true,
				resizable: true,
				suppressHeaderMenuButton: true,
			}}
			rowHeight={form.rowHeight}
			rowDragManaged={true}
			onGridReady={handleOnGridReady}
		/>
	</>);
});
