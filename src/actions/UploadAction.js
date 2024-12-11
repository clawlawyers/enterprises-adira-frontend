import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const getAnswer = async (doc_id, query, jwt) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/edit_document`,
      {
        doc_id: doc_id,
        edit_query: query,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },}
    );
    return res;
  } catch (e) {
    throw new Error(e.value);
  }
};
