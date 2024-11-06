// import axios from "axios";

// export const transcribeAudio = async (audioURI: any) => {
//   const apiKey = '';
//   const formData = new FormData();
//   formData?.append("file", {
//     uri: audioURI,
//     name: "audio.wav",
//     type: "audio/wav",
//   });
//   formData.append("model", "whisper-1"); // Specify the model name

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/audio/transcriptions",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     console.log("Transcription:", response);
//     return response.data.text;
//   } catch (error:any) {
//     console.error("Error transcribing audio:", error?.response?.data);
//   }
// };
