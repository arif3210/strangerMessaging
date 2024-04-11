import {  useEffect, useState } from 'react'
import io from 'socket.io-client'
import './Home.css'
function Home(){
    const [socket,setSocket] = useState(null)
    const [text,setText] = useState('')
    const [msgScreen,setMsgScreen] = useState(false)
    const [username,setUsername] = useState('')
    const [messages,setMessages] = useState([{uname:'user1',msg:'first message'},
    {uname:'user2',msg:'second message'},
    {uname:'user1',msg:'third message'}])
    useEffect(()=>{
        const newSocket = io('http://localhost:5000');
        newSocket.on('recieveMessage',(data)=>{
            setMessages(prev=>[...prev,data])
        })
        setSocket(newSocket)
        return ()=>{
            newSocket.disconnect()
        }

    },[])
    const clickContinue = ()=>{
        setMsgScreen(true)
    }
   
    const clickSend = ()=>{
        socket.emit('newmessage',{username:username,message:text})
        setText('')
    }
    return(
        <>
        {msgScreen ?
        <div className='main-div'>
            <div className='msg-display'>
            {messages.map((msg,i)=>{
                return(<div className='msg-container' key={i}>
                    <span className='msg-uname'>{msg.uname}</span>
                    <span className='msg-msg'>{msg.msg}</span>
                </div>)
            })}
            </div>
            
            <div>
            <input type='text' value={text} onChange={(e)=>{setText(e.target.value)}}/>
            <button onClick={clickSend}>Send</button>
            </div> 
        </div>:
        <div className='start-screen'>
            <p>What is your name</p>
            <div className='start-contents'>
            <input type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
            <button onClick={clickContinue}>Continue</button>
            </div>
        </div>
        }
        </>
    )
}
export default Home