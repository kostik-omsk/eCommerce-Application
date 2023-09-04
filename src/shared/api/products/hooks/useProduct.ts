import { useMemo } from 'react';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';
// import { Product } from '@commercetools/platform-sdk';

// const mapProduct = (product: Product | null) => {
//   if (product) {
//     const id = product.id;
//     const title = product.masterData.current.name.en;
//     const description = product.masterData.current.metaDescription?.en || null;
//     const price = product.masterData.current.price;
//     const discount = price?.discounted;
//     const urlImg = product.masterVariant.images ? product.masterVariant.images[0].url : '';
//     let displayedPrice = null;
//     let displayedDiscount = null;
//     if (price) {
//       displayedPrice = price.value.centAmount / Math.pow(10, price.value.fractionDigits);
//     }
//     if (price && discount) {
//       displayedDiscount = discount.value.centAmount / Math.pow(10, price.value.fractionDigits);
//     }
//     return {
//       id: id,
//       title: title,
//       description: description,
//       price: displayedPrice,
//       discount: displayedDiscount,
//       urlImg: urlImg,
//     };
//   }

//   return null;
// };

const useProduct = (id: string | undefined) => {
  const request = useMemo(
    () =>
      id
        ? ApiClient.getInstance()
            .requestBuilder.products()
            .withId({ ID: id })
            .get({
              queryArgs: {
                priceCurrency: import.meta.env.VITE_CTP_DEFAULT_CURRENCY,
              },
            })
        : null,
    [id]
  );

  const { data, error, loading } = useApiRequest(request);

  return {
    product: data, // mapProduct(data)
    error,
    loading,
  };
};

export { useProduct };
