import styles from './AddExample.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AddExample() {
    return (
        <div className={cx('wrapper')}>
            <h1>Add Example page</h1>
        </div>
    );
}

export default AddExample;
