import styles from './SearchPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SearchPage() {
    return (
        <div className={cx('wrapper')}>
            <h1>SearchPage page</h1>
        </div>
    );
}

export default SearchPage;
