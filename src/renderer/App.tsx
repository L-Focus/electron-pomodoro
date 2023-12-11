import { useEffect, useState } from "react";
import { REST_TIME, STATE_TYPE, TEXT_MAP, WORK_TIME } from "./constant";
import Timer from "../timer";
import { notification } from "./utils";

function App() {
	const [currentStatus, setCurrentStatus] = useState(STATE_TYPE.STOP_WORK);
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
			console.log(currentStatus);
			console.log(TEXT_MAP[currentStatus]);

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
				notification({
					title: "恭喜你完成任务",
					body: "是否开始休息？",
					actionText: "休息五分钟",
					closeButtonText: "继续工作",
					onaction: startRest,
					onclose: startWork,
				});
				setCurrentStatus(STATE_TYPE.START_REST);

				console.log("工作结束");
			} else if (currentStatus === STATE_TYPE.STOP_REST) {
				notification({
					body: "开始新的工作吧!",
					title: "休息结束",
					closeButtonText: "继续休息",
					actionText: "开始工作",
					onaction: startWork,
					onclose: startRest,
				});
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
			<div>{remainTime}</div>
			<button onClick={onBtnClick}>{TEXT_MAP[currentStatus]}</button>
		</>
	);
}

export default App;
