import { Vector } from "engine/math/Vector";
import React, { useContext, useEffect, useRef } from "react";
import { checkState } from "../../util/CheckState";
import { notNull } from "../../util/Nullable";

export interface MapEvents {
    onClick: (position: Vector) => void;
    onRightClick: (position: Vector) => void;
    onDragStart: (start: Vector) => void;
    onDrag: (start: Vector, current: Vector) => void;
    onDragEnd: (start: Vector, end: Vector) => void;
}

export type OptionalMapEvents = Partial<MapEvents>;

interface MapEventSubscriber {
    (events: OptionalMapEvents): () => void;
}

const MapEventContext = React.createContext<MapEventSubscriber | null>(null);

export function useMapEvents(mapEvents: OptionalMapEvents) {
    const subscriber = useContext(MapEventContext);
    useEffect(() => {
        if (subscriber == null) {
            throw new Error("MapEvent context not found");
        }
        return subscriber(mapEvents);
    });
}

class SubscriptionManager<Args extends any[]> {
    subscribers: ((...args: Args) => void)[] = [];
    invoke(...args: Args) {
        this.subscribers.forEach((s) => {
            try {
                s(...args);
            } catch (e) {
                console.error("Error when invoking subscriber", e);
            }
        });
    }

    subscribe(callable?: (...args: Args) => void) {
        if (callable == null) {
            return null;
        }
        checkState(!this.subscribers.includes(callable));
        this.subscribers.push(callable);
        return () =>
            (this.subscribers = this.subscribers.filter((s) => s !== callable));
    }
}

export function MapContextProvider({
    children,
}: {
    children: (events: MapEvents) => React.ReactNode;
}) {
    const subscribers = useRef({
        onClick: new SubscriptionManager<[Vector]>(),
        onRightClick: new SubscriptionManager<[Vector]>(),
        onDragStart: new SubscriptionManager<[Vector]>(),
        onDrag: new SubscriptionManager<[Vector, Vector]>(),
        onDragEnd: new SubscriptionManager<[Vector, Vector]>(),
    });

    function subscribe(events: OptionalMapEvents) {
        const subscriptions = [
            subscribers.current.onClick.subscribe(events.onClick),
            subscribers.current.onRightClick.subscribe(events.onRightClick),
            subscribers.current.onDragStart.subscribe(events.onDragStart),
            subscribers.current.onDrag.subscribe(events.onDrag),
            subscribers.current.onDragEnd.subscribe(events.onDragEnd),
        ];
        return () => subscriptions.filter(notNull).forEach((s) => s());
    }

    const {
        onClick,
        onRightClick,
        onDragStart,
        onDrag,
        onDragEnd: onDragEng,
    } = subscribers.current;

    return (
        <MapEventContext.Provider value={subscribe}>
            {children({
                onClick: onClick.invoke.bind(onClick),
                onRightClick: onRightClick.invoke.bind(onRightClick),
                onDragStart: onDragStart.invoke.bind(onDragStart),
                onDrag: onDrag.invoke.bind(onDrag),
                onDragEnd: onDragEng.invoke.bind(onDragEng),
            })}
        </MapEventContext.Provider>
    );
}
