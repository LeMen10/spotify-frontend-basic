import { useState, useEffect, useRef } from 'react';
import className from 'classnames/bind';
import styles from './Home.module.scss';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Contact from '~/components/Contact/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import request from '~/utils/request';
import { useSocket } from '~/context/SocketProvider';
import Search from '~/components/Search/Search';

const cx = className.bind(styles);

const Home = () => {

    return (
        <div className={cx("main-content")}>
            <div className={cx("tabs")}>
                <div className={cx("tab", "active")}>
                    All
                </div>
                <div className={cx("tab")}>
                    Music
                </div>
                <div className={cx("tab")}>
                    Podcasts
                </div>
            </div>
            <div className={cx("section")}>
                <h2>
                    Your Shows
                </h2>
                <div className={cx("items")}>
                    <div className={cx("item")}>
                        <img alt="Kien Tran Podcast" height="150"
                            src="https://storage.googleapis.com/a1aa/image/t8M9Djt7frJ3fimenUPXcH_kOVDV3vsj1TptFZ8c34w.jpg"
                            width="150" />
                        <div className={cx("title")}>
                            Kien Tran
                        </div>
                        <div className={cx("subtitle")}>
                            Kien Tran
                        </div>
                    </div>
                    <div className={cx("item")}>
                        <img alt="Bitcoin Podcast - Kien Tran" height="150"
                            src="https://storage.googleapis.com/a1aa/image/OrGjyH8yW2kcXpvOHj5Tisubrqs__iRMOPVuPuG0DCY.jpg"
                            width="150" />
                        <div className={cx("title")}>
                            Bitcoin Podcast - Kien Tran
                        </div>
                        <div className={cx("subtitle")}>
                            Kien Tran
                        </div>
                    </div>
                    <div className={cx("item")}>
                        <img alt="Giang oi Radio" height="150"
                            src="https://storage.googleapis.com/a1aa/image/szrXNU9pssDSmX-WcyoUfU5wd5uhVxsENB8J-l8fFkY.jpg"
                            width="150" />
                        <div className={cx("title")}>
                            Giang oi Radio
                        </div>
                        <div className={cx("subtitle")}>
                            Giang oi Radio
                        </div>
                    </div>
                    <div className={cx("item")}>
                        <img alt="Sunhuyn Podcast" height="150"
                            src="https://storage.googleapis.com/a1aa/image/e0rFA6zqUwYMHzTPkimanH9oMz2_1zL9mK2ZYUiM6I0.jpg"
                            width="150" />
                        <div className={cx("title")}>
                            Sunhuyn Podcast
                        </div>
                        <div className={cx("subtitle")}>
                            Sunhuyn
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx("section")}>
                <h2>
                    For Vo Le Men
                </h2>
                <div className={cx("items")}>
                </div>
            </div>
        </div>
    );
};

export default Home;

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
