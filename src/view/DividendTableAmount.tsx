import moment from "moment";
import React from "react";
import { Table, } from "react-bootstrap";

// model
import DividendHistory from "../model/DividendHistory";

// store
import store from "../store/StockStore";

// DividendTableAmount.tsx
// 배당 금액
export function DividendTableAmount(props: any) {
	const { mapHistory, setHeight } = props;
	let start = props.start;
	const histories = props.histories as DividendHistory[] || [];

	if (!mapHistory || !start) {
		return (<></>);
	}

	const end = moment().add(1, "year").startOf("year");
	if (start.isBefore(end.clone().subtract(11, "years"))) {
		start = end.clone().subtract(11, "years");
	}

	let title = "";
	histories.forEach((history: DividendHistory) => title += (moment(history.base).format("YYYY-MM-DD") + ": " + history.dividend + "\n")); 
//	console.log(mapHistory, histories, setHeight);
	return (
		<Table ref={el => { setHeight && el && el.clientHeight && setHeight(el.clientHeight); }} bordered striped size="sm" variant="dark" className="my-0 py-0" style={{ fontSize: 10 }}>
			<thead><tr className="my-0 py-0" title={title}>
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
			</tbody>
		</Table>
	);
}
