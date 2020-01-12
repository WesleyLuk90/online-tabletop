import React, { ReactNode } from "react";
import "./ItemList.css";

export function ItemList<T>({
    data,
    left,
    right,
    id
}: {
    data: T[];
    left: (t: T) => ReactNode;
    right?: (t: T) => ReactNode;
    id: (t: T) => string;
}) {
    return (
        <div className="item-list">
            {data.map(d => (
                <div className="item-list__item" key={id(d)}>
                    <div className="item-list__item-left">{left(d)}</div>
                    {right && (
                        <div className="item-list__item-right">{right(d)}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
