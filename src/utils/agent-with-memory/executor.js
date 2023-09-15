import { BufferMemory } from "langchain/memory";  
import { initializeAgentExecutorWithOptions } from "langchain/agents";  
import { SerpAPI } from "langchain/tools";  
import { Calculator } from "langchain/tools/calculator";  
import { ChatOpenAI } from "langchain/chat_models/openai";  



const serpAPI = new SerpAPI(process.env.SERPAPI_API_KEY, {
  // baseUrl: "http://localhost:3000/agents",
  location: "Vancouver,British Columbia, Canada",
  hl: "en",
  gl: "us",
});
serpAPI.returnDirect = true;

const model = new ChatOpenAI({ temperature: 0 });  
 const tools = [  
 new SerpAPI(process.env.SERPAPI_API_KEY, {  
 location: "Austin,Texas,United States",  
 hl: "en",  
 gl: "us",  
 }),  
 new Calculator(),  
 ];  



 let memory
 let executor
export default async function executorHandler(isFirst){
  
  if(isFirst=="true"){
    memory  = await new BufferMemory({memoryKey:'chat_history'});
    executor = await initializeAgentExecutorWithOptions(tools, model, {  
      agentType: "chat-conversational-react-description",  
      // verbose: true,  
      memory
      });
    return executor
  }else{
    const messages = ["My name is Rana", "I am a web developer", "I know these technology HTML, CSS, JS"]
    memory  = await new BufferMemory({memoryKey:'chat_history'});
    executor = await initializeAgentExecutorWithOptions(tools, model, {  
      agentType: "chat-conversational-react-description",  
      memory
      });
    // await memory?.chatHistory?.clear()
    messages.forEach(msg=> memory.chatHistory.addUserMessage(msg))
    console.log(memory.chatHistory.getMessages());
    return executor
  }
  
  
}