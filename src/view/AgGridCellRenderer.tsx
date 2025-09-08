import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, CloseButton, Col, Overlay, OverlayTrigger, Popover, Row, Spinner, Stack, Table, Tooltip } from "react-bootstrap";

// model
import Price from "../model/Price";
import DividendHistory from "../model/DividendHistory";
import Item from "../model/Item";

// store
import store from "../store/StockStore";
import priceStore from "../store/PriceStore";
import crawlStore from "../store/CrawlStore";

const FILL_COLOR_PRIORITY = [
	`rgb(128, 0, 0)`,
	`rgb(128, 32, 32)`,
	`rgb(128, 64, 64)`,
	`rgb(128, 96, 96)`,

	`rgb(128, 128, 0)`,
	`rgb(128, 128, 32)`,
	`rgb(128, 128, 64)`,
	`rgb(128, 128, 96)`,

	`rgb(0, 0, 128)`,
	`rgb(32, 32, 128)`,
	`rgb(64, 64, 128)`,
	`rgb(96, 96, 128)`,

	`rgb(128, 128, 0)`,
	`rgb(128, 128, 64)`,
	`rgb(128, 128, 128)`,
	`rgb(128, 128, 192)`,

	`rgb(0, 0, 0)`,
];
const FILL_COLOR_MONTH = [
	`rgb(64, 64, 64)`,
	`rgb(96, 96, 96)`,
	`rgb(128, 128, 128)`,

	`rgb(0, 128, 0)`,
	`rgb(0, 96, 0)`,
	`rgb(0, 64, 0)`,

	`rgb(128, 96, 0)`,
	`rgb(96, 64, 0)`,
	`rgb(64, 32, 0)`,

	`rgb(128, 0, 0)`,
	`rgb(96, 0, 0)`,
	`rgb(64, 0, 0)`,

	`rgb(0, 0, 0)`,
];

// AgGridCellRenderer.tsx

