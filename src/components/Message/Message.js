import { useState, useEffect, useRef } from 'react';
import className from 'classnames/bind';
import styles from './Message.module.scss';
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

const Message = ({ setCheckOnClickChat }) => {
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState(39);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    console.log(messages);

    const [messageContent, setMessageContent] = useState('');
    const userInformation = JSON.parse(localStorage.getItem('user')) || '';
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    // useEffect(() => {
    //         const fetchUsers = async () => {
    //             try {
    //                 const res = await request.get(`/api/users`);
    //                 console.log(res.data);
    //             } catch (error) {
    //                 // if (error.response?.status === 401) navigate('/login');
    //             }
    //         };
    //         fetchUsers();
    //     }, []);

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
        setIsLoadingMessages(true);
        (async () => {
            try {
                const res = await request.get(`/api/message/get-messages-general-chat`);
                console.log(res.data);
                setMessages(res.data.messages);
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setTimeout(() => {
                    setIsLoadingMessages(false);
                }, 2000);
            }
        })();
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    const sendMessage = async () => {
        if (showEmojiPicker) setShowEmojiPicker(!showEmojiPicker);
        if (!messageContent.trim()) return;
        const data = { message: messageContent.trim() };
        setMessageContent('');
        try {
            const res = await request.post(`/api/messages/send/${selectedConversation._id}`, data);
            const newMessage = res.data?.message;
            if (!newMessage || typeof newMessage !== 'object' || !newMessage._id) return;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            if (socket) socket.emit('sendMessage', res.data);
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const textBefore = messageContent.substring(0, start);
        const textAfter = messageContent.substring(end);
        const newText = textBefore + emojiObject.emoji + textAfter;

        setMessageContent(newText);
        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start + emojiObject.emoji.length, start + emojiObject.emoji.length);
        }, 0);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSelectContact = (contact) => {
        setSelectedConversation(contact);
        setIsLoadingMessages(true);
    };

    const handleSelectMessage = (id) => {
        setSelectedMessageId(selectedMessageId === id ? null : id);
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // const user = JSON.parse(localStorage.getItem('user'));
    // console.log('User:', user);

    const closeMessage = () => {
        setCheckOnClickChat((prev) => !prev);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('main')}>
                    <div className={cx('chat-container')}>
                        <div className={cx('header')}>
                            <span>to: General chat</span>
                            <FontAwesomeIcon className={cx('faClose-message')} icon={faClose} onClick={closeMessage} />
                        </div>
                        <div className={cx('messages')}>
                            {isLoadingMessages ? (
                                <div className={cx('spinner-wr')}>
                                    <div className={cx('spinner')}></div>
                                </div>
                            ) : (
                                messages.length > 0 &&
                                messages.map((msg) => (
                                    <div key={msg.id} onClick={() => handleSelectMessage(msg.id)}>
                                        {selectedMessageId === msg.id && (
                                            <span className={cx('timestamp')}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        )}
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
                                                        <img
                                                            alt="User profile"
                                                            src={msg.profile_pic || 'https://placehold.co/30x30'}
                                                        />
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
                                className={cx('icon-smile')}
                                icon={faSmile}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            />

                            {showEmojiPicker && (
                                <div className={cx('emoji-picker-container')}>
                                    <EmojiPicker
                                        previewConfig={{ showPreview: false }}
                                        searchDisabled={true}
                                        skinTonesDisabled={true}
                                        onEmojiClick={handleEmojiClick}
                                        height="300px"
                                        theme="dark"
                                    />
                                </div>
                            )}
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

export default Message;

const NoChatSelected = ({ fullName }) => {
    return (
        <>
            <div className={cx('welcome')}>
                Welcome
                <span aria-label="wave" role="img">
                    {' '}
                    👋{' '}
                </span>
                {fullName}
                <span aria-label="snowflake" role="img">
                    {' '}
                    ❄️{' '}
                </span>
            </div>
            <div className={cx('select-chat')}>Select a chat to start messaging</div>
            <div className={cx('chat-icon')}>
                <i className={cx('fas fa-comments')}> </i>
            </div>
        </>
    );
};
