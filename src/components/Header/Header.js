import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import request from '~/utils/request';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Header = ({ onSelectContact, searchQuery }) => {
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
    //     fetchFilteredContacts()
    // }, [searchQuery, navigate]);

    return (
        // <>
        //     {contacts.length > 0 &&
        //         contacts.map((result) => (
        //             <div className={cx('contact')} key={result._id} onClick={() => onSelectContact(result)}>
        //                 <img alt="" height="40" src={result.profilePic} width="40" />
        //                 <div className={cx('name')}>{result.fullName}</div>
        //             </div>
        //         ))}
        // </>
        <>
            <div className={cx("header")}>
                <div className={cx("logo")}>
                    <h1>Spotify</h1>
                </div>
                <div className={cx("wrap-actions")}>
                    <div className={cx("search-bar")}>
                        <i className={cx("fas fa-search")}></i>
                        <input placeholder="Bạn muốn phát nội dung gì?" type="text" />
                    </div>
                    <div className={cx("actions")}>
                        <button>Khám phá Premium</button>
                        <button>Cài đặt Ứng dụng</button>
                        <div className={cx("user")}>
                            <i className={cx("fas fa-user-circle")}></i>
                            <span>V</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
