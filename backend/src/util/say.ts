import axios from 'axios';

import { CustomLogger } from 'src/lib/logging-helper';

export const say = async (text: string) => {
  CustomLogger.i('[say]', text);

  const { TTS_API } = process.env;

  if (TTS_API) {
    try {
      const response = await axios.get(TTS_API, {
        params: {
          t: text,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        CustomLogger.e('Axios error:', error.message);
      } else {
        CustomLogger.e('Unexpected error:', error);
      }
    }
  }
};
