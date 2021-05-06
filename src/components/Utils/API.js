import axios from "axios";

const axiosConfig = {
    responseType: "json",
    headers: {
        'AccessKey': '891cf53c-01fc-4d74-a14c-592668b7a03c',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
};

export default axios.create(axiosConfig);