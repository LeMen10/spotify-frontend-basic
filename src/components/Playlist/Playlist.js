import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Playlist.module.scss';
// import request from '~/utils/request';
// import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Playlist = () => {

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
            <div className={cx('playlist')}>
                <div className={cx('menu-item', 'active')}>
                    <i className={cx('fas fa-home')}></i>
                    <span>Home</span>
                    
                </div>
                <div className={cx('menu-item')}>
                    <i className={cx('fas fa-search')}></i>
                    <span>Search</span>
                </div>
                <div className={cx('library')}>
                    <h3>Library</h3>
                    <div className={cx('library-item')}>
                        <img
                            alt="Your Episodes"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/wV9zvXvC0Pc3Qd548QSjCebr5DBbhgofDotl0gjXvI0.jpg"
                            width="40"
                        />
                        <div>
                            <div>Your Episodes</div>
                            <div>Saved and downloaded episodes</div>
                        </div>
                    </div>
                    <div className={cx('library-item')}>
                        <img
                            alt="Kien Tran"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/PADu_uO9hi_l-TjgoK0BCsAmSvVN74btkb55a2jQk50.jpg"
                            width="40"
                        />
                        <div>
                            <div>Kien Tran</div>
                            <div>Podcast • Kien Tran</div>
                        </div>
                    </div>
                    <div className={cx('library-item')}>
                        <img
                            alt="Bitcoin Podcast - Kien Tran"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/OrGjyH8yW2kcXpvOHj5Tisubrqs__iRMOPVuPuG0DCY.jpg"
                            width="40"
                        />
                        <div>
                            <div>Bitcoin Podcast - Kien Tran</div>
                            <div>Podcast • Kien Tran</div>
                        </div>
                    </div>
                    <div className={cx('library-item')}>
                        <img
                            alt="Yiruma"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/QK6u4lJorIaie-lNekJbC1ein34GdaayLj6SgtNZrs0.jpg"
                            width="40"
                        />
                        <div>
                            <div>Yiruma</div>
                            <div>Artist</div>
                        </div>
                    </div>
                    <div className={cx('library-item')}>
                        <img
                            alt="Relaxing Music 2025"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/vNc1AcxTa3gXEzfPjaAAenhKqShIm5PjuSdqdYPiXC8.jpg"
                            width="40"
                        />
                        <div>
                            <div>Relaxing Music 2025</div>
                            <div>Playlist </div>
                        </div>
                    </div>
                    <div className={cx('library-item')}>
                        <img
                            alt="Relaxing Music 2025"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/vNc1AcxTa3gXEzfPjaAAenhKqShIm5PjuSdqdYPiXC8.jpg"
                            width="40"
                        />
                        <div>
                            <div>Relaxing Music 2025</div>
                            <div>Playlist </div>
                        </div>
                    </div>
                    <div className={cx('library-item')}>
                        <img
                            alt="Relaxing Music 2025"
                            height="40"
                            src="https://storage.googleapis.com/a1aa/image/vNc1AcxTa3gXEzfPjaAAenhKqShIm5PjuSdqdYPiXC8.jpg"
                            width="40"
                        />
                        <div>
                            <div>Relaxing Music 2025</div>
                            <div>Playlist </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Playlist;
