import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
    return (
        <div className={cx('wrapper')}>
            <h1>Dashboard page</h1>
        </div>
    );
}

export default Dashboard;
