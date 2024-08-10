import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

const setToken = (token) => {
  instance.defaults.headers.common["Authorization"] = token;
};

export { instance, setToken };
//baseURL: "https://multipeda.llio.fr/api/",