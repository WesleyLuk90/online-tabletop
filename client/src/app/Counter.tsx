import React, { useState } from "react";

export function Counter() {
    const [count, useCount] = useState(0);

    return (
        <div>
            {count} <button onClick={() => useCount(count + 1)}>wat</button>
        </div>
    );
}
