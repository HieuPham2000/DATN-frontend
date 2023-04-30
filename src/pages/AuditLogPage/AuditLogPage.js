import styles from './AuditLogPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AuditLogPage() {
    return (
        <div className={cx('wrapper')}>
            <h1>AuditLogPage page</h1>
        </div>
    );
}

export default AuditLogPage;
