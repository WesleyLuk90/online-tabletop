import React, { ReactElement, useEffect, useState } from "react";
import { Spinner } from "./Icon";

export function DataLoader<T extends {}>({
    load,
    render
}: {
    load: () => Promise<T>;
    render: (t: T) => ReactElement | null;
}) {
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        load().then(setData);
    }, []);

    if (data == null) {
        return <Spinner />;
    }
    return render(data);
}
