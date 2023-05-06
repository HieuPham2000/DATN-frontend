import styles from './UserSettingPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function UserSettingPage() {
    return (
        <div className={cx('wrapper')}>
            <h1>UserSettingPage page</h1>
        </div>
    );
}

export default UserSettingPage;
