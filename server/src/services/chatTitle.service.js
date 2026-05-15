import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export const getChatTitleService = async (human_message) => {

    const response = await axios.post(`${process.env.AI_SERVICE_URL}/generate-title`, { human_message });

    console.log("chat title is:\n",response.data.response.chat_title);

    return response.data.response.chat_title;
}