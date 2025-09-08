import React, { useRef, useState } from "react";

import { Button, Spinner } from "react-bootstrap";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

// domain

// store
import itemStore from "../store/ItemStore";
import priceStore from "../store/PriceStore";
import dividendStore from "../store/DividendHistoryStore";

//	UploadButtonView.tsx
export default ((_: any) => {
	const [disableUpload, setDisableUpload] = useState(0);
	const dropRef = useRef<HTMLDivElement>(null);
	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: [NativeTypes.FILE],
			drop: (item: any) => {
				if (!item || !item.files) {
					console.warn("BLANK param!", item);
					return;
				}

				item.files.forEach((file: any) => {
					if (file.name.includes("item")) {
						setDisableUpload((x) => x + 1);
						itemStore.upload(file, () => setDisableUpload((x) => x - 1));
					} else if (file.name.includes("dividend")) {
						setDisableUpload((x) => x + 1);
						dividendStore.upload(file, () => setDisableUpload((x) => x - 1));
					} else if (file.name.includes("price")) {
						setDisableUpload((x) => x + 1);
						priceStore.upload(file, () => setDisableUpload((x) => x - 1));
					}
				});
			},
			canDrop: (_: any) => {
				return true;
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		})
	);

	let v = "secondary";
	if (isOver && canDrop) {
		v = "success";
	} else if (isOver && !canDrop) {
		v = "danger";
	}

	drop(dropRef);

	return (
		<div ref={dropRef}>
			<Button size="sm" variant={v} className="ms-1" disabled={disableUpload > 0}>
				<Spinner
					as="span"
					animation="grow"
					variant="warning"
					size="sm"
					role="status"
					className="mx-1 align-middle"
					hidden={disableUpload <= 0}
				/>
				업로드 영역({disableUpload})
			</Button>
		</div>
	);
});
