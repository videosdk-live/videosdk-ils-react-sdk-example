import { OutlinedButton } from "../../components/buttons/OutlinedButton";
import RecordingIcon from "../../icons/Bottombar/RecordingIcon";
import recordingBlink from "../../static/animations/recording-blink.json";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import useIsRecording from "../../hooks/useIsRecording";
import { useEffect, useMemo, useRef } from "react";
import { MobileIconButton } from "../../components/buttons/MobileIconButton";
import OutlineIconTextButton from "../../components/buttons/OutlineIconTextButton";
import LiveIcon from "../../icons/LiveIcon";

export function TopBar({ topBarHeight }) {
  const { meeting } = useMeeting();
  const RecordingBTN = () => {
    const { startRecording, stopRecording, recordingState } = useMeeting();
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: recordingBlink,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
      height: 64,
      width: 160,
    };

    const isRecording = useIsRecording();

    const isRecordingRef = useRef(isRecording);

    useEffect(() => {
      isRecordingRef.current = isRecording;
    }, [isRecording]);

    const { isRequestProcessing } = useMemo(
      () => ({
        isRequestProcessing:
          recordingState === Constants.recordingEvents.RECORDING_STARTING ||
          recordingState === Constants.recordingEvents.RECORDING_STOPPING,
      }),
      [recordingState]
    );

    const _handleClick = () => {
      const isRecording = isRecordingRef.current;

      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    return (
      <OutlinedButton
        Icon={RecordingIcon}
        onClick={_handleClick}
        isFocused={isRecording}
        buttonText={!isRecording && "REC"}
        tooltip={
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "Stop Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STARTING
            ? "Starting Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPED
            ? "Start Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPING
            ? "Stopping Recording"
            : "Start Recording"
        }
        lottieOption={isRecording ? defaultOptions : null}
        isRequestProcessing={isRequestProcessing}
      />
    );
  };

  const WebrtcViewerSwitchBTN = ({ isMobile, isTab }) => {
    const { meeting, changeMode } = useMeeting({});

    const _handleClick = () => {
      if (meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV) {
        changeMode(Constants.modes.RECV_ONLY);
      } else {
        changeMode(Constants.modes.SEND_AND_RECV);
      }
    };

    return isMobile || isTab ? (
      <MobileIconButton
        onClick={_handleClick}
        tooltipTitle={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? "Switch as Audience"
            : "Switch as Host"
        }
        Icon={LiveIcon}
        buttonText={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? "Switch as Audience"
            : "Switch as Host"
        }
      />
    ) : (
      <OutlineIconTextButton
        onClick={_handleClick}
        tooltipTitle={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? "Switch as Audience"
            : "Switch as Host"
        }
        buttonText={
          meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV
            ? "Switch as Audience"
            : "Switch as Host"
        }
      />
    );
  };
  return (
    <div className="md:flex md:items-center md:justify-end pt-2 lg:px-2 xl:px-6 pb-0 px-2 z-10 hidden">
      {meeting.localParticipant.mode === Constants.modes.SEND_AND_RECV && (
        <RecordingBTN />
      )}
      <WebrtcViewerSwitchBTN />
    </div>
  );
}
