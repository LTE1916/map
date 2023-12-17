// plugins/request.js
import request from "@/api/request.js";

export default {
    install: (app) => {
        app.config.globalProperties.$request = request;
    }
};
