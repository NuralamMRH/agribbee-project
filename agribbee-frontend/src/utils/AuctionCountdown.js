import { useState, useEffect } from "react";
import moment from "moment-timezone";

export const AuctionCountdown = ({
  auctionStartTime,
  auctionEndTime,
  isShowMinSec,
  isHelpText,
}) => {
  const [timeLeftToStart, setTimeLeftToStart] = useState({});
  const [timeLeftToEnd, setTimeLeftToEnd] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const startTime = moment(auctionStartTime).tz("Asia/Ho_Chi_Minh");
    const endTime = moment(auctionEndTime).tz("Asia/Ho_Chi_Minh");

    const updateCountdown = () => {
      const currentTime = moment().tz("Asia/Ho_Chi_Minh");

      if (currentTime.isBefore(startTime)) {
        // Auction has not started yet
        const timeLeft = moment.duration(startTime.diff(currentTime));
        setTimeLeftToStart({
          days: Math.floor(timeLeft.asDays()),
          hours: timeLeft.hours(),
          minutes: timeLeft.minutes(),
          seconds: timeLeft.seconds(),
        });
        setHasStarted(false);
      } else if (
        currentTime.isAfter(startTime) &&
        currentTime.isBefore(endTime)
      ) {
        // Auction is ongoing
        const timeLeft = moment.duration(endTime.diff(currentTime));
        setTimeLeftToEnd({
          days: Math.floor(timeLeft.asDays()),
          hours: timeLeft.hours(),
          minutes: timeLeft.minutes(),
          seconds: timeLeft.seconds(),
        });
        setHasStarted(true);
        setHasEnded(false);
      } else {
        // Auction has ended
        setHasStarted(true);
        setHasEnded(true);
      }
    };

    // Run the countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Initial run
    updateCountdown();

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [auctionStartTime, auctionEndTime]);

  // Display logic for the countdown
  if (!hasStarted) {
    return (
      <>
        {isHelpText && "Starts in "}
        {`${timeLeftToStart.days
          ?.toString()
          .padStart(2, "0")}d ${timeLeftToStart.hours
          ?.toString()
          .padStart(2, "0")}h ${
          isShowMinSec
            ? `${timeLeftToStart.minutes
                ?.toString()
                .padStart(2, "0")}m ${timeLeftToStart.seconds
                ?.toString()
                .padStart(2, "0")}s`
            : ""
        }`}
      </>
    );
  }

  if (hasStarted && !hasEnded) {
    return (
      <>
        {isHelpText && "Ends in "}
        {`${timeLeftToEnd.days
          ?.toString()
          .padStart(2, "0")}d ${timeLeftToEnd.hours
          ?.toString()
          .padStart(2, "0")}h${
          isShowMinSec
            ? `:${timeLeftToEnd.minutes
                ?.toString()
                .padStart(2, "0")}:${timeLeftToEnd.seconds
                ?.toString()
                .padStart(2, "0")}`
            : ""
        }`}
      </>
    );
  }

  return <>Ended</>;
};
