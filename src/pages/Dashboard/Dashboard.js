import { Card, CardContent, CardHeader, Grid, Paper, Typography } from '@mui/material';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
    return (
        <div className={cx('wrapper')}>
            <Typography variant="h4">Dashboard</Typography>
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper className={cx('box')}>variable width content</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardHeader title="Number of examples"></CardHeader>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                                    ranging across all continents except Antarctica
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default Dashboard;
