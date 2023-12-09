type BaseType = Record<string, unknown>;

export interface TimerOption extends BaseType {
	tick?: number;
	ontick?: (sec: number) => void;
	onstart?: () => void;
	onpause?: () => void;
	onstop?: () => void;
	onend?: () => void;
}

type TimerFuncRecord = Required<Omit<TimerOption, "tick">>;
export type TimerFuncType = TimerFuncRecord[keyof TimerFuncRecord];