// 주가
export function PriceRecentCellRenderer(param: any) {
	const COUNT = 14;
	const prices: Price[] = param && param.data && param.data.custom && param.data.custom.prices;
	if (!prices || prices.length === 0) {
		return (<>No Data</>);
	}

	const info = {
		min: param.data!.custom!.minPrice + 1,
		max: param.data!.custom!.maxPrice,
	};

	const ref = useRef(null);
	useEffect(() => {
		const weekPrices = param && param.data && param.data.custom && param.data.custom.weekPrices;
		if (weekPrices) {
			return;
		}

		console.log(param.data.custom);
		priceStore.search({
				codes: [param.data.code],
				flag: 1,
		}, (_: any, flagedPrices: Price[]) => {
			const map = priceStore.makeMapByFlag(flagedPrices);
			param.data.custom = {
				...param.data.custom,
				weekPrices: map.get(`${param.data.code}.32`),
				monthPrices: map.get(`${param.data.code}.64`),
				yearPrices: map.get(`${param.data.code}.128`),
			};
		}, (param1: any, param2: any) => {
			console.error(param1, param2);
		}, (param1: any, param2: any) => {
			console.error(param1, param2);
		});
		
	}, []);

	const lineHeight = (param!.node!.rowHeight || 32) - 4;

	function isSame(left: string, right: string, unit?: string): boolean {
		if (left === right) {
			return true;
		}
		
		if (!left || !right || !unit) {
			return false;
		}

		switch (unit) {
			case "":
			case "week":
				return moment(left).day(0).startOf("day").isSame(moment(right).day(0).startOf("day"));
			case "month":
				return moment(left).startOf("month").isSame(moment(right).startOf("month"));
			case "year":
				return (moment(left).year() == moment(right).year());
			case "true":
				return true;
			case "false":
				return false;
			default:
				break;
		}

		return false;
	}
	//	툴팁
	function chart(minmax: any, prices: Price[], maxheight: number, format?: string, divider?: string) {
		if (!minmax || !prices || !prices.length || !maxheight) {
			return (<>No Data</>);
		}

		let previous = prices[0].base;
		return (<>
			<Row className="m-0 p-0"> {
				prices.map((price: Price) => {
					let className = isSame(previous, price.base, divider) ? "px-0 bg-primary" : "px-0 bg-primary border-start";
					previous = price.base;
					return (
						<Col key={price.id} className={className}
							title={moment(price.base).format("YYYY-MM-DD (dd)")}
							style={{
								marginRight: 1,
								height: height(maxheight, price, minmax) + 16,
								marginTop: maxheight - height(maxheight, price, minmax),
								fontSize: 8,
							}}
						>
							<Row className="m-0 p-0 text-center"><Col className="m-0 p-0 text-center">{moment(price.base).format(format || "YYYY-MM-DD")}</Col></Row>
							<Row className="m-0 p-0 text-center"><Col className="m-0 p-0 text-center">{price.closing.toLocaleString()}</Col></Row>
						</Col>
					);
				})
			}</Row>
		</>);
	}
	function getSubListLast(list: any[], count: number): any[] {
		if (!list || !list.length) {
			return [];
		}
		if (list.length < count) {
			return list;
		}

		return list.slice(list.length - count, list.length);
	}
	function renderTooltip(props: any) {
		const custom = param && param.data && param.data.custom;

		const yearPrices: Price[] = getSubListLast(custom?.yearPrices, COUNT);
		const monthPrices: Price[] = getSubListLast(custom?.monthPrices, COUNT);
		const weekPrices: Price[] = getSubListLast(custom?.weekPrices, COUNT);
		const minmax = {
			min: Number.MAX_SAFE_INTEGER,
			max: Number.MIN_SAFE_INTEGER,
		};
		yearPrices.forEach((price: Price) => {
			minmax.min = Math.min(minmax.min, price.closing);
			minmax.max = Math.max(minmax.max, price.closing);
		});
		monthPrices.forEach((price: Price) => {
			minmax.min = Math.min(minmax.min, price.closing);
			minmax.max = Math.max(minmax.max, price.closing);
		});
		weekPrices.forEach((price: Price) => {
			minmax.min = Math.min(minmax.min, price.closing);
			minmax.max = Math.max(minmax.max, price.closing);
		});
		return (
			<Tooltip className="mytooltip" {...props}>
				<h5 className="pt-1">일단위</h5>
				{chart(info, prices, 64, "MM-DD", "week")}
				<h5 className="pt-4">주단위</h5>
				{chart(minmax, weekPrices, 64, "MM-DD", "month")}
				<h5 className="pt-4">월단위</h5>
				{chart(minmax, monthPrices, 64, "YYYY-MM", "year")}
				<h5 className="pt-4">연단위</h5>
				{chart(minmax, yearPrices, 64, "YYYY", "true")}
			</Tooltip>
		);
	}
	function height(maxHeight: number, price: Price, info: any): number {
		if (isNaN(price!.closing) || isNaN(info!.min) || isNaN(info!.max) || isNaN(maxHeight)
			|| (info.max == info.min) || (maxHeight == 0)) {
			return 1;
		}

		return Math.max(4, Math.floor((price.closing - info.min) / (info.max - info.min) * maxHeight));
	}
	function currentPrice(): string {
		if (param && param.value > 0) {
			return param!.value;
		}

		if (!prices || prices.length == 0) {
			return "-";
		}

		const price = prices[prices.length - 1];
		if (price && price.closing) {
			return price.closing.toLocaleString();
		}
		
		return "";
	}

	let previous = prices[0] && prices[0].base || "";
	return (<>
		<OverlayTrigger overlay={renderTooltip} trigger={["hover", "hover"]} placement="auto">
			<Row className="mx-0 text-right h-100">
				<Col sm="5" md="4" xl="3" xxl="3" className="m-0 p-0 text-right">{currentPrice()}</Col>
				<Col ref={ref} className="ms-2 p-0">
					<Row className="m-0 p-0"> {
						prices && prices.map((price: Price) => {
							let className = isSame(previous, price.base, "week") ? "px-0 bg-primary" : "px-0 bg-primary border-start";
							previous = price.base;
							return (
								<Col key={price.id} className={className}
									style={{
										marginRight: 1,
										height: height(param!.node!.rowHeight, price, info),
										marginTop: lineHeight - height(param!.node!.rowHeight, price, info),
									}}
								></Col>
							);
						})
					}</Row>
				</Col>
			</Row>
		</OverlayTrigger>
	</>);
}

