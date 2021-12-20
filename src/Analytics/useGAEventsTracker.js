import React from "react";
import ReactGA from "react-ga";

const useGAEventsTracker = (category = "Event Category") => {
  const trackEvent = (action = "action", label = "label", value = "value") => {
    ReactGA.event({ category, action, label, value });
  };
  return trackEvent;
};

export default useGAEventsTracker;
