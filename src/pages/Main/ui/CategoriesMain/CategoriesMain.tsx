// import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@shared/api/categories';
// import electronics from '@assets/еlectronics.png';
// import tools from '@assets/tools.png';
// import children from '@assets/family.png';
import style from './CategoriesMain.module.css';

// interface CategoriesImg {
//   [key: string]: string;
// }

// const categoryImages: CategoriesImg = {
//   Electronics: electronics,
//   'Construction and repair': tools,
//   'For children': children,
// };

export const CategoriesMain = () => {
  const navigate = useNavigate();
  const { categoriesTree } = useCategories();
  const clickOnCategories = (key: string) => {
    navigate(`/catalog/${key}`);
  };

  return (
    <div className={style.categories}>
      {categoriesTree &&
        categoriesTree.map((categorie) => (
          <div
            className={style.card}
            key={categorie.key}
            onClick={() => {
              clickOnCategories(categorie.key);
            }}
          >
            {/* <Avatar size={44} shape="square" src={categoryImages[categorie.title]} /> */}
            <h3>{categorie.title}</h3>
          </div>
        ))}
    </div>
  );
};
