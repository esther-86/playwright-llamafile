/* eslint-disable lines-around-comment */
import axios from 'axios';

/*
chmod +x shared-libs/llamafiles/using 
./shared-libs/llamafiles/using --server

https://github.com/Mozilla-Ocho/llamafileL: Download a file and put it in the shared-libs/llamafiles folder, name it "using"
https://www.linkedin.com/learning/small-language-models-and-llamafile/small-language-models?u=46106868
Preference: llamafile over llama-node: https://llama-node.vercel.app/docs/start
*/
class LMApi {

  static lmConfig = {
    "stream": false,
    "n_predict": 400,
    "temperature": 0.7,
    "stop": [
      "</s>",
      "Llama:",
      "User:"
    ],
    "repeat_last_n": 256,
    "repeat_penalty": 1.18,
    "top_k": 40,
    "top_p": 0.95,
    "min_p": 0.05,
    "tfs_z": 1,
    "typical_p": 1,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    "mirostat": 0,
    "mirostat_tau": 5,
    "mirostat_eta": 0.1,
    "grammar": "",
    "n_probs": 0,
    "min_keep": 0,
    "image_data": [],
    "cache_prompt": true,
    "api_key": "",
    "slot_id": -1,
  }

  static async runQuery(prompt: string) {
    const response = await axios.post('http://127.0.0.1:8080/completion', {
      "prompt": `This is a conversation between User and Llama, a friendly chatbot. Llama is helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.\n\nUser: ${prompt}\nLlama:`,
      ...LMApi.lmConfig
    });
    return response.data.content;
  }
}

export { LMApi }
