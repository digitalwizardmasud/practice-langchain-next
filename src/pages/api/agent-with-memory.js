


import executorHandler from "@/utils/agent-with-memory/executor";




export default async function handler(req, res){
  const executor = await executorHandler(req.query.isFirst)
  const result = await executor.call({ input: req.query.topic })
  res.send({result})
}