import {
    LibraryBooksTwoTone as DictionaryIcon,
    DashboardTwoTone as DashboardIcon,
    CategoryTwoTone as ConceptIcon,
    StickyNote2TwoTone as ExampleIcon,
    SearchTwoTone as SearchIcon,
    AccountTreeTwoTone as TreeIcon,
} from '@mui/icons-material';

const menuList = [
    {
        text: 'Dictionary',
        icon: DictionaryIcon,
        link: '/dictionary',
    },
    {
        text: 'Dashboard',
        icon: DashboardIcon,
        link: '/dashboard',
        default: true
    },
    {
        text: 'Concept',
        icon: ConceptIcon,
        link: '/concept',
    },
    {
        text: 'Example',
        icon: ExampleIcon,
        link: '/example',
    },
    {
        text: 'Search',
        icon: SearchIcon,
        link: '/search',
    },
    {
        text: 'Tree',
        icon: TreeIcon,
        link: '/tree',
    },
];

export default menuList;
