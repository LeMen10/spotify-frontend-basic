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
    const [songs, setSongs] = useState([]);
    const [currentSongID, setCurrentSongID] = useState(null);
    const token = Cookies.get('token');

    const fetchPlaylists = async () => {
        try {
            const res = await request.get('/api/playlists/get-playlist-by-limit');
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

    const handlePlaylistAction = (action) => {
        fetchPlaylists();
        if (action.type === 'PLAY_SONGS' || action.type === 'PLAY_SINGLE_SONG') {
            setSongs(action.data);
            if (action.currentSongID) setCurrentSongID(action.currentSongID);
        } else if (action.type === 'UPDATE_SONG_LIST') {
            if (action.data.find((song) => song.id === currentSongID)) setSongs(action.data);
            else {
                setSongs([]);
                setCurrentSongID(null);
            }
        }
    };

    const handleSongChange = (song) => {
        setCurrentSongID(song.id);
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
                                {React.cloneElement(children, {
                                    onPlaylistAction: handlePlaylistAction,
                                    currentSongID,
                                })}
                            </div>
                            {checkOnClickChat && <Message setCheckOnClickChat={setCheckOnClickChat} />}
                            {checkOnClickChatGemini && (
                                <GeminiChat setCheckOnClickChatGemini={setCheckOnClickChatGemini} />
                            )}
                            {/* <Message setCheckOnClickChat={setCheckOnClickChat}/> */}
                            {/* <WaitingList/> */}
                        </div>
                        <MusicCard songs={songs} onSongChange={handleSongChange} />
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
