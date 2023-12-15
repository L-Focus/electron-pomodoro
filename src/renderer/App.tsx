import { useState } from "react";
import { Button } from "antd";
import TimerArea from "./components/TimerArea";

function App() {
	const [isStart, setIsStart] = useState(false);

	const onStartClick = () => setIsStart(true);

	return (
		<>
			<div>0.0.3</div>
			{isStart ? (
				<TimerArea />
			) : (
				<Button type="primary" onClick={onStartClick}>
					开始计时
				</Button>
			)}
		</>
	);
}

export default App;
