import React, { useMemo } from "react";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import { MemoizedParticipantGrid } from "../../components/ParticipantGrid";
import Lottie from "lottie-react";
import animationData from "../../static/animations/meditation_animation.json";
import useIsMobile from "../../hooks/useIsMobile";
import useIsTab from "../../hooks/useIsTab";
import { useMediaQuery } from "react-responsive";

function ILSParticipantView({ isPresenting }) {
  const {
    participants,
    pinnedParticipants,
    activeSpeakerId,
    localParticipant,
    localScreenShareOn,
    presenterId,
  } = useMeeting();

  const participantIds = useMemo(() => {
    const pinnedParticipantId = [...pinnedParticipants.keys()].filter(
      (participantId) => {
        return participantId != localParticipant.id;
      }
    );
    const regularParticipantIds = [...participants.keys()].filter(
      (participantId) => {
        return (
          ![...pinnedParticipants.keys()].includes(participantId) &&
          localParticipant.id != participantId
        );
      }
    );

    const ids = [
      localParticipant.id,
      ...pinnedParticipantId,
      ...regularParticipantIds,
    ];

    const filteredParticipants = ids
      .filter((participantId) => {
        return participants.get(participantId)?.mode === Constants.modes.SEND_AND_RECV;
      })
      .slice(0, 16);

    if (activeSpeakerId) {
      if (!ids.includes(activeSpeakerId)) {
        ids[ids.length - 1] = activeSpeakerId;
      }
    }
    return filteredParticipants;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
  ]);
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });
  const lottieSize = isMobile
    ? 180
    : isTab
    ? 180
    : isLGDesktop
    ? 240
    : isXLDesktop
    ? 240
    : 160;

  return (
    <>
      {participantIds.length > 0 ? (
        <MemoizedParticipantGrid
          participantIds={participantIds}
          isPresenting={isPresenting}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center relative">
          <div className="flex flex-col items-center justify-center absolute top-0 left-0 bottom-0 right-0 z-0">
            <div
              style={{
                height: lottieSize,
                width: lottieSize,
              }}
            >
              <Lottie
                animationData={animationData}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid slice",
                }}
                loop={true}
                autoPlay={true}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
            <p className="text-white text-center font-semibold text-2xl mt-0">
              Waiting for host to join.
            </p>
            {
              <p className="text-white text-center font-semibold text-2xl">
                Meanwhile, take a few deep breaths.
              </p>
            }
          </div>
        </div>
      )}
    </>
  );
}

const MemorizedILSParticipantView = React.memo(
  ILSParticipantView,
  (prevProps, nextProps) => {
    return prevProps.isPresenting === nextProps.isPresenting;
  }
);

export default MemorizedILSParticipantView;
