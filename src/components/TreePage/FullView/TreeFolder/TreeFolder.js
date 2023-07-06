import { memo } from 'react';
import { ListItemButton, Paper, Tooltip, Typography, alpha } from '@mui/material';
import { stylePaper, styleTreeItem, textEllipsisText } from '~/utils/style/muiCustomStyle';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { TreeItem, TreeView } from '@mui/lab';
import { Enum } from '~/utils/common/enumeration';

function TreeFolder({ treeData, onClickFolder, selectedNode, setSelectedNode }) {
    const handleClickRootFolder = () => {
        onClickFolder(Enum.TreeFolderType.Root);
        setSelectedNode(null);
    };

    const handleClickParentFolder = () => {
        onClickFolder(Enum.TreeFolderType.Parent);
    };

    const handleClickChildrenFolder = () => {
        onClickFolder(Enum.TreeFolderType.Children);
    };

    const handleClickExampleFolder = (exampleLinkId) => {
        onClickFolder(Enum.TreeFolderType.Example, { exampleLinkId });
    };

    return (
        <Paper sx={{ ...stylePaper, p: 2, mt: 2 }}>
            <ListItemButton
                sx={{
                    pb: 1,
                    borderBottom: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
                    maxWidth: 200,
                    overflow: 'hidden',
                }}
                onClick={handleClickRootFolder}
                selected={selectedNode === null || selectedNode === 'root'}
            >
                <Tooltip title={treeData.Concept?.Title}>
                    <Typography fontWeight="500" sx={textEllipsisText}>
                        Root concept:{' '}
                        <Typography color="primary" fontWeight="500" component="span">
                            {treeData.Concept?.Title}
                        </Typography>
                    </Typography>
                </Tooltip>
            </ListItemButton>

            <TreeView
                aria-label="Root concept folder"
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
                sx={{ minHeight: 200, maxHeight: 320, flexGrow: 1, width: 200, overflowY: 'auto' }}
                selected={selectedNode}
                onNodeSelect={(_, nodeId) => setSelectedNode(nodeId)}
            >
                <TreeItem
                    nodeId="1"
                    label={`Parents (${treeData.ListParent?.length || 0})`}
                    sx={styleTreeItem}
                    onClick={handleClickParentFolder}
                ></TreeItem>
                <TreeItem
                    nodeId="2"
                    label={`Children (${treeData.ListChildren?.length || 0})`}
                    sx={styleTreeItem}
                    onClick={handleClickChildrenFolder}
                ></TreeItem>
                <TreeItem nodeId="3" label={`Example (${treeData.ListExample?.length || 0})`} sx={styleTreeItem}>
                    {treeData.ListCountExampleLink?.filter((x) => x.Count > 0).map((x, i) => (
                        <TreeItem
                            key={i}
                            nodeId={4 + i + ''}
                            label={`${x.ExampleLinkName} (${x.Count || 0})`}
                            sx={styleTreeItem}
                            onClick={() => handleClickExampleFolder(x.ExampleLinkId)}
                        ></TreeItem>
                    ))}
                </TreeItem>
            </TreeView>
        </Paper>
    );
}

export default memo(TreeFolder);
