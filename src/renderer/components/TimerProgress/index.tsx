import { FC, memo } from "react";
import { Progress, ProgressProps } from "antd";

interface TimerProgressProps {
	percent: ProgressProps["percent"];
	format?: ProgressProps["format"];
}

const TimerProgress: FC<TimerProgressProps> = memo((props) => {
	const { percent, format } = props;

	return <Progress type="circle" percent={percent} format={format} />;
});

export default TimerProgress;
