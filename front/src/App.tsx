import React, { useState, useEffect } from 'react';
import './App.css';
import * as signalR from '@microsoft/signalr';

function App() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  var [currentWebsocket, setCurrentWebsocket] = useState<WebSocket | null>(null);
  
  const WSS_HANDSHAKE = '{"protocol":"json","version":1}\u001e';
  const SIGNAL_KEY = '\u001e';


  //---------- USING SignalR CLIENT ----------------------

  const useSignalRClient = ()=> {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5556/SignalRHub/') // Адрес backend-хаба
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log('✅ SignalR подключен.');
        setConnection(newConnection);
        sendMessage();

        // Подписка на сообщения от сервера
        newConnection.on('Issue', (response: { data: string }) => {
          setMessages(prev => [...prev, response.data]);
        });
      })
      .catch(err => console.error('❌ Ошибка подключения к SignalR:', err));

    return () => {
      newConnection.stop(); // Закрываем соединение при удалении компонента
    };
  };

  async function sendMessage(): Promise<void> {
    if (connection && inputValue) {
      try {
        await connection.invoke('GetIssues', { property1: inputValue });
        console.log('📨 Данные отправлены:', inputValue);
      } catch (err) {
        console.error('❌ Ошибка отправки данных:', err);
      }
    }
  }


// ---------------- USING WebSocket DIRECTLY -----------------------------------

  function generateWebsocketRequest() {
    return {
      arguments: [{Property1: "Value of Property1"}],
      invocationId: '0',
      target: 'GetIssues',
      type: 1
    };
  };

  const connectWithWebsocket = () => {
    currentWebsocket?.close();
    currentWebsocket = new WebSocket('wss://localhost:5556/SignalRHub/');

    currentWebsocket.onopen = () => {
      currentWebsocket!.send(WSS_HANDSHAKE);
      currentWebsocket!.send(JSON.stringify(generateWebsocketRequest()) + SIGNAL_KEY);
      setCurrentWebsocket(currentWebsocket);
    };

    currentWebsocket.onmessage = (event) => {
      console.log(event.data);
    };

    currentWebsocket.onclose = (event) => {
      console.log("WebSocket closed.")
    };
  };










  return (
    <div style={{ padding: '20px' }}>
      <h1>SignalR Client</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Введите Property1"
      />
      <button onClick={useSignalRClient}>Отправить</button>

      <h2>Ответы от сервера:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
