import { useEffect, useState } from "react";
import { REST_TIME, STATE_TYPE, TEXT_MAP, WORK_TIME } from "./constant";
import Timer from "../timer";
import style from "./App.module.css";

function App() {
	const [currentStatus, setCurrentStatus] = useState(STATE_TYPE.START_WORK);
	const [remainTime, setRemainTime] = useState(0);

	const workTimer = new Timer({
		ontick(sec: number) {
			const num = Number((sec / 1000).toFixed(0));

			console.log("num", num);

			setRemainTime(num);
		},
		onstop() {
			setCurrentStatus(STATE_TYPE.START_WORK);
			setRemainTime(0);
		},
		onend() {
			console.log("onend");
			setRemainTime(0);

			console.log(
				"currentStatus === STATE_TYPE.STOP_WORK",
				currentStatus === STATE_TYPE.STOP_WORK
			);
			console.log(
				"currentStatus === STATE_TYPE.STOP_REST",
				currentStatus === STATE_TYPE.STOP_REST
			);

			if (currentStatus === STATE_TYPE.STOP_WORK) {
				setCurrentStatus(STATE_TYPE.START_REST);

				console.log("工作结束");
			} else if (currentStatus === STATE_TYPE.STOP_REST) {
				setCurrentStatus(STATE_TYPE.START_WORK);

				console.log("休息结束");
			}
		},
	});

	function startWork() {
		setCurrentStatus(STATE_TYPE.STOP_WORK);
		setRemainTime(WORK_TIME);

		workTimer.start(WORK_TIME);
	}

	function startRest() {
		setCurrentStatus(STATE_TYPE.STOP_REST);
		setRemainTime(REST_TIME);

		workTimer.start(REST_TIME);
	}

	const onBtnClick = () => {
		if (currentStatus === STATE_TYPE.START_WORK) {
			startWork();
		} else if (currentStatus === STATE_TYPE.START_REST) {
			startRest();
		} else {
			workTimer.stop();
		}
	};

	useEffect(() => {
		startWork();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className={style.timerContainer}>{remainTime}</div>
			<button className={style.switchButton} onClick={onBtnClick}>
				{TEXT_MAP[currentStatus]}
			</button>
		</>
	);
}

export default App;
