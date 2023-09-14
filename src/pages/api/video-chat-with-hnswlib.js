import { YoutubeTranscript } from "youtube-transcript";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorDBQAChain } from "langchain/chains";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
const ytVideo = "https://youtu.be/CfuhRVM1ntQ";

export default async function handler(req, res) {
  // const transcriptResponse = await YoutubeTranscript.fetchTranscript(ytVideo);
  // let transcription = "";
  // transcriptResponse.forEach((t) => {
  //   transcription += ` ${t.text}`;
  // });

  // Create a text splitter, we use a smaller chunk size and chunk overlap since we are working with small sentences
  // const splitter = new CharacterTextSplitter({
  //   separator: " ",
  //   chunkSize: 50,
  //   chunkOverlap: 10,
  // });
  // const splitDocs = await splitter.createDocuments([transcription]);

  // const vectorStore = await HNSWLib.fromDocuments(
  //   splitDocs,
  //   new OpenAIEmbeddings()
  // );
  const directory = "src/data";

  // await vectorStore.save(directory);
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings()
  );
  const model = new ChatOpenAI({
    temperature: 0.8,
    modelName: "gpt-3.5-turbo",
  });
  let chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    loadedVectorStore.asRetriever(),
    { verbose: true } // Add verbose option here
  );
  
const response = await chain.call({
  question: "how to learn langchain?",
  chat_history:[]
})
  
  return res.status(200).json({ result: response });
}
