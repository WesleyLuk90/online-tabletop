import * as React from "react";
import "./PlayPage.css";

interface Viewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

interface State {
    viewport: Viewport;
}

export class PlayPage extends React.Component<{}, State> {
    state: State = {
        viewport: {
            x: 0,
            y: 0,
            width: 1000,
            height: 1000
        }
    };

    svgRef = React.createRef<SVGSVGElement>();

    componentDidMount() {
        const svg = this.svgRef.current;
        if (svg) {
            this.setState({
                viewport: {
                    ...this.state.viewport,
                    width: svg.clientWidth,
                    height: svg.clientHeight
                }
            });
        }
    }

    onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button === 2) {
            e.preventDefault();
        }
    };

    computeViewBox() {
        const { x, y, width, height } = this.state.viewport;
        return `${x - width / 2} ${y - height / 2} ${width} ${height}`;
    }

    render() {
        return (
            <div className="play-page">
                <svg
                    ref={this.svgRef}
                    viewBox={this.computeViewBox()}
                    onMouseDown={this.onMouseDown}
                    className="play-area"
                >
                    <rect width={50} height={50} />
                </svg>
                <div className="side-bar">Side</div>
            </div>
        );
    }
}
