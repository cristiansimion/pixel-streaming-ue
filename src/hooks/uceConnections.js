import React from "react";

// api
import useApi from "./useApi";

// hooks
import { useCountdown } from "metalib/common/hooks/";

const actions = () => {
  const api = useApi();
  const countdown = useCountdown();

  const refInterval = React.useRef(null);
  const refKillInterval = React.useRef(null);

  const [state, setState] = React.useState({
    auto_connect: null,
    loaded: false,

    status: undefined,
    host: undefined,
    port: undefined,
    que: undefined,

    seconds_to_kill: undefined,
    seconds_to_start: undefined
  });

  const dispatch = (payload) => {
    setState((c) => ({
      ...c,
      ...payload
    }));
  };

  React.useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  const handleStop = () => {
    clearInterval(refInterval.current);
    clearInterval(refKillInterval.current);
  };

  const cls = new (class {
    constructor() {
      this.MIN_SECONDS_TO_KILL = 100;
      this.state = state;
      this.countdown_value = countdown.value;
    }

    setAutoConnect(auto_connect) {
      dispatch({ auto_connect });
    }

    handleConnection({ host, port }) {
      if (host) {
        dispatch({ host });
      }
      if (port) {
        dispatch({ port });
      }
    }

    manualConnection({ host, port }) {
      dispatch({ loaded: true, status: "localhost", host, port });
    }

    async startSessionUuuid(sessionUuid, { onSuccess, onError }) {
      handleStop();

      const requestLoop = async () => {
        console.log("request...");
        await api
          .sessionRead(sessionUuid)
          .then((res) => {
            if (res.ok) {
              const { metadata, stream_data } = res.body;
              const {
                host,
                port,
                que,
                seconds_to_kill,
                seconds_to_start,
                status
              } = stream_data;
              const data = {
                host,
                port,
                que,
                seconds_to_kill,
                seconds_to_start,
                status
              };
              dispatch(data);

              countdown.start(seconds_to_start);
              if (status === "active") {
                clearInterval(refInterval.current);
                countdown.stop();
              }

              onSuccess(metadata);
            } else {
              onError();
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      };

      dispatch({ loaded: true });

      refInterval.current = setInterval(() => requestLoop(), 1000 * 3);
      await requestLoop();
    }

    async getSessionData(buildId) {
      return await api
        .sessionCreate(buildId)
        .then((res) => {
          if (res.ok) {
            return res.body;
          }
          return false;
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  })();

  return cls;
};

export default actions;
