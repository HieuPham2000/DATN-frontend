import styles from './DictionaryPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DictionaryPage() {
    return (
        <div className={cx('wrapper')}>
            <h1>DictionaryPage page</h1>
        </div>
    );
}

export default DictionaryPage;
