import { Category, CategoryReference } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';

interface CategoryTreeNode {
  key: string; // id
  title: string; // name
  parent: string | null;
  path: string;
  children: CategoryTreeNode[];
}

type CategoriesTreeNodesRecord = Record<string, CategoryTreeNode>;

const getFullPath = (category: Category, categories: Category[], separator = ' / ') => {
  let result = category.name.en;
  let root: Category | undefined;

  if (!category.parent) return result;

  let current: CategoryReference | undefined = category.parent;

  while (current) {
    if (current.obj) {
      result += separator + current.obj.name.en + ':' + current.obj.id;

      current = current.obj.parent;
    } else {
      const id = current.id;

      root = categories.find((item) => item.id === id);

      current = undefined;
    }
  }

  if (root) {
    result += separator + root.name.en + ':' + root.id;
  }

  return result.split(separator).reverse().join(separator);
};

const mapCategories = (categories: Category[]): CategoriesTreeNodesRecord => {
  return categories
    .map((category) => {
      return {
        key: category.id,
        title: category.name.en,
        parent: category.parent?.id || null,
        path: getFullPath(category, categories),
        children: [],
      };
    })
    .reduce(
      (acc, node) => ({
        ...acc,
        [node.key]: node,
      }),
      {} as CategoriesTreeNodesRecord
    );
};

const getCategoriesTree = (categories: CategoriesTreeNodesRecord) => {
  const tree: CategoryTreeNode[] = [];

  for (const value in categories) {
    const node = categories[value];
    const parent = node.parent;

    if (parent) {
      categories[parent].children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
};

const request = ApiClient.getInstance()
  .requestBuilder.categories()
  .get({
    queryArgs: {
      limit: 500,
      expand: ['parent'],
    },
  });

// todo: add id param
const useCategories = () => {
  const { data, error, loading } = useApiRequest(request);

  return {
    categoriesTree: getCategoriesTree(mapCategories((data && data.results) || [])),
    error,
    loading,
  };
};

export { useCategories, type CategoryTreeNode };
