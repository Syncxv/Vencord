/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { LazyComponent } from "@utils/misc";
import { React } from "@webpack/common";

import { ELEMENT_ID } from "../constants";
import { settings } from "../index";
import { waitFor } from "../utils/waitFor";

type Vec2 = { x: number, y: number; };
export interface MagnifierProps {
    zoom: number;
    size: number,
    instance: any;
}

export interface MagnifierState {
    position: Vec2,
    imagePosition: Vec2,
    size: number,
    zoom: number,
    opacity: number,
    isShiftDown: boolean,
    ready: boolean;
}
// class component because i like it more
export const Magnifier = LazyComponent(() => class Magnifier extends React.PureComponent<MagnifierProps, MagnifierState> {
    lens = React.createRef<HTMLDivElement>();
    imageRef = React.createRef<HTMLImageElement>();
    currentVideoElementRef = React.createRef<HTMLVideoElement>();
    videoElement!: HTMLVideoElement;
    constructor(props: MagnifierProps) {
        super(props);

    }

    get element(): HTMLDivElement {
        return document.querySelector(`#${ELEMENT_ID}`)!;
    }


    async componentDidMount() {
        document.addEventListener("mousemove", this.updateMousePosition);
        document.addEventListener("mousedown", this.updateMousePosition);
        document.addEventListener("mouseup", this.updateMousePosition);
        document.addEventListener("wheel", this.onWheel);
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);

        if (this.props.instance.props.animated) {
            await waitFor(`#${ELEMENT_ID} > video`);
            this.videoElement = this.element.querySelector("video")!;
            this.videoElement.addEventListener("timeupdate", this.syncVidoes);
            this.setState({ ...this.state, ready: true });
        } else {
            this.setState({ ...this.state, ready: true });
        }
        this.element.firstElementChild!.setAttribute("draggable", "false");
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousemove", this.updateMousePosition);
        document.removeEventListener("mousedown", this.updateMousePosition);
        document.removeEventListener("mouseup", this.updateMousePosition);
        document.removeEventListener("wheel", this.onWheel);
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);
        this.videoElement?.removeEventListener("timeupdate", this.syncVidoes);

        if (settings.store.saveZoomValues) {
            settings.store.zoom = this.state.zoom;
            settings.store.size = this.state.size;
        }

    }

    syncVidoes = (e: Event) => {
        this.currentVideoElementRef.current!.currentTime = this.videoElement.currentTime;
    };

    onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Shift") {
            this.setState({ ...this.state, isShiftDown: true });
        }
    };

    onKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Shift") {
            this.setState({ ...this.state, isShiftDown: false });
        }
    };

    onWheel = async (e: WheelEvent) => {
        const { instance } = this.props;
        if (instance.state.mouseOver && instance.state.mouseDown && !this.state.isShiftDown) {
            const val = this.state.zoom + ((e.deltaY / 100) * (settings.store.invertScroll ? -1 : 1)) * settings.store.zoomSpeed;
            this.setState({ ...this.state, zoom: val <= 1 ? 1 : val }, () => this.updateMousePosition(e));

        }
        if (instance.state.mouseOver && instance.state.mouseDown && this.state.isShiftDown) {
            const val = this.state.size + (e.deltaY * (settings.store.invertScroll ? -1 : 1)) * settings.store.zoomSpeed;
            this.setState({ ...this.state, size: val <= 50 ? 50 : val }, () => this.updateMousePosition(e));
        }
    };

    updateMousePosition = (e: MouseEvent) => {
        const { instance } = this.props;
        const { zoom, size } = this.state;
        if (instance.state.mouseOver && instance.state.mouseDown) {
            const offset = size / 2;
            const pos = { x: e.pageX, y: e.pageY };
            const x = -((pos.x - this.element.getBoundingClientRect().left) * zoom - offset);
            const y = -((pos.y - this.element.getBoundingClientRect().top) * zoom - offset);
            this.setPositions({ x: e.x - offset, y: e.y - offset }, { x, y });
        }
        else this.setState({ ...this.state, opacity: 0 });
    };

    setPositions = (position: Vec2, imagePosition: Vec2) => {
        this.setState({ ...this.state, opacity: 1, imagePosition, position });
    };

    state = {
        position: { x: 0, y: 0 },
        imagePosition: { x: 0, y: 0 },
        size: this.props.size,
        zoom: this.props.zoom,
        opacity: 0,
        isShiftDown: false,
        ready: false
    };

    render() {
        if (!this.state.ready) return null;
        const { instance: { props: { src, animated } } } = this.props;
        const { position, opacity, imagePosition, zoom, size } = this.state;
        const transformStyle = `translate(${position.x}px, ${position.y}px)`;
        const box = this.element.getBoundingClientRect();

        return (

            <div
                className="lens"
                style={{
                    opacity,
                    width: size + "px",
                    height: size + "px",
                    transform: transformStyle,
                }}
            >
                {animated ?
                    <video
                        ref={this.currentVideoElementRef}
                        style={{
                            position: "absolute",
                            left: `${imagePosition.x}px`,
                            top: `${imagePosition.y}px`
                        }}
                        width={`${box.width * zoom}px`}
                        height={`${box.height * zoom}px`}
                        poster={src}
                        src={this.videoElement.src ?? src}
                        autoPlay
                        loop
                    /> : <img
                        ref={this.imageRef}
                        style={{
                            position: "absolute",
                            left: `${imagePosition.x}px`,
                            top: `${imagePosition.y}px`
                        }}
                        width={`${box.width * zoom}px`}
                        height={`${box.height * zoom}px`}
                        src={src} alt=""
                    />}
            </div>
        );
    }
});

