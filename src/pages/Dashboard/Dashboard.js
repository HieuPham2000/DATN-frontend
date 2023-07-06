import { Grid, Paper, Typography } from '@mui/material';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getNumberRecord } from '~/services/dictionaryService';
import { Category as ConceptIcon, StickyNote2 as ExampleIcon } from '@mui/icons-material';
import { useMemo } from 'react';
import numeral from 'numeral';
import { FormatThousand } from '~/utils/common/config';
import MostRecentConcept from '~/components/Dashboard/MostRecentConcept';
import MostRecentExample from '~/components/Dashboard/MostRecentExample';

const cx = classNames.bind(styles);

function Dashboard() {
    const { data: numberRecord } = useQuery({
        queryKey: ['numberRecord'],
        queryFn: async () => {
            const res = await getNumberRecord();
            return res.data.Data;
        },
    });

    const numberConcept = useMemo(() => numberRecord?.NumberConcept ?? 0, [numberRecord]);
    const numberExample = useMemo(() => numberRecord?.NumberExample ?? 0, [numberRecord]);

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Dashboard | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">Dashboard</Typography>
            <div className={cx('content-wrapper')}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Paper className={cx('card-number-record', 'number-concept')}>
                            <div className={cx('card-content')}>
                                <Typography variant="h2" className={cx('card-number')}>
                                    {numeral(numberConcept).format(FormatThousand)}
                                </Typography>
                                <Typography variant="h5" className={cx('card-text')}>
                                    Concept(s)
                                </Typography>
                            </div>
                            <div>
                                <ConceptIcon style={{ fontSize: 120 }} className={cx('ic-concept')} />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={cx('card-number-record', 'number-example')}>
                            <div className={cx('card-content')}>
                                <Typography variant="h2" className={cx('card-number')}>
                                    {numeral(numberExample).format(FormatThousand)}
                                </Typography>
                                <Typography variant="h5" className={cx('card-text')}>
                                    Example(s)
                                </Typography>
                            </div>
                            <div>
                                <ExampleIcon style={{ fontSize: 120 }} className={cx('ic-example')} />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <MostRecentConcept />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <MostRecentExample />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default Dashboard;
