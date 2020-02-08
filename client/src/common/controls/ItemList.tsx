import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useRef, useState } from "react";
import { Vector } from "../../play/Vector";
import { FollowMouse } from "../mouse/FollowMouse";
import { GlobalMouseUp } from "../mouse/GlobalMouseUp";
import { Icon } from "./Icon";
import "./ItemList.css";
import { Search } from "./Search";

const ITEM_HEIGHT = 32;

export function ItemList<T>({
    data,
    left,
    right,
    id,
    onMove,
    filter
}: {
    data: T[];
    left: (t: T) => ReactNode;
    right?: (t: T) => ReactNode;
    id: (t: T) => string;
    onMove?: (from: number, to: number) => void;
    filter?: (search: string, t: T) => void;
}) {
    const [index, setIndex] = useState<number | null>(null);
    const [spacerIndex, setSpacerIndex] = useState<number | null>(null);
    const [width, setWidth] = useState<number>(100);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    function onMouseDown(e: React.MouseEvent<HTMLDivElement>, index: number) {
        e.preventDefault();
        if (ref.current != null) {
            setIndex(index);
            setWidth(ref.current.getBoundingClientRect().width);
        }
    }

    function onMouseMove(position: Vector) {
        if (!ref.current) {
            return;
        }
        let otherIndex = Math.round(
            (position.y - ref.current.getBoundingClientRect().top) / ITEM_HEIGHT
        );
        if (otherIndex < 0) {
            otherIndex = 0;
        }
        if (otherIndex > data.length - 1) {
            otherIndex = data.length - 1;
        }
        setSpacerIndex(otherIndex);
    }

    const items: (T | null)[] = data.slice();
    if (index != null && spacerIndex != null) {
        items.splice(index, 1);
        items.splice(spacerIndex, 0, null);
    }

    function onMouseUp() {
        if (onMove && index != null && spacerIndex != null) {
            onMove(index, spacerIndex);
        }
        setIndex(null);
        setSpacerIndex(null);
    }

    return (
        <div className="item-list" ref={ref}>
            {filter && <Search value={search} onChange={setSearch} />}
            {items.map((d, i) => {
                if (d == null) {
                    return <div className="item-list__item" key="spacer"></div>;
                } else {
                    return (
                        <div className="item-list__item" key={id(d)}>
                            {onMove && (
                                <div
                                    className="item-list__drag-icon"
                                    onMouseDown={e => onMouseDown(e, i)}
                                >
                                    <Icon icon={faGripVertical} />
                                </div>
                            )}
                            <div className="item-list__item-left">
                                {left(d)}
                            </div>
                            {right && (
                                <div className="item-list__item-right">
                                    {right(d)}
                                </div>
                            )}
                        </div>
                    );
                }
            })}
            <GlobalMouseUp onMouseUp={onMouseUp} />
            {index != null && (
                <FollowMouse onMouseMove={onMouseMove}>
                    <div
                        className="item-list__item item-list__item--hover"
                        key={id(data[index])}
                        style={{ width: width }}
                    >
                        <div className="item-list__drag-icon">
                            <Icon icon={faGripVertical} />
                        </div>
                        <div className="item-list__item-left">
                            {left(data[index])}
                        </div>
                        {right && (
                            <div className="item-list__item-right">
                                {right(data[index])}
                            </div>
                        )}
                    </div>
                </FollowMouse>
            )}
        </div>
    );
}
