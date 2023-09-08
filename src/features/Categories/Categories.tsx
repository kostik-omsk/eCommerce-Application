import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Tree } from 'antd';
import type { Key } from 'rc-tree/lib/interface';
import { DownOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { type CategoryTreeNode } from '@shared/api/categories/';
import style from './Categories.module.css';
interface CategoriesProps {
  loading: boolean;
  id: string | undefined;
  tree: CategoryTreeNode[];
}

const Categories = ({ loading, id, tree }: CategoriesProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const width = window.innerWidth;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (selected: Key[]) => {
    if (selected.length) {
      navigate(`/catalog/${selected[0]}`);
    }

    if (width < 768) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className={style.categories}>
        <button className={style.categoriesBtn} onClick={showDrawer}>
          <MenuUnfoldOutlined style={{ marginRight: '10px' }} /> Catalog
        </button>
      </div>
      <Drawer title="Catalog" placement="left" onClose={onClose} open={open}>
        <Tree
          disabled={loading}
          selectedKeys={id ? [id] : undefined}
          defaultExpandedKeys={id ? [id] : undefined}
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={onChange}
          treeData={tree}
        />
      </Drawer>
    </>
  );
};

export { Categories };
