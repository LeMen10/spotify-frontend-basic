import { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import styles from './Login.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import images from '~/assets/images/images';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = className.bind(styles);

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            toastCustom('You are already logged in.');
            setTimeout(() => {
                navigate('/');
            }, 4000);
        }
    }, [navigate]);

    const toastCustom = (message) => {
        toast.warn(message, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        const data = { username, password };
        axios
            .post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, data)
            .then((res) => {
                Cookies.set('token', res.data.token);
                const { token, ...userData } = res.data;
                localStorage.setItem('user', JSON.stringify(userData));
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/');
                }, 3000);
            })
            .catch((error) => {
                const err = error.response.data.error;
                if (err === 'Invalid username or password') toastCustom('Invalid username or password');
            });
    };

    return (
        <Fragment>
            <ToastContainer
                position="top-right"
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {isLoading ? (
                <div className={cx('spinner-wr')}>
                    <div className={cx('spinner')}></div>
                </div>
            ) : (
                <div className={cx('modal', 'js-modal-login')}>
                    <div className={cx('modal__overlay')}>
                        <img style={{ width: '100%', height: '100%' }} src={images.f8Login} alt="" />
                    </div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container', 'js-modal-container-login')}>
                                <div className={cx('auth-form__header')}>
                                    <h3 className={cx('auth-form__heading')}>Login</h3>
                                    <Link to={'/register'} className={cx('auth-form__switch-btn', 'js-register')}>
                                        Register
                                    </Link>
                                </div>

                                <div className={cx('auth-form__form')}>
                                    <div className={cx('auth-form__group')}>
                                        <div className={cx('with-46')}>
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                name="username"
                                                className={cx('auth-form__input')}
                                                id="auth-form__user-login"
                                                value={username}
                                                onChange={(e) => setUserName(e.target.value)}
                                            />
                                        </div>
                                        <div className={cx('with-46')}>
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                className={cx('auth-form__input')}
                                                id="auth-form__password-login"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('auth-form__aside')}>
                                    <p className={cx('auth-form__help')}>
                                        <Link
                                            to={'/forgot_password'}
                                            className={cx('auth-form__help-link', 'auth-form__help-forgot')}
                                        >
                                            Forgot password?
                                        </Link>
                                        <span className={cx('auth-form__help-separate')}></span>
                                        <Link to={''} href="" className={cx('auth-form__help-link')}>
                                            Need help?
                                        </Link>
                                    </p>
                                </div>

                                <div className={cx('auth-form__control')}>
                                    <button
                                        value="login"
                                        className={cx('btn', 'btn--primary', 'view-cart')}
                                        onClick={handleSubmit}
                                        disabled={!username || !password}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Login;
