import express from "express"

const app = express();

app.get('/',(req,res)=>{
res.send("server is ready")
})

app.get('/api/jokes',(req,res)=>{
    const jokes = [
  {
    id: 1,
    title: "The Developer's Bug",
    content: "Why do programmers hate nature? — It has too many bugs!"
  },
  {
    id: 2,
    title: "Infinite Loop",
    content: "I told my computer I needed a break… now it won’t stop sending me KitKat ads."
  },
  {
    id: 3,
    title: "Syntax Error",
    content: "A JavaScript developer walks into a bar. He orders a drink, then orders another drink();"
  },
  {
    id: 4,
    title: "Commit Issues",
    content: "Why did the developer go broke? — Because he used up all his cache."
  },
  {
    id: 5,
    title: "404 Not Found",
    content: "I tried to tell a joke about UDP... but I’m not sure if anyone got it."
  },
  {
    id: 6,
    title: "Coffee Overflow",
    content: "How do Java developers stay awake? — They drink Java!"
  },
  {
    id: 7,
    title: "Stack Overflow",
    content: "Why did the developer quit his job? — Because he didn’t get arrays."
  },
  {
    id: 8,
    title: "Null Pointer",
    content: "I’d tell you a joke about null, but it’s pointless."
  },
  {
    id: 9,
    title: "API Problems",
    content: "Why did the API go to therapy? — Too many unresolved requests."
  },
  {
    id: 10,
    title: "Data Type",
    content: "A SQL query walks into a bar, walks up to two tables and asks — ‘Can I join you?’"
  }
];
res.send(jokes)
})
const port= process.env.PORT || 4000;

app.listen(port,()=>{
    console.log(`server is listening at port'${port}`);
    
})