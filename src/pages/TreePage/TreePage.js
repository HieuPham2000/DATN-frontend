import { Outlet } from 'react-router-dom';
import styles from './TreePage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function TreePage() {
    return (
        <div className={cx('wrapper')}>
            <h1>TreePage page</h1>
        </div>
    );
}

export default TreePage;
