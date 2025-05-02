import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import request from '~/utils/request';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SearchIcon } from '../Icons';
import PopupPremium from '../PopupPremium/PopupPremium';

const cx = classNames.bind(styles);

const Header = ({ setCheckOnClickChat, setCheckOnClickChatGemini }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const [showPremiumPopup, setShowPremiumPopup] = useState(false);

    const handleOpenPremiumPopup = () => {
        setShowPremiumPopup(true);
    };

    const handleClosePremiumPopup = () => {
        setShowPremiumPopup(false);
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await request.get(`/api/user/get-user`);
                setUser(res.data.user);
            } catch (error) { }
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

    useEffect(() => {
        if (location.pathname !== '/search') {
            setSearchTerm('');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === '/search' && searchTerm.trim() === '') {
            navigate('/search', { state: { rs: [] } });
        }
    }, [searchTerm, location.pathname, navigate]);

    const handleSearchKeyDown = async (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            const res = await request.get(`/api/songs/search?query=${encodeURIComponent(searchTerm)}`);
            navigate('/search', { state: { rs: res.data } });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <>
            {showPremiumPopup && (
                <PopupPremium
                    onClose={handleClosePremiumPopup}
                    userId={user?.id} // Truyền user ID vào PopupPremium
                />
            )}
            <div className={cx('header')}>
                <div className={cx('logo')} onClick={() => navigate('/')}>
                    <h1>Spotify</h1>
                </div>
                <div className={cx('wrap-actions')}>
                    <div className={cx('search-bar')}>
                        <SearchIcon fill={'#b3b3b3'} width="20" height="20" />
                        <input
                            placeholder="Bạn muốn tìm nội dung gì?"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <button
                            type="reset"
                            aria-label="Clear search input"
                            className={cx('clear-btn')}
                            onClick={handleClearSearch}
                        >
                            ×
                        </button>
                    </div>
                    <div className={cx('actions')}>
                        {!(user?.isPremium) && (<button onClick={handleOpenPremiumPopup}>Khám phá Premium</button>)}
                        {user && (
                            <div className={cx('user')}>
                                <span className={cx('logged')}>{user.username[0].toUpperCase()}</span>

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