// 종목이름 타입 코드
export function SymbolTypeCode(param: any) {
	const data: Item = param.data;

	function typeToVariant(type?: string): string {
		if (!type) {
			return "warning";
		}
		switch (type) {
			case "ETF":
				return "outline-primary";
			case "KOSPI":
				return "outline-success";
			case "KOSDAQ":
				return "outline-info";
			case "KONEX":
				return "outline-light";
		}
		return "outline-warning";
	}

	return (<>
		<Row className="mx-0 px-0">
			<Col className={`ms-1 px-0 text-start text-truncate${data.ipoClose ? " text-decoration-line-through text-warning" : ""}`}>{data.symbol}</Col>
			<Col xs="auto" className="ms-1 px-0 text-end">
				<Button variant={typeToVariant(data.type)} className="py-0 px-1" style={{ fontSize: 8 }}>{data.type}</Button>
				<span className="ms-1 text-secondary" style={{ fontSize: 8 }}>{data.code}</span>
			</Col>
		</Row>
	</>);
}

// 우선순위 = 선호도
export function PriorityCellRenderer(param: any) {
	const { value, data, api, node } = param;
	const width = 16 - (value % 4) * 2;

	useEffect(() => {
	}, []);

	async function handleOnClickLike() {
		store.updateItem({
			id: data.id,
			priority: data.priority - 1,
		}, () => {
			data.priority = data.priority - 1;
			api.redrawRows({ rowNodes: [node] });
		});
	}
	async function handleOnClickDisike() {
		store.updateItem({
			id: data.id,
			priority: data.priority + 1,
		}, () => {
			data.priority = data.priority + 1;
			api.redrawRows({ rowNodes: [node] });
		});
	}

	return (<>
		<Row title={value}>
			<Col className="m-0 p-0">
				<svg className="mb-2 mx-1" width={width} height={width} viewBox="0 -1 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff0000">
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
					<g id="SVGRepo_iconCarrier">
						<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
							<g id="Icon-Set-Filled" transform="translate(-102.000000, -882.000000)" fill={FILL_COLOR_PRIORITY[value]}>
								<path d="M126,882 C122.667,882 119.982,883.842 117.969,886.235 C116.013,883.76 113.333,882 110,882 C105.306,882 102,886.036 102,890.438 C102,892.799 102.967,894.499 104.026,896.097 L116.459,911.003 C117.854,912.312 118.118,912.312 119.513,911.003 L131.974,896.097 C133.22,894.499 134,892.799 134,890.438 C134,886.036 130.694,882 126,882" id="heart-like" />
							</g>
						</g>
					</g>
				</svg>
			</Col>
			<Col xs="4" className="mx-1 my-0 p-0">
				<Row className="mx-0 p-0" style={{ lineHeight: 1, marginTop: -2 }} onClick={handleOnClickLike}>⇧</Row>
				<Row className="mx-0 p-0" style={{ lineHeight: 1, marginTop: 1 }} onClick={handleOnClickDisike}>⇩</Row>
			</Col>
		</Row>
	</>);
}

