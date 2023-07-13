import {
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import classNames from 'classnames/bind';
import styles from './FeedbackDialog.module.scss';
import {
    BugReportTwoTone as BugReport,
    Close,
    RateReviewTwoTone as RateReview,
    SentimentSatisfiedAltTwoTone as SentimentSatisfiedAlt,
} from '@mui/icons-material';

const cx = classNames.bind(styles);
const email = process.env.REACT_APP_EMAIL_SUPPORT || 'hieu.pt183535@gmail.com';

function FeedbackDialog({ open, onClose, userEmail }) {
    const handleFeedbackImprovement = () => {
        let subject = '[Feedback][App improvement] HUST PVO feedback',
            body = `# Account information:
- User email: ${userEmail}

# List and describe your feedback to improve the web application (functionality, user interface, user experience,...):
- 
- 
- 
...

# Attach description file (image, video,...) (if available)

`;
        let mailTo = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
        window.location.href = mailTo;
    };

    const handleFeedbackBug = () => {
        let subject = '[Feedback][Bug report] HUST PVO feedback',
            body = `# Account information:
- User email: ${userEmail}

# Briefly describe the problem you found on the web application
- Problem: 
- The time period when the problem occurred: 

# Describe the specifics of the problem (on which screen, what function, usage flow,...)
- Screen: 
- Function: 
- Usage flow: 
- Expected results: 
- Actual results: 
...

# Attach error description file (image, video,...) (if available)

`;
        let mailTo = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
        window.location.href = mailTo;
    };

    const handleFeedbackOther = () => {
        let subject = '[Feedback][Other] HUST PVO feedback',
            body = `# Account information:
- User email: ${userEmail}

# Describe your feedback:
- 
- 
- 
...

# Attach description file (image, video,...) (if available)

`;
        let mailTo = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
        window.location.href = mailTo;
    };

    return (
        <Dialog open={open} className={cx('wrapper-feedback-dialog')}>
            <DialogTitle>
                <span>Feedback</span>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <div className={cx('instruction')}>
                <Typography variant="body">Click to send feedback email</Typography>
            </div>
            <List sx={{ pt: 0 }}>
                <ListItem disableGutters>
                    <ListItemButton onClick={handleFeedbackImprovement}>
                        <ListItemIcon>
                            <SentimentSatisfiedAlt />
                        </ListItemIcon>
                        <ListItemText primary="Feedback for app improvement" />
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton onClick={handleFeedbackBug}>
                        <ListItemIcon>
                            <BugReport />
                        </ListItemIcon>
                        <ListItemText primary="Report a problem" />
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton onClick={handleFeedbackOther}>
                        <ListItemIcon>
                            <RateReview />
                        </ListItemIcon>
                        <ListItemText primary="Other" />
                    </ListItemButton>
                </ListItem>
            </List>
            <div className={cx('note')}>
                <Typography variant="body2" color="text.secondary">
                    Thank you for taking the time to provide feedback. While we don't respond to every report, we will
                    let you know if we need more details.
                </Typography>
            </div>
        </Dialog>
    );
}

export default FeedbackDialog;
