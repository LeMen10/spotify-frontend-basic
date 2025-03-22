import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Welcome.module.scss';
import { Link } from 'react-router-dom';

// import request from '~/utils/request';
// import { useNavigate } from 'react-router-dom';
// import { faSignOut, faPaperPlane, faSmile, faMessage } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import messageIcon from '../Icons';
// import Message from '../Message/Message';

const cx = classNames.bind(styles);

const Welcome = () => {
    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const res = await request.get(`/api/users`);
    //             setContacts(res.data);
    //         } catch (error) {
    //             if (error.response?.status === 401) navigate('/login');
    //         }
    //     };
    //     fetchUsers();
    // }, [navigate]);

    return (
        <>
            <div className={cx('modal-overlay')}>
                <div className={cx('welcome-container')}>
                    <img alt="Spotify logo with a play button in the center" src="https://placehold.co/150x150" />
                    <h1>Bắt đầu nghe bằng tài khoản Spotify Free</h1>
                    <span className={cx('btn', 'btn-white', 'register-btn')}>
                        <Link to="/register">Đăng ký miễn phí</Link>
                    </span>
                    <div className={cx('login')}>
                        Bạn đã có tài khoản?
                        <span className={cx('login-btn')}>
                            <Link to="/login">Đăng nhập</Link>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Welcome;
