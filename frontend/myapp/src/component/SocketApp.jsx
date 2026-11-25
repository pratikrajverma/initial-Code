import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { io } from "socket.io-client";
 

const socket = io('http://localhost:3000')

const SocketApp = () => {
     
    const [onlineUser, setOnlineUser] = useState(0)

    const[userMessage, setUserMessage] = useState('')

    const [messageHistory, setMessageHistory] = useState([])

    const [room, setRoom] = useState('')

    const [userInfo, setUserInfo] = useState({
        name:'', 
        room:''
    })
     
     
    useEffect(()=>{
        //total users detail
        socket.on('totalUser', (data)=>{
          setOnlineUser(data)
          console.log(data)
        })


        //user message..........
        socket.on('message', (data)=>{
            console.log(data)
            setMessageHistory((preItem)=>{
                return [...preItem, data]
            })

        })
        

        socket.on('userjoin', (data)=>{
            console.log(data)
            console.log(`${data.name},  : joined` )
            setRoom(data.room)
        })
          

        socket.on('userDisconnect',(data)=>{
            console.log('user disconnected', data)
        })
    },[])
    



    // message sending logic...............
    function sendMessange(){
        socket.emit('message', userMessage)
    }

    function sendMessageEnter(e){
        if(e.key == 'Enter' && !e.shiftKey){
            sendMessange()
        }
    }


    function userInfoHandler(e){
                const {name, value} =  e.target

                setUserInfo((preItem)=>{
                    return {
                        ...preItem, 
                        [name]:value
                    }
                })
              

                // console.log(e.target.value)


            
    }


    function UserInfoSumbitHandler(e){
        e.preventDefault()
        socket.emit('join', userInfo)
       
    }



  return (
    <div>
    
        <h1>SocketApp Demo</h1>
        <p>online Users : {onlineUser}</p> 
        <p>Room Id: {room}</p>

        <form onSubmit={UserInfoSumbitHandler}>
            <input placeholder='UserName' name='name' onChange={(e)=>userInfoHandler(e)}/>
            <input placeholder='roomName' name='room' onChange={(e)=>userInfoHandler(e)}/>
            <button  >submit </button>
        </form>
        <br/>
        <br/>

        <textarea onKeyDown={(e)=>sendMessageEnter(e)}  onChange={(e)=>setUserMessage(e.target.value)}></textarea>

        <button onClick={sendMessange}>Set Name</button>

        <div>
            {
                messageHistory.map((msg, i)=>{
                    return <p key={i}>
                        {msg}
                    </p>
                })
            }
        </div>
         
        
    </div>
  )
}

export default SocketApp