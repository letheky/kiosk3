import { ref } from "vue";
import axios from "axios";

const useGet = async (url) => {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  try {
    // Fetch the config.json file
    const config = await axios
      .get("config/config.json")
      .then((res) => res.data);

    // Use the apiEndpoint from the config file
    const apiEndpoint = config.api;

    // Make the API request
    data.value = await axios
      .get(`${apiEndpoint}/api/${url}`)
      .then((res) => res.data);
    // const response = await axios.get(`${apiEndpoint}/api/${url}`);
    // data.value = response.data;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }

  return { data, error, loading };
};

export default useGet;
