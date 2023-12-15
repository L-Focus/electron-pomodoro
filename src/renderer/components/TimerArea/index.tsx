import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Button } from "antd";
import { REST_TIME, STATE_TYPE, TEXT_MAP, WORK_TIME } from "./constant";
import TimerProgress from "../TimerProgress";
import Timer from "../../../lib/timer";
import style from "./index.module.css";

const TimerArea = () => {
	const workTimerRef = useRef(
		new Timer({
			ontick(sec: number) {
				const num = Number((sec / 1000).toFixed(0));

				setRemainTime(num);
			},
			onstop() {
				setCurrentStatus(STATE_TYPE.START_WORK);
				setRemainTime(0);
			},
			onend() {
				setRemainTime(0);

				if (currentStatus === STATE_TYPE.STOP_WORK) {
					if (window.electronAPI.platform() === "darwin") {
						window.electronAPI.notificationFunc({
							title: "恭喜你完成任务",
							body: "是否开始休息？",
							actionText: "休息五分钟",
							closeButtonText: "继续工作",
							onaction: startRest,
							onclose: startWork,
						});
					} else {
						console.log("工作结束");
					}

					setCurrentStatus(STATE_TYPE.START_REST);
				} else if (currentStatus === STATE_TYPE.STOP_REST) {
					if (window.electronAPI.platform() === "darwin") {
						window.electronAPI.notificationFunc({
							body: "开始新的工作吧!",
							title: "休息结束",
							closeButtonText: "继续休息",
							actionText: "开始工作",
							onaction: startWork,
							onclose: startRest,
						});
					} else {
						console.log("休息结束");
					}

					setCurrentStatus(STATE_TYPE.START_WORK);
				}
			},
		})
	);

	const [currentStatus, setCurrentStatus] = useState(STATE_TYPE.STOP_WORK);
	const [remainTime, setRemainTime] = useState(0);

	const percent = useMemo(() => {
		let allTime = 0;

		if ([STATE_TYPE.STOP_WORK, STATE_TYPE.START_WORK].includes(currentStatus)) {
			allTime = WORK_TIME;
		} else if ([STATE_TYPE.STOP_REST, STATE_TYPE.START_REST].includes(currentStatus)) {
			allTime = REST_TIME;
		}

		if (!allTime) return 100;

		return (remainTime / allTime) * 100;
	}, [currentStatus, remainTime]);

	const format = () => {
		const ss = remainTime % 60;
		const mm = ((remainTime - ss) / 60).toFixed();

		return `${mm.toString().padStart(2, "0")}:${ss
			.toString()
			.padStart(2, "0")}`;
	};

	const startWork = useCallback(() => {
		setCurrentStatus(STATE_TYPE.STOP_WORK);
		setRemainTime(WORK_TIME);

		workTimerRef.current.start(WORK_TIME);
	}, [workTimerRef]);

	const startRest = () => {
		setCurrentStatus(STATE_TYPE.STOP_REST);
		setRemainTime(REST_TIME);

		workTimerRef.current.start(REST_TIME);
	};

	const onBtnClick = () => {
		if (currentStatus === STATE_TYPE.START_WORK) {
			startWork();
		} else if (currentStatus === STATE_TYPE.START_REST) {
			startRest();
		} else {
			workTimerRef.current.stop();
		}
	};

	useEffect(() => {
		startWork();
	}, [startWork]);

	return (
		<div className={style.timerAreaStyle}>
			<TimerProgress percent={percent} format={format} />
			<Button className={style.btnStyle} type="primary" onClick={onBtnClick}>
				{TEXT_MAP[currentStatus]}
			</Button>
		</div>
	);
};

export default TimerArea;
