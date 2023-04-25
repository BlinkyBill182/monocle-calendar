import axios from "axios";

export default class Api {
    constructor() {
        this.client = null;
        this.api_url = 'http://localhost:8000';
    }

    init = () => {
        let headers = {
            Accept: "application/json",
        };

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });

        return this.client;
    };

    getEvents = (params) => {
        return this.init().get("/events", { params: params });
    };

    addEvent = (data) => {
        return this.init().post("/events", data);
    };
}
