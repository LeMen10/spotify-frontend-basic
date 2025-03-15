import PropTypes from 'prop-types';
import React, { useState } from 'react';
import className from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '~/components/Header/Header';
import Playlist from '~/components/Playlist/Playlist';
import WaitingList from '~/components/WaitingList/WaitingList';
import MusicCard from '~/components/MusicCard/MusicCard';
import Message from '~/components/Message/Message';
// import { useState } from 'react';

const cx = className.bind(styles);
function DefaultLayout({ children }) {
    const [checkOnClickChat, setCheckOnClickChat] = useState(false);
    console.log("checkOnClickChat:", checkOnClickChat);
    console.log("Render DefaultLayout");
    return (
        <div className={cx('wrapper')}>
            <Header setCheckOnClickChat={setCheckOnClickChat}/>
            <div className={cx('container')}>
                <Playlist/>
                <div className={cx('content')}>{children}</div>
                {checkOnClickChat && (<Message/>)}
                <WaitingList/>
            </div>
            <MusicCard/>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
