import { DEFAULT_OPT, STATUS } from "./constant";
import { TimerFuncType, TimerOption } from "./type";

class Timer {
	public options: TimerOption = DEFAULT_OPT;
	private duration: number = 0;
	private status: STATUS = STATUS.INITIALIZED;
	private startTime: number = new Date().valueOf();
	private measures: Record<string, number> = {};
	private timeoutID?: NodeJS.Timeout;
	private intervalID?: NodeJS.Timeout;

	constructor(opt?: TimerOption) {
		this.options = Object.assign({}, DEFAULT_OPT, opt);
	}

	/**
	 * @param duration 持续时间 秒
	 */
	public start(duration: number) {
		if (this.timeoutID && this.status === STATUS.STARTED) return this;

		const MS = 1000;
		this.duration = duration * MS;
		this.startTime = new Date().valueOf();

		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(() => this.end(), this.duration);

		if (this.options.ontick && this.options.tick) {
			clearInterval(this.intervalID)
			this.intervalID = setInterval(() => {
				this.options.ontick && this.options.ontick(this.getDuration());
			}, this.options.tick * MS);
		}

		this.status = STATUS.STARTED;

		if (this.options.onstart) {
			this.options.onstart();
		}

		return this;
	}

	public pause() {
		if (this.status !== STATUS.STARTED) return this;

		this.duration = new Date().valueOf() - this.startTime;
		this.clear(false);
		this.status = STATUS.PAUSED;

		if (this.options.onpause) {
			this.options.onpause();
		}

		return true;
	}

	public stop() {
		if ([STATUS.STARTED, STATUS.PAUSED].includes(this.status)) return this;

		this.clear(true);

		this.status = STATUS.STOPPED;

		if (this.options.onstop) {
			this.options.onstop();
		}
	}

	public getStatus() {
		return this.status;
	}

	public getDuration() {
		if (this.status === STATUS.STARTED) {
			return this.duration - (new Date().valueOf() - this.startTime);
		}

		if (this.status === STATUS.PAUSED) {
			return this.duration;
		}

		return 0;
	}

	public on(key: string, func: TimerFuncType) {
		if (typeof key !== "string" || typeof func !== "function") return this;

		if (key.startsWith("on")) {
			key = "on" + key;
		}

		if (Object.hasOwnProperty.call(this.options, key)) {
			Object.assign(this.options, { option: func });
		}

		return this;
	}

	public off(key: string) {
		if (typeof key !== "string") return this;

		key = key.toLowerCase();

		if (key === "all") {
			this.options = Object.assign({}, { tick: this.options.tick });
		}

		if (!key.startsWith("on")) {
			key = "on" + key;
		}

		if (Object.hasOwnProperty.call(this.options, key)) {
			delete this.options[key];
		}

		return this;
	}

	public measureStart(label: string) {
		this.measures[label] = new Date().valueOf();
	}

	public measureStop(label: string) {
		return new Date().valueOf() - this.measures[label];
	}

	private end() {
		this.clear();
		this.status = STATUS.STOPPED;

		if (this.options.onend) {
			this.options.onend();
		}
	}

	private clear = (clearDuration?: boolean) => {
		clearTimeout(this.timeoutID);
		clearInterval(this.intervalID);

		if (clearDuration === true) this.duration = 0;
	};
}

export default Timer;
