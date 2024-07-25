import axios from "axios";

// base da url http://homologacao3.azapfy.com.br/api/ps/metahumans

const api = axios.create({
    baseURL: 'http://homologacao3.azapfy.com.br/api/ps/metahumans'
});

export default api;