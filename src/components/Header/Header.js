import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import request from '~/utils/request';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

const Header = ({ setCheckOnClickChat, setCheckOnClickChatGemini }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(() => {
        (async () => {
            try {
                const res = await request.get(`/api/user/get-user`);
                setUser(res.data.user);
            } catch (error) {}
        })();
    }, [navigate]);

    const handleClick = () => {
        setCheckOnClickChat(() => true);
    };

    const handleClickGemini = () => {
        setCheckOnClickChatGemini(() => true);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('num');
        window.location.reload();
    };

    return (
        <>
            <div className={cx('header')}>
                <div className={cx('logo')} onClick={() => navigate('/')}>
                    <h1>Spotify</h1>
                </div>
                <div className={cx('wrap-actions')}>
                    <div className={cx('search-bar')}>
                        <i className={cx('fas fa-search')}></i>
                        <input placeholder="Bạn muốn phát nội dung gì?" type="text" />
                    </div>
                    <div className={cx('actions')}>
                        <button>Khám phá Premium</button>
                        {user && (
                            <div className={cx('user')}>
                                <span className={cx('logged')}>
                                    {/* {user ? <img alt="User profile" src={user.profile_pic} /> : <span></span>} */}
                                    {user.username[0].toUpperCase()}
                                </span>

                                <div className={cx('logged-dropdown-wrap')}>
                                    <ul className={cx('logged-dropdown-list')}>
                                        <li onClick={handleClick} className={cx('logged-dropdown-item')}>
                                            <div className={cx('logged-dropdown-item-content')}>General chat </div>
                                        </li>
                                        <li onClick={handleClickGemini} className={cx('logged-dropdown-item')}>
                                            <div className={cx('logged-dropdown-item-content')}>Gemini AI</div>
                                        </li>
                                        <li onClick={handleLogout} className={cx('logged-dropdown-item')}>
                                            <div className={cx('logged-dropdown-item-content')}>Log Out</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
