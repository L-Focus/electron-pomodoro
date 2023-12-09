export enum STATE_TYPE {
	START_WORK = "START_WORK",
	STOP_WORK = "STOP_WORK",
	START_REST = "START_REST",
	STOP_REST = "STOP_REST",
}

export const TEXT_MAP = {
	START_WORK: "开始工作",
	STOP_WORK: "停止工作",
	START_REST: "开始休息",
	STOP_REST: "停止休息",
};

/** 工作时间 秒 */
export const WORK_TIME = 30;

/** 休息时间 秒 */
export const REST_TIME = 10;
