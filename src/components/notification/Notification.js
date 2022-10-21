import React from "react";
import PropTypes from "prop-types";
import { Notification as GrommetNotification } from "grommet";

function Notification({
  message,
  title,
  onClose,
  status,
  toast,
  position,
  autoClose,
  ...rest
}) {
  return (
    <GrommetNotification
      title={title}
      message={message}
      status={status}
      onClose={onClose}
      {...rest}
      toast={{ position, autoClose }}
    />
  );
}

Notification.propTypes = {
  status: PropTypes.oneOf(["unknown", "normal", "warning", "critical"]),
  /**
   * Position of the notification; top is default
   */
  position: PropTypes.oneOf([
    "bottom",
    "bottom-left",
    "bottom-right",
    "center",
    "end",
    "hidden",
    "left",
    "right",
    "start",
    "top",
    "top-left",
    "top-right",
  ]),
  /**
   * notification title
   */
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,

  /**
   * function to close the dialog;
   */
  onClose: PropTypes.func,

  /**
   * decides prop to close automatically after 8sec
   */
  autoClose: PropTypes.bool,
};

Notification.defaultProps = {
  position: "top",
  status: undefined,
  onClose: undefined,
  autoClose: false,
};

export default Notification;
