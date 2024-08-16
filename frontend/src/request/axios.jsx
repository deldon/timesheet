import axios from "axios";
console.log("API URL:", import.meta.env.VITE_API_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const setToken = (token) => {
  instance.defaults.headers.common["Authorization"] = token;
};

export { instance, setToken };
//baseURL: "https://multipeda.llio.fr/api/",
