import React from "react";
import ReactGA from "react-ga";

const useGAEventsTracker = (category = "Event Category") => {
  const trackEvent = (action = "action", label = "label", value = "value") => {
    console.log(category);
    console.log(action);
    console.log(label);
    console.log(value);
    ReactGA.event({ category, action, label, value });
  };
  return trackEvent;
};

export default useGAEventsTracker;