// 최근 배당수익률
export function PriceEarningsRatioCellRenderer(param: any) {
	const [show, setShow] = useState(false);
	const [height, setHeight] = useState(param!.node!.rowHeight);
	const target = useRef(null);

	const mapHistory = param!.data!.custom!.mapHistory;
	const lineHeight = param!.node!.rowHeight - 4;
	if (!mapHistory || !lineHeight) {
		return (<></>);
	}

	const years = Math.min(11, moment().year() - moment(param!.data!.ipoOpen).year() + 1);

	return (<>
		<Row ref={target} className="mx-0 text-right" onClick={() => setShow(!show)}>
			<Col sm="4" md="3" xl="2" xxl="2" className="m-0 p-0">
				<span>{param.value == null ? "-" : param.value.toFixed(2)}</span>
			</Col>
			<Col>{dividendBarGraphAmount(mapHistory, moment(param!.data!.ipoOpen), lineHeight)}</Col>
		</Row>
		<Overlay target={target.current} show={show} placement="auto">
			<Popover className="border bg-black" style={{ maxWidth: 1024, }} onClick={() => setShow(!show)}>
				<Popover.Header><Stack direction="horizontal">
					<h6 className="flex-grow-1 mb-0">{param!.data!.symbol}</h6>
					<CloseButton onClick={() => setShow(!show)} />
				</Stack></Popover.Header>
				<Popover.Body><table className="text-white" style={{ fontSize: 10 }}><tbody>
					<tr className="py-0 text-start"><th colSpan={2}>배당 금액 (원)</th></tr>
					<tr className="mb-4 py-0">
						<td>{DividendTableAmount(mapHistory, moment(param!.data!.ipoOpen), setHeight)}</td>
						<td className="m-0 p-0 align-top" style={{ width: 8 * years, }}>{dividendBarGraphAmount(mapHistory, moment(param!.data!.ipoOpen), height)}</td>
					</tr>

					<tr><th className="pt-2 text-start" colSpan={2}>배당수익율 (%, 현재가 기준 {param!.data!.custom!.currentPrice!.toLocaleString()})</th></tr>
					<tr className="mb-4">
						<td>{dividendTableRatioByCurrentPrice(mapHistory, moment(param!.data!.ipoOpen), param!.data!.custom!.currentPrice)}</td>
						<td className="m-0 p-0 align-top">{dividendBarGraphRatioByCurrentPrice(mapHistory, moment(param!.data!.ipoOpen), param!.data!.custom!.currentPrice, height)}</td>
					</tr>

					<tr><th className="pt-2 text-start" colSpan={2}>배당수익율 (%, 당시 주가 기준)</th></tr>
					<tr className="mb-4">
						<td>{dividendTableRatioByClosingPrice(mapHistory, moment(param!.data!.ipoOpen))}</td>
						<td className="m-0 p-0 align-top">{dividendBarGraphRatioByClosingPrice(mapHistory, moment(param!.data!.ipoOpen), param!.data!.custom!.currentPrice, height)}</td>
					</tr>
				</tbody></table></Popover.Body>
			</Popover >
		</Overlay>
	</>);
};

// 배당 금액
function DividendTableAmount(mapHistory: any, start: any, setHeight?: any) {
	if (!mapHistory || !start) {
		return (<></>);
	}

	const end = moment().add(1, "year").startOf("year");
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}

	return (
		<Table ref={el => { setHeight && el && el.clientHeight && setHeight(el.clientHeight); }} bordered striped size="sm" variant="dark" className="my-0 py-0" style={{ fontSize: 10 }}>
			<thead><tr className="my-0 py-0">
				<th>연도</th>
				{
					store.range(12).map((cy: number) => (
						<th key={cy} className="text-end px-1">{cy + 1}</th>
					))
				}
				<th className="text-end px-1">합계</th>
			</tr></thead><tbody>
				{
					store.range(end.year() - start.year()).map((cx: number) => (<tr key={cx} className="my-0 py-0">
						<th className="px-1 py-0">{start.year() + cx}</th>
						{
							store.range(12).map((cy: number) => {
								const history = mapHistory.get(moment([start.year() + cx, cy]).format("YYYY-MM"));
								if (history && history.dividend > 0) {
									return (
										<td key={cy} className="text-end px-1 py-0">{history!.dividend!.toLocaleString()}</td>
									);
								}
								return (<td key={cy}></td>);
							})
						}
						<th className="text-end px-1 py-0">{mapHistory.get(start.year() + cx) && mapHistory.get(start.year() + cx).toLocaleString()}</th>
					</tr>))
				}
			</tbody></Table>
	);
}

