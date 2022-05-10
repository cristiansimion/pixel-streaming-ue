import React from "react";

// libs
import PixelStreaming from "pixel-streaming";

export default function Player(props) {
  const refPixelStreaming = React.useRef(null);

  return (
    <PixelStreaming
      ref={refPixelStreaming}
      onLoad={(payload) => {
        // console.warn('loaded', payload);
      }}
      onConnect={() => {
        // console.warn('connected');
      }}
      onRestart={() => {
        // console.warn('onRestart');
      }}
      onError={(payload) => {
        // console.error('error', payload);
      }}
      onClose={(payload) => {
        // console.error('closed', payload);
      }}
      onProgress={(payload) => {
        // console.warn('progress', payload);
      }}
      settings={{
        volume: 1,
        quality: 1,
        connectOnStart: true,

        host: props.host,
        port: props.port,

        pixelStreaming: {
          warnTimeout: 120,
          closeTimeout: 10,
          lockMouse: false,
          fakeMouseWithTouches: false
        }
      }}
      metaSettings={{
        isDev: true,
        showDevTools: true,
        notifyCommands: true,
        notifyCallbacks: true
      }}
    >
      {(payload) => <div style={{ padding: 30 }}>{props.children}</div>}
    </PixelStreaming>
  );
}
