// libs
import { Request } from "metalib/common/libs/";

const STREAM_API_URL = `https://api.metaeditor.io`;

export default function useApi() {
  const cls = new (class {
    constructor() {}

    urlBuilder(route) {
      return `${STREAM_API_URL}/api/` + route;
    }

    async sessionRead(sessionUuid) {
      const url = this.urlBuilder(
        "streams_provider/session/read/" + sessionUuid
      );
      return await Request.GET(url);
    }

    async sessionCreate(build_id) {
      const url = this.urlBuilder("streams_provider/session/create/");
      return await Request.POST(url, { build_id });
    }
  })();

  return cls;
}
