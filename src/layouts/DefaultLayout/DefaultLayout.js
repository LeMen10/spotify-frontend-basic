import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '~/components/Header/Header';
import Playlist from '~/components/Playlist/Playlist';
// import WaitingList from '~/components/WaitingList/WaitingList';
import MusicCard from '~/components/MusicCard/MusicCard';
import Message from '~/components/Message/Message';
import GeminiChat from '~/components/GeminiChat/GeminiChat';
import Welcome from '~/components/Welcome/Welcome';
import Cookies from 'js-cookie';
// import { useState } from 'react';

const cx = className.bind(styles);
const DefaultLayout = ({ children }) => {
    const [checkOnClickChat, setCheckOnClickChat] = useState(false);
    const [checkOnClickChatGemini, setCheckOnClickChatGemini] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const token = Cookies.get('token');
    // console.log(isLoading);

    useEffect(() => {
        // console.log('Component Mounted');
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

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
                            <Playlist />
                            <div className={cx('content')}>{children}</div>
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
