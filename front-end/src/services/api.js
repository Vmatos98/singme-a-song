import axios from "axios";

const instance = axios.create({
  baseURL: process.env.API_BASE_URL || "https://sing-me-a-song-driven.herokuapp.com"
});

export default instance;
