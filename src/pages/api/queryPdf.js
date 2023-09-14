import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export default async function handler(req, res) {
  const pinecone = new PineconeClient();

    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    const pineconeStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );

    const model = new OpenAI()
    const chain =  VectorDBQAChain.fromLLM(model, pineconeStore, {
      K: 1,
      returnSourceDocuments: true
    })
    const response = await chain.call({query: "Let me know hourly charge of masud?"})
    return res.status(200).json({ result: response.text });
}