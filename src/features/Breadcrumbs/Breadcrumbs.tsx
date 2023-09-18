import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeTwoTone } from '@ant-design/icons';
import type { CategoryTreeNode } from '@shared/api/categories/';
import styles from './Breadcrumbs.module.css';

const getCategoryPath = (nodes: CategoryTreeNode[], key: string) => {
  let result = '';

  for (const node of nodes) {
    if (node.key === key && !node.children.length) {
      const paths = node.path.split(' / ');
      const target = paths.at(-1) + ':' + node.key;

      result = paths.slice(0, -1).concat([target]).join(' / ');
      return result;
    }

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

const getBreadcrumbItems = (nodes: CategoryTreeNode[], ID: string, includeLast: boolean) => {
  return getCategoryPath(nodes, ID)
    .split(' / ')
    .map((item, index, arr) => {
      const [name, categoryId] = item.split(':');

      const isLast = index === arr.length - 1;

      if (includeLast && isLast) {
        return {
          title: <Link to={categoryId ? `/catalog/${categoryId}` : ''}>{name}</Link>,
        };
      }

      return {
        title: isLast ? name : <Link to={categoryId ? `/catalog/${categoryId}` : ''}>{name}</Link>,
      };
    });
};

interface BreadcrumbsProps {
  id: string | undefined;
  tree: CategoryTreeNode[];
  loading: boolean;
  includeLast: boolean;
}

interface BreadcrumbItem {
  title: JSX.Element | string;
}

const Breadcrumbs = ({ id, tree, loading, includeLast }: BreadcrumbsProps) => {
  const items: BreadcrumbItem[] = id ? getBreadcrumbItems(tree, id, includeLast) : [];

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
                {includeLast ? null : (
                  <>
                    <Link to={'/'}>
                      <HomeTwoTone />
                    </Link>
                    <span className={styles.disabled}> / Catalog</span>
                  </>
                )}
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
