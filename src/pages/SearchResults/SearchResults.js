import React from 'react';
import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import styles from './SearchResults.module.scss';
import { useState, useEffect, useRef } from 'react';
import request from '~/utils/request';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { PlusIcon } from '~/components/Icons';
import Footer from '~/components/Footer/Footer';

const SearchResults = ({ onPlaylistAction, currentSongID }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const cx = classNames.bind(styles);
    const rs = location.state?.rs || [];
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const menuRef = useRef(null);
    const [playlists, setPlaylists] = useState([]);
    console.log(rs)

    const handlePlaySingleSong = (song) => {
        const reorderedSongs = [song, ...rs.filter((s) => s.id !== song.id)];
        onPlaylistAction({ type: 'PLAY_SONGS', data: reorderedSongs, currentSongID: song.id });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    };

    const getPlaylists = async (index) => {
        try {
            const res = await request.get('/api/playlists/get-playlists');
            setPlaylists(res.data);
            setActiveMenuIndex(index);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCreatePlaylist = async (song_id) => {
        setActiveMenuIndex(null);
        try {
            const token = Cookies.get('token');
            const formData = new FormData();
            formData.append('name', `Danh sách phát của tôi #${playlists.length + 1}`);

            const res = await request.post('/api/playlists/add-playlist', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            const playlistId = res.data.id;
            await onPlaylistAction('Playlist added');
            await handleAddToExistingPlaylist(playlistId, song_id);
            toast.success('Danh sách phát đã được thêm thành công');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else toast.error('Không thêm được danh sách phát. Vui lòng thử lại.');
        }
    };

    const handleAddToExistingPlaylist = async (playlist_id, song_id) => {
        setActiveMenuIndex(null);
        const data = { playlist_id, song_id };
        try {
            await request.post(`/api/playlist/add-song/`, data);
            toast.success('Bài hát đã được thêm vào danh sách phát.');
        } catch (error) {
            if (error.response.status === 401) navigate('/login');
            if (error.response.status === 400) toast.warning('Bài hát đã có trong danh sách');
        }
    };

    return (
        <div className={cx('container')} aria-label="Playlist Danh sách phát của tôi #1" role="main">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <section className={cx('search-section')} aria-label="Search content for playlist">
                <h2>Kết quả tìm kiếm</h2>
                {rs.length > 0 && (
                    <div aria-label="Music list" className={cx('table-music')} role="table">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tiêu đề</th>
                                    <th aria-label="Duration" scope="col">
                                        Thời lượng
                                    </th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rs.map((song, index) => (
                                    <tr key={song.id}>
                                        <td
                                            className={cx('song-title', {
                                                active: currentSongID === song.id,
                                            })}
                                        >
                                            {index + 1}
                                        </td>
                                        <td>
                                            <div className={cx('song-info')}>
                                                <img
                                                    alt="Album cover showing sunset over mountains with orange sky"
                                                    height="40"
                                                    src={song.image}
                                                    width="40"
                                                    onClick={() => handlePlaySingleSong(song)}
                                                />
                                                <div className={cx('song-text')}>
                                                    <span
                                                        className={cx('song-title', {
                                                            active: currentSongID === song.id,
                                                        })}
                                                        onClick={() => handlePlaySingleSong(song)}
                                                    >
                                                        {song.title}
                                                    </span>
                                                    <span className={cx('song-artist')}>{song.artist_info.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatTime(song.duration)}</td>
                                        <td style={{ position: 'relative' }}>
                                            <button className={cx('btn-add')} onClick={() => getPlaylists(index)}>
                                                Thêm
                                            </button>
                                            {activeMenuIndex === index && (
                                                <nav
                                                    className={cx('menu')}
                                                    role="menu"
                                                    aria-label="Context menu"
                                                    ref={menuRef}
                                                >
                                                    <div
                                                        className={cx('menu-item')}
                                                        role="menuitem"
                                                        onClick={() => handleCreatePlaylist(song.id)}
                                                    >
                                                        <PlusIcon />
                                                        Thêm danh sách mới
                                                    </div>
                                                    {playlists.length > 0 &&
                                                        playlists.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className={cx('menu-item')}
                                                                role="menuitem"
                                                                onClick={() =>
                                                                    handleAddToExistingPlaylist(item.id, song.id)
                                                                }
                                                            >
                                                                {item.name}
                                                            </div>
                                                        ))}
                                                </nav>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Footer />
            </section>
        </div>
    );
};

export default SearchResults;
