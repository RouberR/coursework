import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { crypto, decrypted } from './utils/crypto';

const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [secretKey, setSecretKey] = useState('');
  const [messageText, setMessageText] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  const handleChangeSecretKey = (value) => {
    setSecretKey(value.target.value);
  };

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangeMessage = (e) => {
    setMessageText(e.target.value);
  };

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5001');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log('Socket закрыт');
    };
    socket.current.onerror = () => {
      console.log('Socket произошла ошибка');
    };
  };

  const sendMessage = async () => {
    const message = {
      username,
      message: crypto(messageText, secretKey),
      id: Date.now(),
      event: 'message',
    };
    socket.current.send(JSON.stringify(message));
    setMessageText('');
  };

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={handleChangeUsername}
            type="text"
            placeholder="Введите ваше имя"
          />

          <button disabled={!username} onClick={connect}>
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            placeholder="Введите ваше сообщение"
            value={messageText}
            onChange={handleChangeMessage}
            type="text"
          />

          <input
            value={secretKey}
            onChange={handleChangeSecretKey}
            type="text"
            placeholder="Введите ваш ключ"
          />
          <button disabled={!messageText} onClick={sendMessage}>
            Отправить
          </button>
        </div>
        <div className="messages">
          {messages.map((mess) => (
            <div key={mess.id}>
              {mess.event === 'connection' ? (
                <div className="connection_message">
                  Пользователь <b>{mess.username}</b> подключился
                </div>
              ) : (
                <div className="message">
                  <p>{mess.username}</p> {decrypted(mess.message, secretKey)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSock;
