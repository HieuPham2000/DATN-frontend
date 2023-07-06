export const stylePaper = {
    backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#fff' : '#212b36'),
    boxShadow: (theme) =>
        theme.palette.mode === 'light'
            ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
            : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
    zIndex: 0,
    backgroundImage: 'none',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
};

export const textEllipsisText = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

export const styleTreeItem = {
    '& .MuiTreeItem-label': {
        py: 0.5,
    },
};
