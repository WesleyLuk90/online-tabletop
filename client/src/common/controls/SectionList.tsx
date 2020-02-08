import React, { ReactNode } from "react";
import "./SectionList.css";

export function SectionList<T>({
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
        <div className="section-list">
            {data.map(d => (
                <div className="section-list__item" key={id(d)}>
                    <div className="section-list__item__left">{left(d)}</div>
                    {right && (
                        <div className=".section-list__item__right">
                            {right(d)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
