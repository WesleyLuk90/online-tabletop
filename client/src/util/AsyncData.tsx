import React, {
    DependencyList,
    ReactElement,
    useEffect,
    useState
} from "react";
import { Alert } from "../common/Alert";
import { Spinner } from "../common/Icon";

export function useAsyncData<T>(
    load: () => Promise<T>,
    dependencies: DependencyList = []
): (render: (t: T) => ReactElement) => ReactElement {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        load()
            .then(setData)
            .catch(setError);
    }, dependencies);
    return (render: (t: T) => ReactElement) => {
        if (error != null) {
            return <Alert>{error.toString()}</Alert>;
        }
        if (data == null) {
            return <Spinner />;
        }
        return render(data);
    };
}