// 배당수익율 (%, 당시 주가 기준)
function dividendTableRatioByClosingPrice(mapHistory: any, start: any) {
	const end = moment().add(1, "year").startOf("year");
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}
	return (
		<Table bordered striped size="sm" variant="dark" className="my-0 py-0" style={{ fontSize: 10 }}>
			<thead><tr>
				<th>연도</th>{
					store.range(12).map((cy: number) => (
						<th key={cy} className="text-end px-1">{cy + 1}</th>
					))
				}
				<th className="text-end px-1">합계</th>
			</tr></thead><tbody>{
				store.range(end.year() - start.year()).map((cx: number) => (
					<tr key={Math.random()}>
						<th className="px-1 py-0">{start.year() + cx}</th>{
							store.range(12).map((cy: number) => {
								const key = moment([start.year() + cx, cy]).format("YYYY-MM");
								const history: DividendHistory = mapHistory.get(key);
								if (!history || !history.dividend || !history.priceClosing) {
									return (<td key={Math.random()}></td>);
								}

								return (
									<td key={cy} className="text-end px-1 py-0">
										{history && (history.dividend / history.priceClosing * 100).toFixed(2)}
									</td>
								);
							})
						}<th className="text-end px-1 py-0">{mapHistory.get(start.year() + cx + 0.1) && mapHistory.get(start.year() + cx + 0.1).toFixed(2)}</th>
					</tr>
				))
			}</tbody></Table>
	);
}

