import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.metadata = {
    startTime: performance.now(),
  };

  console.log(
    `%c[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`,
    "color: blue; font-weight: bold;"
  );

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const endTime = performance.now();

    const duration =
      endTime - response.config.metadata.startTime;

    console.log(
      `%c[API RESPONSE] ${response.config.url}`,
      "color: green; font-weight: bold;"
    );

    console.table({
      URL: response.config.url,
      Method: response.config.method,
      Status: response.status,
      Duration: `${duration.toFixed(2)} ms`,
    });

    return response;
  },
  (error) => {
    const endTime = performance.now();

    const duration =
      endTime - error.config.metadata.startTime;

    console.log(
      `%c[API ERROR] ${error.config.url}`,
      "color: red; font-weight: bold;"
    );

    console.table({
      URL: error.config.url,
      Method: error.config.method,
      Status: error.response?.status,
      Duration: `${duration.toFixed(2)} ms`,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;