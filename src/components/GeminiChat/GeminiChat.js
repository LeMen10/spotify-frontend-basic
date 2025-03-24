import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import className from 'classnames/bind';
import styles from './GeminiChat.module.scss';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Contact from '~/components/Contact/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faPaperPlane, faSmile, faClose } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import request from '~/utils/request';
import { useSocket } from '~/context/SocketProvider';
import Search from '~/components/Search/Search';

const cx = className.bind(styles);

const GeminiChat = ({ setCheckOnClickChatGemini }) => {
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState(39);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const [messageUpdated, setMessageUpdated] = useState(false);
    console.log('Messages: ', messages, 'Length: ', messages?.length);

    const [messageContent, setMessageContent] = useState('');
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const num = JSON.parse(localStorage.getItem('num'));

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (newMessage) => {
            if (!newMessage || typeof newMessage !== 'object') return;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket]);

    useEffect(() => {
        // if (!selectedConversation) return;
        // setIsLoadingMessages(true);
        (async () => {
            try {
                const res = await request.get(`/api/message/get-messages-gemini`);
                console.log(res.data.messages);
                setMessages(res.data.messages);
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setTimeout(() => {
                    setIsLoadingMessages(false);
                }, 2000);
            }
        })();
    }, [navigate, messageUpdated]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    const API_URL =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBPB_46tPAls-foDHYB87dfpj6jtNV6-Bw';

    const sendMessage = async () => {

        const newMessages = [{ sender: parseInt(num), content: messageContent.trim() }];
        setMessageContent('');

        try {
            const response = await axios.post(API_URL, {
                contents: [{ parts: [{ text: messageContent }] }],
            });

            const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lỗi';
            const updatedMessages = [...newMessages, { sender: 'Gemini', content: reply }];

            await saveMessagesToDB(updatedMessages);
        } catch (error) {
            console.error('Lỗi gọi API Gemini:', error);
            setMessages([...newMessages, { sender: 'Gemini', content: 'Lỗi khi gửi tin nhắn.' }]);
        }
    };

    const saveMessagesToDB = async (messages) => {
        console.log('Lưu tin nhắn:', messages);
        try {
            const res = await request.post('/api/message/save-messages-gemini', { messages });
            console.log('Lưu tin nhắn thành công:', res);
            setMessageUpdated((prev) => !prev);
        } catch (error) {
            console.error('Lỗi lưu tin nhắn:', error);
        }
    };

    const handleSelectMessage = (id) => {
        setSelectedMessageId(selectedMessageId === id ? null : id);
    };

    const closeMessage = () => {
        setCheckOnClickChatGemini((prev) => !prev);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('main')}>
                    <div className={cx('chat-container')}>
                        <div className={cx('header')}>
                            <span>to: Gemini</span>
                            <FontAwesomeIcon className={cx('faClose-message')} icon={faClose} onClick={closeMessage} />
                        </div>
                        <div className={cx('messages')}>
                            {isLoadingMessages && (
                                <div className={cx('spinner-wr')}>
                                    <div className={cx('spinner')}></div>
                                </div>
                            )}
                            {!messages.length ? (
                                <div className={cx('no-message')}>
                                    <span>Tôi có thể giúp được gì cho bạn ??</span>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} onClick={() => handleSelectMessage(msg.id)}>
                                        {/* {selectedMessageId === msg.id && (
                                            <span className={cx('timestamp')}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        )} */}
                                        <div
                                            className={cx(
                                                'message',
                                                msg.sender_id === selectedConversation ? 'sent' : 'received',
                                            )}
                                        >
                                            {msg.sender_id !== selectedConversation ? (
                                                <>
                                                    <span className={cx('full-name')}>
                                                        {msg.fullname.trim().split(' ').pop()}
                                                    </span>
                                                    <div className={cx('msg-wr')}>
                                                        <span className={cx('text')}>{msg.content}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className={cx('text')}>{msg.content}</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef}></div>
                        </div>

                        <div className={cx('input-container')}>
                            <input
                                placeholder="Aa"
                                type="text"
                                ref={inputRef}
                                onFocus={() => {
                                    if (showEmojiPicker) setShowEmojiPicker(!showEmojiPicker);
                                }}
                                onChange={(e) => {
                                    setMessageContent(e.target.value);
                                }}
                                value={messageContent}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />

                            <FontAwesomeIcon
                                className={cx('icon-paper-plane')}
                                icon={faPaperPlane}
                                onClick={sendMessage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeminiChat;