// 배당수익율 (%, 현재가 기준
function dividendTableRatioByCurrentPrice(mapHistory: any, start: any, currentPrice?: number) {
	const end = moment().add(1, "year").startOf("year");
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}
	return (
		<Table bordered striped size="sm" variant="dark" className="my-0 py-0" style={{ fontSize: 10 }}>
			<thead><tr>
				<th>연도</th>
				{
					store.range(12).map((cy: number) => (
						<th key={Math.random()} className="text-end px-1">{cy + 1}</th>
					))
				}
				<th className="text-end px-1">합계</th>
			</tr></thead><tbody>
				{
					store.range(end.year() - start.year()).map((cx: number) => (<tr key={Math.random()}>
						<th className="px-1 py-0">{start.year() + cx}</th>
						{
							store.range(12).map((cy: number) => {
								const key = moment([start.year() + cx, cy]).format("YYYY-MM");
								const history = mapHistory.get(key);
								if (history && history.dividend > 0) {
									return (
										<td key={cy} className="text-end px-1 py-0">{(history.dividend / (currentPrice || 10000) * 100).toFixed(2)}</td>
									);
								}
								return (<td key={cy}></td>);
							})
						}
						<th className="text-end px-1 py-0">{mapHistory.get(start.year() + cx) ? (mapHistory.get(start.year() + cx) / (currentPrice || 10000) * 100)!.toFixed(2) : ""}</th>
					</tr>))
				}
			</tbody></Table>
	);
}
function dividendBarGraphRatioByClosingPrice(mapHistory: any, start: any, currentPrice: number, height: number) {
	if (!mapHistory || !start || !currentPrice || !height) {
		return (<></>);
	}

	const end = moment().add(1, "year").startOf("year");
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}
	const years = end.year() - start.year();

	let max = 0;
	store.range(end.year() - start.year()).map((cx: number) => max = Math.max(max, (mapHistory.get(start.year() + cx) || 0) * 100 / currentPrice, mapHistory.get(start.year() + cx + 0.1) || 0));

	if (!max) {
		return (<></>);
	}

	return (
		<Row className="m-0 p-0 border-bottom" style={{ top: 0, }}>{
			store.range(end.year() - start.year()).map((cx: number) => (
				<Col key={cx} className={`m-0 p-0${cx >= years - 1 ? " border-bottom border-danger" : ""}`} style={{ height: height, }}>
					<Row className="m-0 p-0">
						<OverlayTrigger overlay={<Tooltip>{start.year() + cx}년: {(mapHistory.get(start.year() + cx + 0.1) || 0).toFixed(2)}%</Tooltip>}>
							<Col className="m-0 p-0" style={{ verticalAlign: "top", height: height, }}>
								<Row className="mx-1 px-0" style={{
									height: (max - (mapHistory.get(start.year() + cx + 0.1) || 0)) / max * height,
								}}>
									<Col className="m-0 p-0" />
								</Row>
								{
									store.range(12).map((cy: number) => {
										const history = mapHistory.get(moment([start.year() + cx, 11 - cy]).format("YYYY-MM"));
										if (history && history.dividend && history.priceClosing) {
											return (
												<OverlayTrigger key={Math.random()} overlay={<Tooltip>{moment([start.year() + cx, 11 - cy]).format("YYYY-MM")}: {((history.dividend / history.priceClosing * 100) || 0).toFixed(2)}%</Tooltip>}>
													<Row className="px-0" style={{
														marginLeft: 1,
														marginRight: 1,
														height: history.dividend / history.priceClosing * 100 / max * height,
														backgroundColor: FILL_COLOR_MONTH[11 - cy],
													}}>
														<Col className="m-0 p-0" />
													</Row>
												</OverlayTrigger>
											);
										}
									})
								}
							</Col>
						</OverlayTrigger>
					</Row>
				</Col>
			))
		}</Row>
	);
}
function dividendBarGraphRatioByCurrentPrice(mapHistory: any, start: any, currentPrice: number, height: number) {
	const end = moment().add(1, "year").startOf("year");
	currentPrice = currentPrice || 1;
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}
	const years = end.year() - start.year();
	let max = 0;
	store.range(end.year() - start.year()).map((cx: number) => max = Math.max(max, (mapHistory.get(start.year() + cx) || 0) * 100 / currentPrice, mapHistory.get(start.year() + cx + 0.1) || 0));
	if (max == 0) {
		return (<></>);
	}

	return (
		<Row className="m-0 p-0 border-bottom" style={{ top: 0, }}>{
			store.range(end.year() - start.year()).map((cx: number) => (
				<Col key={cx} className={`m-0 p-0${cx >= years - 1 ? " border-bottom border-danger" : ""}`} style={{ height: height, }}>
					<Row className="m-0 p-0">
						<OverlayTrigger overlay={<Tooltip>{start.year() + cx}년: {((mapHistory.get(start.year() + cx) || 0) * 100 / currentPrice).toFixed(2)}%</Tooltip>}>
							<Col className="m-0 p-0" style={{ verticalAlign: "top", }}>
								<Row className="mx-0 p-0" style={{
									height: (max - ((mapHistory.get(start.year() + cx) / currentPrice) || 0) * 100) / max * height,
								}}>
									<Col className="m-0 p-0" />
								</Row>
								{
									store.range(12).map((cy: number) => {
										const history = mapHistory.get(moment([start.year() + cx, 11 - cy]).format("YYYY-MM"));
										if (history && history.dividend > 0) {
											return (
												<OverlayTrigger key={cy} overlay={<Tooltip>{moment([start.year() + cx, 11 - cy]).format("YYYY-MM")}: {((history.dividend / currentPrice * 100) || 0).toFixed(2)}%</Tooltip>}>
													<Row className="px-0" style={{
														marginLeft: 1,
														marginRight: 1,
														height: (history.dividend / currentPrice) * 100 / max * height,
														backgroundColor: FILL_COLOR_MONTH[11 - cy],
													}}>
														<Col className="m-0 p-0" />
													</Row>
												</OverlayTrigger>
											);
										}
									})
								}
							</Col>
						</OverlayTrigger>
					</Row>
				</Col>
			))

		}</Row>
	);
}
function dividendBarGraphAmount(mapHistory: any, start: any, lineHeight: number) {
	if (!mapHistory || !start || !lineHeight) {
		return (<></>);
	}

	const end = moment().add(1, "year").startOf("year");
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}
	const years = end.year() - start.year();
	//start = end.clone().subtract(7, "years");
	let max = 0;
	store.range(end.year() - start.year()).map((cx: number) => max = Math.max(max, mapHistory.get(start.year() + cx) || 0));
	if (max == 0 || !lineHeight) {
		return (<></>);
	}

	return (
		<Row className="m-0 p-0 border-bottom" style={{ top: 0, }}>{
			store.range(years).map((cx: number) => (
				<Col key={Math.random()} className={`m-0 p-0${cx >= years - 1 ? " border-bottom border-danger" : ""}`} style={{ height: lineHeight, }}>
					<Row className="m-0 p-0">
						<OverlayTrigger overlay={<Tooltip>{start.year() + cx}년: {(mapHistory.get(start.year() + cx) || 0).toLocaleString()}원</Tooltip>}>
							<Col className="m-0 p-0" style={{ verticalAlign: "top", height: lineHeight, }}>
								<Row className="mx-1 px-0" style={{
									height: (max - (mapHistory.get(start.year() + cx) || 0)) / max * lineHeight,
								}}>
									<Col className="m-0 p-0" />
								</Row>
								{
									store.range(12).map((cy: number) => {
										const history = mapHistory.get(moment([start.year() + cx, 11 - cy]).format("YYYY-MM"));
										if (history && history.dividend > 0) {
											return (
												<Row key={Math.random()} className="px-0" style={{
													marginLeft: 1,
													marginRight: 1,
													height: history.dividend / max * lineHeight,
													backgroundColor: FILL_COLOR_MONTH[11 - cy],
												}}>
													<Col className="m-0 p-0" />
												</Row>
											);
										}
									})
								}
							</Col>
						</OverlayTrigger>
					</Row>
				</Col>
			))

		}</Row>
	);
}

