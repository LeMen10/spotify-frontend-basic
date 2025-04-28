import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '~/components/Header/Header';
import Sidebar from '~/components/Sidebar/Sidebar';
// import WaitingList from '~/components/WaitingList/WaitingList';
import MusicCard from '~/components/MusicCard/MusicCard';
import Message from '~/components/Message/Message';
import GeminiChat from '~/components/GeminiChat/GeminiChat';
import Welcome from '~/components/Welcome/Welcome';
import Cookies from 'js-cookie';
import * as request from '~/utils/request';
// import { useState } from 'react';

const cx = className.bind(styles);
const DefaultLayout = ({ children }) => {
    const [checkOnClickChat, setCheckOnClickChat] = useState(false);
    const [checkOnClickChatGemini, setCheckOnClickChatGemini] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [playlists, setPlaylists] = useState([]);
    const token = Cookies.get('token');

    const fetchPlaylists = async () => {
        try {
            const res = await request.get('/api/playlists/get-playlists');
            setPlaylists(res.data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);

            if (token) fetchPlaylists();
        }, 1000);

        return () => clearTimeout(timer);
    }, [token]);

    const handlePlaylistAction = (message) => {
        console.log('Message from Playlist:', message);
        fetchPlaylists();
    };

    return (
        <div>
            {isLoading ? (
                <div className={cx('spinner-wr')}>
                    <div className={cx('spinner')}></div>
                </div>
            ) : (
                isLoading === false && (
                    <div className={cx('wrapper')}>
                        {!token && <Welcome />}
                        <Header
                            setCheckOnClickChat={setCheckOnClickChat}
                            setCheckOnClickChatGemini={setCheckOnClickChatGemini}
                        />
                        <div className={cx('container')}>
                            <Sidebar onPlaylistAction={handlePlaylistAction} playlists={playlists} />
                            <div className={cx('content')}>
                                {React.cloneElement(children, { onPlaylistAction: handlePlaylistAction })}
                            </div>
                            {checkOnClickChat && <Message setCheckOnClickChat={setCheckOnClickChat} />}
                            {checkOnClickChatGemini && (
                                <GeminiChat setCheckOnClickChatGemini={setCheckOnClickChatGemini} />
                            )}
                            {/* <Message setCheckOnClickChat={setCheckOnClickChat}/> */}
                            {/* <WaitingList/> */}
                        </div>
                        <MusicCard />
                    </div>
                )
            )}
        </div>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
