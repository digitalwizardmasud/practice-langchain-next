import { YoutubeTranscript } from 'youtube-transcript';
import { CharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "langchain/chat_models/openai"
import {  PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorDBQAChain } from "langchain/chains";


const ytVideo = "https://youtu.be/CfuhRVM1ntQ"

export default async function handler(req, res){
  // const transcriptResponse = await YoutubeTranscript.fetchTranscript(ytVideo);
  // let transcription = ""
  // transcriptResponse.forEach(t=>{
  //   transcription+=` ${t.text}`
  // })
  
  // Create a text splitter, we use a smaller chunk size and chunk overlap since we are working with small sentences
  // const splitter = new CharacterTextSplitter({
  //   separator: " ",
  //   chunkSize: 50,
  //   chunkOverlap: 10,
  // });
  // const splitDocs = await splitter.createDocuments([transcription])
  const pinecone = new PineconeClient()
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = await pinecone.Index(process.env.PINECONE_INDEX)

    // Upload embeddings to pinecone
    // const dbres = await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
    //   pineconeIndex
    // })

    //Query Embeddings to pinecone
    
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo",
    });
    const pineconeStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({verbose:true}),
      { pineconeIndex }
    );
    const chain =  VectorDBQAChain.fromLLM(model, pineconeStore, {
      K: 1,
      returnSourceDocuments: true
    })
    const response = await chain.call({query: "what is agent and who is masud"})
    return res.status(200).json({ result: response.text });
}