import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './MusicCard.module.scss';
import { faPause, faPlay, faBackwardStep, faForwardStep, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressBar from './ProgressBar';
import * as request from '~/utils/request';

const cx = classNames.bind(styles);

const MusicCard = ({ songs, onSongChange }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.6);
    const audioRef = useRef(null);
    console.log(songs);

    useEffect(() => {
        if (songs.length > 0) {
            setCurrentSong(songs[0]);
            setIsPlaying(true);
        } else {
            setCurrentSong(null);
            setIsPlaying(false);
        }
    }, [songs]);

    useEffect(() => {
        if (currentSong && onSongChange) {
            onSongChange(currentSong);
        }
    }, [currentSong, onSongChange]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((e) => {
                        console.error('Play failed:', e);
                        setIsPlaying(false);
                    });
            }
        }
    }, [isPlaying]);

    const playNext = useCallback(() => {
        if (!songs.length || !currentSong) return;

        const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentSong(songs[nextIndex]);
        setIsPlaying(true);
    }, [songs, currentSong]);

    const playPrev = useCallback(() => {
        if (!songs.length) return;
        const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setCurrentSong(songs[prevIndex]);
        setIsPlaying(true);
    }, [songs, currentSong]);

    const handleSeek = useCallback((e) => {
        const newTime = parseFloat(e.target.value);
        if (!audioRef.current) return;
        audioRef.current.currentTime = newTime;
    }, []);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseFloat(e.target.value);
        if (!audioRef.current) return;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    }, []);

    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;
        audio.src = currentSong.audio_url;
        audio.load();
        // setCurrentTime(0);

        const onLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        return () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [currentSong]);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const onCanPlay = () => {
            if (isPlaying) {
                audio.play().catch((e) => {
                    console.error('Error playing audio:', e);
                    setIsPlaying(false);
                });
            }
        };

        audio.addEventListener('canplay', onCanPlay);
        return () => {
            audio.removeEventListener('canplay', onCanPlay);
        };
    }, [isPlaying]);

    const handleSongEnd = useCallback(async () => {
        if (currentSong) {
            try {
                await request.post(`/api/songs/${currentSong.id}/increase-play-count`);
            } catch (error) {
                console.error('Failed to increase play count:', error);
            }
        }
        playNext();
    }, [currentSong, playNext]);

    return (
        <div className={cx('music-player')}>
            <audio ref={audioRef} src={currentSong?.audio_url} onEnded={handleSongEnd} />

            <div className={cx('player-controls')}>
                <div className={cx('song-info-wr')}>
                    {currentSong ? (
                        <>
                            <img
                                className={cx('cover-image')}
                                src={currentSong.image || '/default-music-cover.png'}
                                alt={currentSong.title}
                                onError={(e) => {
                                    e.target.src = '/default-music-cover.png';
                                }}
                            />
                            <div className={cx('song-info')}>
                                <h3>{currentSong.title}</h3>
                                <p>{currentSong.artist_info?.name || 'Unknown Artist'}</p>
                            </div>
                        </>
                    ) : (
                        <p>Hãy chọn nội dung để nghe!</p>
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

                    <ProgressBar duration={duration} onSeek={handleSeek} audioRef={audioRef} />
                </div>

                <div className={cx('volume-control')}>
                    <FontAwesomeIcon icon={faVolumeUp} color="#ffffff" />
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
        </div>
    );
};

export default MusicCard;
