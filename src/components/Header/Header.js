import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
// import request from '~/utils/request';
// import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Header = ({ setCheckOnClickChat }) => {
    // const navigate = useNavigate();

    const handleClick = () => {
        setCheckOnClickChat(prev => !prev);
    };

    return (
        <>
            <div className={cx('header')}>
                <div className={cx('logo')}>
                    <h1>Spotify</h1>
                </div>
                <div className={cx('wrap-actions')}>
                    <div className={cx('search-bar')}>
                        <i className={cx('fas fa-search')}></i>
                        <input placeholder="Bạn muốn phát nội dung gì?" type="text" />
                    </div>
                    <div className={cx('actions')}>
                        <button>Khám phá Premium</button>
                        <button>Cài đặt Ứng dụng</button>
                        <div className={cx('user')}>
                            <i className={cx('fas fa-user-circle')}></i>
                            <span onClick={handleClick}>V</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
