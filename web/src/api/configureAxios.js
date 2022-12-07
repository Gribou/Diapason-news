import axios from "axios";
import { API_VERSION, API_URI } from "constants/api";
import { DEBUG } from "constants/config";

axios.defaults.baseURL = `${API_URI}/`;
if (!DEBUG) {
  axios.defaults.xsrfHeaderName = "X-CSRFToken";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.withCredentials = true;
}

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common[
  "Accept"
] = `application/json; version=${API_VERSION}`;

const prepareCall = (call, { getState }) => {
  const proper_call = typeof call === "string" ? { url: call } : call;
  const { data } = proper_call;
  const headers = proper_call?.headers || {};
  const csrftoken = getState()?.credentials?.csrftoken;
  //force csrftoken into body so that it is not overwritten by ADAN
  if (csrftoken && data) {
    if (data instanceof FormData) data.append("csrfmiddlewaretoken", csrftoken);
    else data["csrfmiddlewaretoken"] = csrftoken;
  }
  const token = getState()?.credentials?.token || "";
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  //token is only used in DEBUG
  //in production, session is used instead
  return { ...proper_call, headers, data };
};

export default () => async (call, { getState }) => {
  try {
    const result = await axios(prepareCall(call, { getState }));
    return { data: result.data };
  } catch (error) {
    const { response } = error;
    if (DEBUG) {
      console.error(error, response);
    }
    if (response && response.status === 503) {
      //503 Service Unavailable
      window.location.reload();
      return;
    }
    return {
      error: {
        ...generateErrorMessage(error),
      },
      meta: { status: response?.status },
    };
  }
};

function generateErrorMessage(error) {
  const { response, message } = error;
  if (response) {
    if (response.data) {
      if (
        typeof response.data === "string" ||
        response.data instanceof String
      ) {
        return {
          non_field_errors: `${response.status} - ${response.statusText}`,
        };
      } else {
        return response.data;
      }
    } else if (response.status >= 500) {
      return {
        non_field_errors: `Erreur serveur (${response.status} ${response.statusText}) : rafraîchissez la page ou réessayez plus tard.`,
      };
    } else {
      return {
        non_field_errors: `${response.status} - ${response.statusText}`,
      };
    }
  } else {
    return {
      non_field_errors: `Erreur serveur (${message}) : rafraîchissez la page ou réessayez plus tard.`,
    };
  }
}
