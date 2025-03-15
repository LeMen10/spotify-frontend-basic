import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './MusicCard.module.scss';
import request from '~/utils/request';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const MusicCard = ({ onSelectContact, searchQuery }) => {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();

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

    // useEffect(() => {
    //     const fetchFilteredContacts = async () => {
    //         try {
    //             const res = await request.get(`/api/users`, { params: { search: searchQuery } });
    //             setContacts(res.data);
    //         } catch (error) {
    //             if (error.response?.status === 401) navigate('/login');
    //         }
    //     };
    //     fetchFilteredContacts();
    // }, [searchQuery, navigate]);

    return (
        <>
            <div className={cx('music-card')}>
                <div className={cx('controls')}>
                    <i className={cx('fas fa-step-backward')}></i>
                    <i className={cx('fas fa-play')}></i>
                    <i className={cx('fas fa-step-forward')}></i>
                </div>
                <div className={cx('progress')}>
                    <span>0:00</span>
                    <input max="100" min="0" type="range" value="0" />
                    <span>3:45</span>
                </div>
                <div className={cx('volume')}>
                    <i className={cx('fas fa-volume-up')}></i>
                    <input max="100" min="0" type="range" value="50" />
                </div>
            </div>

            {/* <div className={cx("music-player")}>
                <div className={cx("song-info")}>
                    <img src="https://via.placeholder.com/60" alt="Album Cover" />
                    <div className={cx("song-details")}>
                        <h4>97. ĐỪNG LÀM ANH HÙNG TRONG CUỘC ĐỜI</h4>
                        <p>Kien Tran</p>
                    </div>
                    <i className={cx("fa fa-plus-circle")}></i>
                </div>

                <div className={cx("controls")}>
                    <span className={cx("speed")}>1.3x</span>
                    <i className={cx("fa fa-backward")}></i>
                    <i className={cx("fa fa-play-circle")}></i>
                    <i className={cx("fa fa-forward")}></i>
                </div>

                <div className={cx("progress-bar")}>
                    <span className={cx("current-time")}>12:23</span>
                    <input type="range" min="0" max="100" value="80" />
                    <span className={cx("total-time")}>15:06</span>
                </div>

                <div className={cx("extra-controls")}>
                    <i className={cx("fa fa-list")}></i>
                    <i className={cx("fa fa-volume-up")}></i>
                    <input type="range" min="0" max="100" value="50" className={cx("volume")} />
                    <i className={cx("fa fa-expand")}></i>
                </div>
            </div> */}
        </>
    );
};

export default MusicCard;
