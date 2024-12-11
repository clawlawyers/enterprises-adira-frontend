import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const getSummary = async (doc_id, jwt) => {
  try {
    const res = await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/summarize`, {
      doc_id: doc_id,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },});

    return res;
  } catch (e) {
    throw new Error("catch", e);
  }
};
