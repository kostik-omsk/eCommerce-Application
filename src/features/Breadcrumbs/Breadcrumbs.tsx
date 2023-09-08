import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeTwoTone } from '@ant-design/icons';
import type { CategoryTreeNode } from '@shared/api/categories/';
import styles from './Breadcrumbs.module.css';

const getCategoryPath = (nodes: CategoryTreeNode[], key: string) => {
  let result = '';

  for (const node of nodes) {
    if (node.key === key) {
      result = node.path;
      return result;
    }

    if (node.children.length) {
      result = getCategoryPath(node.children, key);
      if (result) {
        break;
      }
    }
  }

  return result;
};

const getBreadcrumbItems = (nodes: CategoryTreeNode[], ID: string) => {
  return getCategoryPath(nodes, ID)
    .split(' / ')
    .map((item, index, arr) => {
      const [name, categoryId] = item.split(':');

      return {
        title: index === arr.length - 1 ? name : <Link to={categoryId ? `/catalog/${categoryId}` : ''}>{name}</Link>,
      };
    });
};

interface BreadcrumbsProps {
  id: string | undefined;
  tree: CategoryTreeNode[];
  loading: boolean;
}

interface BreadcrumbItem {
  title: JSX.Element | string;
}

const Breadcrumbs = ({ id, tree, loading }: BreadcrumbsProps) => {
  const items: BreadcrumbItem[] = id ? getBreadcrumbItems(tree, id) : [];

  return (
    <>
      <Breadcrumb
        className={loading ? styles.disabled : styles.breadcrumb}
        items={[
          {
            title: items.length ? (
              <Link to={'/catalog'}>Catalog</Link>
            ) : (
              <>
                <Link to={'/'}>
                  <HomeTwoTone />
                </Link>
                <span className={styles.disabled}> / Catalog</span>
              </>
            ),
          },
          ...items,
        ]}
      />
    </>
  );
};

export { Breadcrumbs };
