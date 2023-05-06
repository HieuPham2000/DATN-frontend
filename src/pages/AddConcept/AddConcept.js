import styles from './AddConcept.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AddConcept() {
    return (
        <div className={cx('wrapper')}>
            <h1>Add Concept page</h1>
        </div>
    );
}

export default AddConcept;
