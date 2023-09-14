const SSE = require('express-sse');
const sse = new SSE()
export default async function handler(req, res) {
  if(!res.flush){
    res.flush = ()=>{}
  }
 
  if(req.method=='POST'){
    console.log('post called');
    let count = 0
    while(count<10){
      console.log(count, 'count back');
      setTimeout(()=>{
        sse.send(count, 'countaa')
      }, 1000)
      count++
    }
    if(count>=10){
      setTimeout(()=>{
        sse.send(count, 'end')
      }, 2000)
    }

    return res.status(200).json({ result: "Streaming complete" });
  }else if(req.method == "GET"){
    console.log('get called');
    sse.init(req, res)
  }else{
    res.status(405).json({ message: "Method not allowed" });
  }
}