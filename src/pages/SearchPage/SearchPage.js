import { Helmet } from 'react-helmet-async';
import styles from './SearchPage.module.scss';
import classNames from 'classnames/bind';
import { Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Hub as SearchConceptIcon, StickyNote2 as SearchExampleIcon } from '@mui/icons-material';
import SearchExampleTab from '~/components/SearchPage/SearchExampleTab';
import SearchConceptAssociationTab from '~/components/SearchPage/SearchConceptAssociationTab';
import useLocalStorage from '~/hooks/useLocalStorage';

const cx = classNames.bind(styles);

function SearchPage() {
    const [value, setValue] = useLocalStorage('searchTab', 'example');
    // const [value, setValue] = useState('example');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Search | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">Search</Typography>
            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label="Account settings tab" variant="scrollable">
                    <Tab
                        label="Search Example"
                        value="example"
                        icon={<SearchExampleIcon />}
                        iconPosition="start"
                        className={cx('tab-title')}
                    />
                    <Tab
                        label="Search Concept Association"
                        value="concept"
                        icon={<SearchConceptIcon />}
                        iconPosition="start"
                        className={cx('tab-title')}
                    />
                </TabList>
                <TabPanel value="example" sx={{ px: 0, py: 1 }}>
                    <SearchExampleTab />
                </TabPanel>
                <TabPanel value="concept" sx={{ px: 0, py: 1 }}>
                    <SearchConceptAssociationTab />
                </TabPanel>
            </TabContext>
        </div>
    );
}

export default SearchPage;
