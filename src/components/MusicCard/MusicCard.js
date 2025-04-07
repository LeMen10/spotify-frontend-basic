import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './MusicCard.module.scss';
import request from '~/utils/request';
import { faPause, faPlay, faBackwardStep, faForwardStep, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

const MusicCard = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.6);
    const audioRef = useRef(null);

    // Lấy danh sách bài hát
    useEffect(() => {
        (async () => {
            try {
                if (songs.length === 0) {
                    const res = await request.get('api/songs/get-songs');
                    setSongs(res.data);
                    if (res.data.length > 0 && !currentSong) {
                        setCurrentSong(res.data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        })();
    }, [currentSong, songs.length]);

    // Xử lý play
    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch((e) => console.error('Play failed:', e));
            setIsPlaying(true);
        }
    }, [isPlaying]);

    const playNext = useCallback(() => {
        if (!songs.length) return;
        const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentSong(songs[nextIndex]);
    }, [songs, currentSong]);

    const playPrev = useCallback(() => {
        if (!songs.length) return;
        const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setCurrentSong(songs[prevIndex]);
    }, [songs, currentSong]);

    // Xử lý khi select song
    const selectSong = useCallback((song) => {
        setCurrentSong(song);
    }, []);

    // time update
    const handleTimeUpdate = useCallback(() => {
        if (!audioRef.current) return;
        const now = Date.now();
        if (!audioRef.current.lastUpdate || now - audioRef.current.lastUpdate >= 1000) {
            setCurrentTime(audioRef.current.currentTime);
            audioRef.current.lastUpdate = now;
        }
    }, []);

    const handleSeek = (e) => {
        const newTime = e.target.value;
        if (!audioRef.current) return;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        if (!audioRef.current) return;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        if (!audioRef.current || !currentSong) return;
        audioRef.current.src = currentSong.audio_url;
        audioRef.current.currentTime = 0;
        setCurrentTime(0);

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((e) => {
                    console.error('Auto play failed:', e);
                    setIsPlaying(false);
                });
        }
    }, [currentSong]);

    // Cập nhật duration khi metadata được load
    useEffect(() => {
        if (!audioRef.current) return;

        const handleLoadedMetadata = () => {
            setDuration(audioRef.current.duration || 0);
        };

        audioRef.current.lastUpdate = 0;
        const audioElement = audioRef.current;
        audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () => {
            audioElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    return (
        <div className={cx('music-player')}>
            <audio ref={audioRef} src={currentSong?.audio_url} onTimeUpdate={handleTimeUpdate} onEnded={playNext} />

            <div className={cx('player-controls')}>
                <div className={cx('song-info')}>
                    {currentSong && (
                        <>
                            <h3>{currentSong.title}</h3>
                            <p>{currentSong.artist_info.name}</p>
                        </>
                    )}
                </div>
                <div className={cx('progress-wrap')}>
                    <div className={cx('main-controls')}>
                        <div className={cx('control-btn')}>
                            <button onClick={playPrev} className={cx('faBackwardStep')}>
                                <FontAwesomeIcon size="2x" color="#ffffff" icon={faBackwardStep} />
                            </button>
                        </div>

                        <div className={cx('play-btn')} onClick={togglePlay}>
                            <button>
                                {isPlaying ? (
                                    <FontAwesomeIcon className={cx('faPause')} icon={faPause} />
                                ) : (
                                    <FontAwesomeIcon className={cx('faPlay')} icon={faPlay} />
                                )}
                            </button>
                        </div>

                        <div className={cx('control-btn')}>
                            <button onClick={playNext} className={cx('faForwardStep')}>
                                <FontAwesomeIcon size="2x" color="#ffffff" icon={faForwardStep} />
                            </button>
                        </div>
                    </div>
                    <div className={cx('progress-container')}>
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className={cx('progress-bar')}
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className={cx('volume-control')}>
                    <FontAwesomeIcon color="#ffffff" icon={faVolumeUp} />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className={cx('volume-slider')}
                    />
                </div>
            </div>

            {/* Playlist */}
            <div className={cx('playlist')}>
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className={cx('playlist-item', { active: currentSong?.id === song.id })}
                        onClick={() => selectSong(song)}
                    >
                        <div className={cx('song-details')}>
                            <h4>{song.title}</h4>
                            <p>
                                {song.artist_info.name} • {formatTime(song.duration)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicCard;
