import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './WaitingList.module.scss';
import request from '~/utils/request';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const WaitingList = ({ onSelectContact, searchQuery }) => {
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
        <>
            <div className={cx("queue")}>
                <h2>Queue</h2>
                <div className={cx("empty-queue")}>
                    <i className={cx("fas fa-list")}></i>
                    <p>Add to your queue</p>
                    <button>Find something to play</button>
                </div>
            </div>
        </>
    );
};

export default WaitingList;
