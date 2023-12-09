import { TimerOption } from "./type";

export enum STATUS {
	INITIALIZED = "initialized",
	STARTED = "started",
	STOPPED = "stopped",
	PAUSED = "paused",
}

export const DEFAULT_OPT: TimerOption = {
	tick: 1,
};
