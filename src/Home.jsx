import { useState } from 'react'
import './Home.css'
function Home(){
    const [text,setText] = useState('')
    const [msgScreen,setMsgScreen] = useState(false)
    const [messages,setMessages] = useState([{uname:'user1',msg:'first message'},
    {uname:'user2',msg:'second message'},
    {uname:'user1',msg:'third message'}])
    return(
        <>
        {msgScreen ?
        <div className='main-div'>
            <div className='msg-display'>
            {messages.map((msg)=>{
                return(<div className='msg-container'>
                    <span className='msg-uname'>{msg.uname}</span>
                    <span className='msg-msg'>{msg.msg}</span>
                </div>)
            })}
            </div>
            
            <div>
            <input type='text' onChange={(e)=>{setText(e.target.value)}}/>
            <button onClick={()=>{console.log(text)}}>Send</button>
            </div> 
        </div>:
        <div className='start-screen'>
            <div className='start-contents'>
            <input type='text'/>
            <button>Continue</button>
            </div>
        </div>
        }
        </>
    )
}
export default Home