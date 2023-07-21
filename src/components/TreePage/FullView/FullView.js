import { memo, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './FullView.module.scss';
import TreeFolder from '~/components/TreePage/FullView/TreeFolder';
import { Enum } from '~/utils/common/enumeration';
import GridConceptRelation from '~/components/TreePage/FullView/GridConceptRelation';
import ExampleFolderContent from '~/components/TreePage/FullView/ExampleFolderContent';
import { useQuery } from '@tanstack/react-query';
import ConceptFolderContent from '~/components/TreePage/FullView/ConceptFolderContent';
import { getTree } from '~/services/treeService';
import Loading from '~/components/Loading';
// import { Box } from '@mui/material';
// import searchImg from '~/assets/images/search.svg';

const cx = classNames.bind(styles);

function FullView({ rootConcept, setRootConcept }) {
    // const queryClient = useQueryClient();
    const [selectedExampleLinkId, setSelectedExampleLinkId] = useState(null);
    const [folderType, setFolderType] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        setSelectedNode(null);
    }, [rootConcept]);

    useEffect(() => {
        if (selectedNode === null) {
            setFolderType(Enum.TreeFolderType.Root);
        }
    }, [selectedNode]);

    const { data: treeData, isLoading } = useQuery({
        queryKey: ['getTree', rootConcept?.ConceptId],
        queryFn: async () => {
            const res = await getTree(rootConcept?.ConceptId);
            return res.data.Data;
        },
        enabled: !!rootConcept?.ConceptId,
    });

    const handleClickConcept = (concept) => {
        setRootConcept(concept);
    };

    const handleClickFolder = useCallback((type, param) => {
        setFolderType(type);
        if (type === Enum.TreeFolderType.Example && param && param.exampleLinkId) {
            setSelectedExampleLinkId(param.exampleLinkId);
        } else {
            setSelectedExampleLinkId(null);
        }
    }, []);

    if (!rootConcept || !treeData) {
        if (isLoading) {
            return <Loading />;
        }
        return (
            <>
                {/* <Box className={cx('img-wrapper')}>
                    <img src={searchImg} alt="search" className={cx('img-no-data')} />
                </Box> */}
            </>
        );
    }

    return (
        <>
            <div className={cx('main-wrapper')}>
                <div className={cx('left-wrapper')}>
                    <TreeFolder
                        treeData={treeData}
                        onClickFolder={handleClickFolder}
                        selectedNode={selectedNode}
                        setSelectedNode={setSelectedNode}
                    />
                </div>
                <div className={cx('right-wrapper')}>
                    {(!folderType || folderType === Enum.TreeFolderType.Root) && (
                        <GridConceptRelation
                            rootConcept={treeData?.Concept}
                            tmpRootConcept={treeData?.Concept}
                            listChildren={treeData?.ListChildren || []}
                            listParent={treeData?.ListParent || []}
                            onClickConcept={handleClickConcept}
                        />
                    )}
                    {folderType === Enum.TreeFolderType.Parent && (
                        <ConceptFolderContent
                            label="Parents"
                            rootTreeData={treeData}
                            listFile={treeData?.ListParent || []}
                            onClickConcept={handleClickConcept}
                        />
                    )}
                    {folderType === Enum.TreeFolderType.Children && (
                        <ConceptFolderContent
                            label="Children"
                            rootTreeData={treeData}
                            listFile={treeData?.ListChildren || []}
                            onClickConcept={handleClickConcept}
                        />
                    )}
                    {folderType === Enum.TreeFolderType.Example && (
                        <ExampleFolderContent
                            rootConceptId={treeData?.Concept?.ConceptId}
                            exampleLinkId={selectedExampleLinkId}
                            setSelectedNode={setSelectedNode}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(FullView);
