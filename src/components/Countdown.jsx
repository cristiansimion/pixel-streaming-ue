import React from "react";

// hooks
import { useCountdown } from "metalib/common/hooks/";

export default function Countdown({ seconds }) {
  const countdown = useCountdown({ seconds });

  React.useEffect(() => {
    countdown.start();
  }, []);

  return <div>{countdown.value}%</div>;
}
