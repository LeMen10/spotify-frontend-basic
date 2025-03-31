import { useState, useEffect, useRef } from 'react';
import className from 'classnames/bind';
import styles from './Home.module.scss';
import request from '~/utils/request';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Home = ({ onSelectContact, searchQuery }) => {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const userInformation = JSON.parse(localStorage.getItem('user')) || '';
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const res = await request.get(`/api/users`);
                    console.log(res.data);
                } catch (error) {
                    // if (error.response?.status === 401) navigate('/login');
                }
            };
            fetchUsers();
        }, []);
        
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
        if (!selectedConversation) return;
        (async () => {
            try {
                const res = await request.get(`/api/messages/${selectedConversation._id}`);
                setMessages(res.data);
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setIsLoadingMessages(false);
            }
        })();
    }, [selectedConversation, navigate]);

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

    return (
        <div className={cx('main-content')}>
            <div className={cx('tabs')}>
                <div className={cx('tab', 'active')}>All</div>
                <div className={cx('tab')}>Music</div>
                <div className={cx('tab')}>Podcasts</div>
            </div>
            <div className={cx('section')}>
                <h2>Your Shows</h2>
                <div className={cx('items')}>
                    <div className={cx('item')}>
                        <img
                            alt="Kien Tran Podcast"
                            height="150"
                            src="https://storage.googleapis.com/a1aa/image/t8M9Djt7frJ3fimenUPXcH_kOVDV3vsj1TptFZ8c34w.jpg"
                            width="150"
                        />
                        <div className={cx('title')}>Kien Tran</div>
                        <div className={cx('subtitle')}>Kien Tran</div>
                    </div>
                    <div className={cx('item')}>
                        <img
                            alt="Bitcoin Podcast - Kien Tran"
                            height="150"
                            src="https://storage.googleapis.com/a1aa/image/OrGjyH8yW2kcXpvOHj5Tisubrqs__iRMOPVuPuG0DCY.jpg"
                            width="150"
                        />
                        <div className={cx('title')}>Bitcoin Podcast - Kien Tran</div>
                        <div className={cx('subtitle')}>Kien Tran</div>
                    </div>
                    <div className={cx('item')}>
                        <img
                            alt="Giang oi Radio"
                            height="150"
                            src="https://storage.googleapis.com/a1aa/image/szrXNU9pssDSmX-WcyoUfU5wd5uhVxsENB8J-l8fFkY.jpg"
                            width="150"
                        />
                        <div className={cx('title')}>Giang oi Radio</div>
                        <div className={cx('subtitle')}>Giang oi Radio</div>
                    </div>
                    <div className={cx('item')}>
                        <img
                            alt="Sunhuyn Podcast"
                            height="150"
                            src="https://storage.googleapis.com/a1aa/image/e0rFA6zqUwYMHzTPkimanH9oMz2_1zL9mK2ZYUiM6I0.jpg"
                            width="150"
                        />
                        <div className={cx('title')}>Sunhuyn Podcast</div>
                        <div className={cx('subtitle')}>Sunhuyn</div>
                    </div>
                </div>
            </div>
            <div className={cx('section')}>
                <h2>For Vo Le Men</h2>
                <div className={cx('items')}></div>
            </div>
        </div>
    );
};

export default Home;
