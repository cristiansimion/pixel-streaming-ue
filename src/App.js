import React from "react";

// components
import PixelStreaming from "./components/PixelStreaming";

// hooks
import useConnection from "./hooks/uceConnections";

function PixelWrapper() {
  const connection = useConnection();

  const handleConnection = async () => {
    const session = await connection.getSessionData("car11");

    if (session.uuid) {
      connection.startSessionUuuid(session.uuid, {
        onSuccess: (metadata) => {},
        onError: () => {}
      });
    }
  };

  const renderContent = () => {
    if (connection.state.status === "active") {
      return <button disabled>Connected! Wait ...</button>;
    }

    if (connection.state.status === "pending") {
      return (
        <div>
          {connection.countdown_value}%
          <div class="preloader" />
        </div>
      );
    }

    return (
      <div>
        <img
          style={{ width: "100%", marginBottom: "2rem" }}
          src="https://metaeditor.io/img/og_default.jpg"
        />

        <div>
          <button
            style={{
              pointerEvents: "all",
              fontSize: "1.5rem"
            }}
            onClick={handleConnection}
          >
            Launch Pixel Streaming
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0, 1)",
        height: "var(--window-height)"
      }}
    >
      <PixelStreaming host={connection.state.host} port={connection.state.port}>
        {renderContent()}
        <pre>{JSON.stringify(connection.state, null, 4)}</pre>
      </PixelStreaming>
    </div>
  );
}

export default PixelWrapper;
