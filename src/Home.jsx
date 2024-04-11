import {  useEffect, useState } from 'react'
import io from 'socket.io-client'
import './Home.css'
function Home(){
    const [socket,setSocket] = useState(null)
    const [text,setText] = useState('')
    const [mySocketId,setMySocketId] = useState(null)
    const [socketOtherEnd,setSocketOtherend] = useState(null)
    const [msgScreen,setMsgScreen] = useState(false)
    const [username,setUsername] = useState('')
    const [messages,setMessages] = useState([])
    const [state,setState] = ('wait')
    useEffect(()=>{
        const newSocket = io('http://localhost:5000');
        newSocket.on('connect', () => {
            console.log('Socket ID:', newSocket.id);
            setMySocketId(newSocket.id)
        });
        newSocket.on('pair',(id)=>{
            console.log(`paired with ${id}`);
            setSocketOtherend(id)
        })
        newSocket.on('recieveMessage',(data)=>{
            setMessages(prev=>[...prev,data])
        })
        setSocket(newSocket)
        return ()=>{
            newSocket.disconnect()
        }

    },[])
    const clickContinue = ()=>{
        socket.emit('registeruser',{socket:mySocketId,username:username})
        setMsgScreen(true)
    }
   
    const clickSend = ()=>{
        socket.to(socketOtherEnd).emit('newmessage',{username:username,message:text})
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