// 종목별 기능
export function OperateColumn(props: any) {
	const { data, onChange } = props;

	const [spinner, setSpinner] = useState<boolean>(false);

	async function handleOnClickPriceChart(_: any) {
		window.open(`https://finance.naver.com/item/fchart.naver?code=${data.code}`, "네이버");
	}
	async function handleOnClickDetail(_: any) {
		window.open(`https://finance.naver.com/item/coinfo.naver?code=${data.code}`, "네이버");
	}
	async function handleOnClickCrawl(_: any) {
		setSpinner(true);
		crawlStore.crawlItem(data, (_: any) => {
			setSpinner(false);
			onChange && onChange({});
		});
	}

	const style = {
		fontSize: 9,
	};
	const className = "py-0 text-white";
	return (<>
		{spinner
			? (<Spinner animation="grow" variant="warning" size="sm" className="ms-0 me-1 align-middle" />)
			: (<>
				<Button size="sm" variant="outline-secondary" className={className} style={style} onClick={handleOnClickPriceChart} title="네이버 증권 시세 차트">차트</Button>
				<Button size="sm" variant="outline-secondary" className={className} style={style} onClick={handleOnClickDetail} title="네이버 증권 상세">상세</Button>
				<Button size="sm" variant="outline-secondary" className={className} style={style} onClick={handleOnClickCrawl} title="수집">수집</Button>
			</>)}
	</>);
}
