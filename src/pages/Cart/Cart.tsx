import { ChangeEventHandler, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, InputNumber, Input, Image, message, Tooltip, Popconfirm } from 'antd';
import { debounce } from 'lodash';
import { ApiClient } from '@shared/api/core';
import { EuroCircleOutlined, PercentageOutlined, SafetyOutlined } from '@ant-design/icons';
import { LineItem, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { useCart } from './useCart';
import './cart.css';

export const Cart = () => {
  const { cart, initCart, getCurrentCart } = useCart();
  const [crementEnable, setCrementButtonsState] = useState(false);

  const apiClient = ApiClient.getInstance();

  // console.log('cart', cart);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  function successMessage(result: 'success' | 'error', errorMessage: string): void {
    messageApi.open({
      type: result,
      content: errorMessage,
      duration: 2,
    });
  }

  function tooltipText() {
    return "It won't work ;)";
  }

  function clearCartAll() {
    if (cart) {
      const itemsKeysArray = cart.lineItems.map((item) => item.id);
      const actionsArray = itemsKeysArray.map((productId) => {
        if (productId) {
          return {
            action: 'changeLineItemQuantity',
            lineItemId: productId,
            quantity: 0,
          };
        }
      });

      apiClient.requestBuilder
        .me()
        .carts()
        .withId({
          ID: cart.id,
        })
        .post({
          body: {
            version: cart.version,
            actions: actionsArray as MyCartUpdateAction[],
          },
        })
        .execute()
        .then(() => {
          initCart();
        })
        .catch((error) => {
          successMessage('error', error.message);
        });
    }
  }

  const [promocode, setPromocode] = useState('');
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target) {
      setPromocode(event.target.value);
    }
  };

  async function applyPromocode() {
    if (cart) {
      // Применённые промокоды
      const appliedPromocodes = cart.discountCodes.map((code) => {
        return code.discountCode.id;
      });

      // Все рабочие промокоды
      const listOfPromodes: string[] = [];

      // Промокоды, которые ещё не использованы
      const listOfValidPromocodes = await apiClient.requestBuilder
        .discountCodes()
        .get()
        .execute()
        .then((response) => {
          return response.body.results.map((promocodesList) => {
            listOfPromodes.push(promocodesList.code);
            if (!appliedPromocodes.includes(promocodesList.id)) {
              return promocodesList.code;
            }
          });
        });

      // Если не применяли промокоды и пользователь вписал валидный промокод
      if (listOfValidPromocodes.includes(promocode) && appliedPromocodes.length === 0) {
        apiClient.requestBuilder
          .me()
          .carts()
          .withId({
            ID: cart.id,
          })
          .post({
            body: {
              version: cart.version,
              actions: [
                {
                  action: 'addDiscountCode',
                  // codes: promocode, 5EUROFF
                  code: promocode,
                },
              ],
            },
          })
          .execute()
          .then(() => {
            initCart();
            successMessage('success', 'Promocode applied successfully');
          })
          .catch((error) => {
            successMessage('error', error);
          });
      } else {
        // Если промокод не валиден
        if (!listOfPromodes.includes(promocode)) {
          successMessage('error', 'This is NOT a valid promocode');
        }
        // Если промокод валиден, но у нас уже применён другой промокод
        else if (appliedPromocodes.length > 0 && listOfValidPromocodes.includes(promocode)) {
          successMessage('error', 'You already applied another promocode. Remove it first');
        }
        // Если введённый промокод пытаются использовать повторно
        else if (listOfPromodes.includes(promocode)) {
          successMessage('error', 'This promocode was already applied');
        }
      }
    }
  }

  function removePromocode() {
    if (cart) {
      if (cart.discountCodes.length !== 0) {
        const actionsArray: MyCartUpdateAction[] = [];
        cart.discountCodes.map((code) => {
          actionsArray.push({
            action: 'removeDiscountCode',
            discountCode: {
              typeId: 'discount-code',
              id: code.discountCode.id,
            },
          });
        });

        apiClient.requestBuilder
          .me()
          .carts()
          .withId({
            ID: cart.id,
          })
          .post({
            body: {
              version: cart.version,
              actions: actionsArray,
            },
          })
          .execute()
          .then(() => {
            initCart();
            successMessage('success', 'Promocode removed successfully');
          })
          .catch((error) => {
            successMessage('error', error);
            console.error();
          });
      } else {
        successMessage('error', 'There are no cart promocodes applied');
      }
    }
  }

  // lineItems отвечает за количество предметов в корзине
  // key в body - Уникальный идентификатор корзины
  async function updateItemInCart(newCount: string, itemId: string, crements?: 'clicked') {
    const isNumber = +newCount;
    if (Number.isNaN(isNumber)) {
      successMessage('error', `Please provide correct input. Your input is not a number`);
    } else {
      if (isNumber > 999) {
        newCount = String(999);
        successMessage('error', `Mail us for wholesale purchases`);
      }
      const renewedCart = (await getCurrentCart()).data ? (await getCurrentCart()).data : cart;
      if (renewedCart) {
        apiClient.requestBuilder
          .me()
          .carts()
          .withId({
            ID: renewedCart.id,
          })
          .post({
            body: {
              version: renewedCart.version,
              actions: [
                {
                  action: 'changeLineItemQuantity',
                  lineItemId: itemId,
                  quantity: Number(newCount),
                },
                {
                  action: 'recalculate',
                  updateProductData: true,
                },
              ],
            },
          })
          .execute()
          .then(async () => {
            await initCart();
            if (crements === 'clicked') {
              setCrementButtonsState(false);
            }
          })
          .catch((error) => {
            successMessage('error', error.message);
            console.error(error);
          });
      }
    }
  }

  const debouncedInputNumberChanged = debounce((newNumber: string, goodsKey: string) => {
    updateItemInCart(newNumber, goodsKey);
    setCrementButtonsState(false);
  }, 500);

  function buttonWasClicked(event: EventTarget) {
    const htmlElement = event as HTMLButtonElement | HTMLSpanElement;
    if (htmlElement) {
      if (htmlElement.tagName === 'BUTTON') {
        if (htmlElement.previousSibling) {
          const inputParent = htmlElement.previousSibling as HTMLElement;
          const elementID = inputParent.children[1].children[0].children[0].id as string;
          updateItemInCart('0', elementID);
        }
      } else if (htmlElement.tagName === 'SPAN') {
        const inputParent = (htmlElement.parentElement as HTMLSpanElement).previousSibling as HTMLElement;
        const elementID = inputParent.children[1].children[0].children[0].id as string;
        updateItemInCart('0', elementID);
      }
    }
  }

  function inputNumberFocused() {
    setCrementButtonsState(true);
  }

  function crementItem(event: React.MouseEvent<HTMLElement, MouseEvent>, type: string) {
    setCrementButtonsState(true);

    const htmlElement = event.target as HTMLButtonElement | HTMLSpanElement;
    if (htmlElement) {
      if (htmlElement.tagName === 'BUTTON') {
        if (type === 'de') {
          const input = htmlElement.nextSibling?.firstChild?.firstChild as HTMLInputElement;
          updateItemInCart(String(+input.value - 1), input.id, 'clicked');
        } else if (type === 'en') {
          const input = htmlElement.previousSibling?.firstChild?.firstChild as HTMLInputElement;
          updateItemInCart(String(+input.value + 1), input.id, 'clicked');
        }
      } else if (htmlElement.tagName === 'SPAN') {
        if (type === 'de') {
          if (htmlElement.parentElement) {
            const input = htmlElement.parentElement.nextSibling?.firstChild?.firstChild as HTMLInputElement;
            updateItemInCart(String(+input.value - 1), input.id, 'clicked');
          }
        } else if (type === 'en') {
          if (htmlElement.parentElement) {
            const input = htmlElement.parentElement.previousSibling?.firstChild?.firstChild as HTMLInputElement;
            updateItemInCart(String(+input.value + 1), input.id, 'clicked');
          }
        }
      }
    }
  }

  function fillCartWithGoods(arrayOfGoods: LineItem[]) {
    const productsArray: JSX.Element[] = [];
    if (arrayOfGoods) {
      for (let i = 0; i < arrayOfGoods.length; i += 1) {
        const obj = arrayOfGoods[i];
        const image = obj.variant.images ? obj.variant.images[0].url : '';
        const attr1 = obj.variant.attributes ? obj.variant.attributes[0].value : null;
        const atrr2 = obj.variant.attributes ? obj.variant.attributes[2].value : null;
        const moreThanOneItem = obj.quantity > 1;
        const haveShopDiscount = obj.price.discounted;
        const havePromocode = obj.discountedPricePerQuantity.length !== 0;
        const itemPrice = obj.price.value.centAmount / 100;
        const shopDiscount = haveShopDiscount ? itemPrice - haveShopDiscount.value.centAmount / 100 : 0;
        const promocodeDiscount = havePromocode
          ? obj.discountedPricePerQuantity[0].discountedPrice.includedDiscounts[0].discountedAmount.centAmount / 100
          : 0;

        if (obj) {
          productsArray.push(
            <div className="cart-item-block" key={`card${i}`}>
              <Image src={image} className="cart-image" alt="product-image"></Image>
              <div className="cart-description">
                <div className="cart-name">
                  <NavLink className="product-link" to={`/product/${obj.productId}`}>
                    {obj.name.en}
                  </NavLink>
                </div>
                <div className="cart-card-description">
                  {attr1} | {atrr2}
                </div>
                <div className="card-price">
                  <div className="prices-block">
                    {!moreThanOneItem ? (
                      // Если один товар
                      <>
                        <div>
                          Single item price: {itemPrice.toFixed(2)} <EuroCircleOutlined />
                        </div>
                        {haveShopDiscount ? (
                          <div>
                            <PercentageOutlined /> Shop discount is {shopDiscount.toFixed(2)} <EuroCircleOutlined />
                          </div>
                        ) : null}
                        {havePromocode ? (
                          <div>
                            <PercentageOutlined /> Promocode discount is {promocodeDiscount.toFixed(2)}{' '}
                            <EuroCircleOutlined />
                          </div>
                        ) : null}
                        {haveShopDiscount && havePromocode ? (
                          <div>
                            Total discounts are {(shopDiscount + promocodeDiscount).toFixed(2)} <EuroCircleOutlined />
                          </div>
                        ) : null}
                        {haveShopDiscount || havePromocode ? (
                          <div className="boldText">
                            Total price for this item is <span className="outlined">{itemPrice.toFixed(2)}</span>{' '}
                            {(obj.totalPrice.centAmount / 100).toFixed(2)} <EuroCircleOutlined />
                          </div>
                        ) : null}
                      </>
                    ) : (
                      // Если более одного товара
                      <>
                        <div>
                          Single item price: {itemPrice.toFixed(2)} <EuroCircleOutlined />
                        </div>
                        {havePromocode || haveShopDiscount ? (
                          <div>
                            Single item price with discounts: <span className="outlined">{itemPrice.toFixed(2)}</span>
                            <span>
                              {' '}
                              {(itemPrice - shopDiscount - promocodeDiscount).toFixed(2)} <EuroCircleOutlined />
                            </span>
                          </div>
                        ) : null}

                        <div>
                          Total price without discounts: {(itemPrice * obj.quantity).toFixed(2)} <EuroCircleOutlined />
                        </div>
                        {haveShopDiscount ? (
                          <div>
                            <PercentageOutlined /> Total shop discount is {(shopDiscount * obj.quantity).toFixed(2)}{' '}
                            <EuroCircleOutlined />{' '}
                          </div>
                        ) : null}
                        {havePromocode ? (
                          <div>
                            <PercentageOutlined /> Total promocode discount is{' '}
                            {(promocodeDiscount * obj.discountedPricePerQuantity[0].quantity).toFixed(2)}{' '}
                            <EuroCircleOutlined />
                          </div>
                        ) : null}
                        {havePromocode && haveShopDiscount ? (
                          <div>
                            Total discounts are{' '}
                            {(
                              shopDiscount * obj.quantity +
                              promocodeDiscount * obj.discountedPricePerQuantity[0].quantity
                            ).toFixed(2)}{' '}
                            <EuroCircleOutlined />
                          </div>
                        ) : null}
                        {havePromocode || haveShopDiscount ? (
                          <div className="boldText">
                            Total price for all items:{' '}
                            <span className="outlined">{(itemPrice * obj.quantity).toFixed(2)}</span>{' '}
                            {(obj.totalPrice.centAmount / 100).toFixed(2)} <EuroCircleOutlined />
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-items-count">
                <Button
                  className="items-button"
                  disabled={crementEnable}
                  onClick={(event) => {
                    crementItem(event, 'de');
                  }}
                >
                  -
                </Button>
                <InputNumber
                  id={obj.id}
                  min={1}
                  max={999}
                  value={obj.quantity}
                  controls={false}
                  onFocus={inputNumberFocused}
                  onInput={(event) => debouncedInputNumberChanged(event, obj.id)}
                ></InputNumber>
                <Button
                  className="items-button"
                  disabled={crementEnable}
                  onClick={(event) => {
                    crementItem(event, 'en');
                  }}
                >
                  +
                </Button>
              </div>
              <Button
                className="cart-remove-item"
                onClick={(event) => {
                  buttonWasClicked(event.target);
                }}
              >
                X
              </Button>
              <hr className="line-cart-products" />
            </div>
          );
        }
        if (i === arrayOfGoods.length - 1) {
          productsArray.push(
            <div className="clearCart-button-wrapper" key="removeAllGoods">
              <Popconfirm
                title="Are you sure you want to remove all items from the cart?"
                onConfirm={clearCartAll}
                okText="Yes"
                cancelText="No"
              >
                <Button>Clear all cart</Button>
              </Popconfirm>
            </div>
          );
        }
      }
    }
    return productsArray.length > 0 ? <div className="cart-items-list">{productsArray}</div> : null;
  }

  function fillTotalArray() {
    if (cart) {
      const totalCentAmount = cart.lineItems.reduce((total, obj) => {
        return total + obj.price.value.centAmount * obj.quantity;
      }, 0);
      return cart.lineItems.length > 0 ? (
        <>
          <div className="cart-summary">
            <div className="summary-content-block">
              <h2 className="summary-cart-header">Order Summary</h2>
              <div className="cart-summary-block">
                <span>Subtotal</span> <span>{totalCentAmount / 100} EUR</span>
              </div>
              <hr className="line-cart-summary" />
              <div className="cart-summary-block">
                <span>Shipping estimate</span>
                <span>0 EUR</span>
              </div>
              <hr className="line-cart-summary" />
              <div className="promocode-wrapper">
                <Input
                  placeholder="Enter promocode"
                  className="promocode-input"
                  onChange={handleInputChange}
                  onPressEnter={applyPromocode}
                ></Input>
                <Button onClick={applyPromocode}>Apply</Button>

                <Button onClick={removePromocode}>Remove</Button>
              </div>
              {cart.discountCodes.length !== 0 ? (
                <div>
                  <SafetyOutlined /> You applied a promocode <SafetyOutlined />
                </div>
              ) : null}
              <ul className="discountDescription">
                <li>
                  P.S. If the price already has a shop discount, promocode discount applies to the discounted price, not
                  the original.
                </li>
                <li>5EUROFF - 5 EUR discount if a price of one item is more than 5 EUR</li>
                <li>25%OFF - 25% discount to all products in the cart</li>
              </ul>
              <hr className="line-cart-summary" />
              <div className="cart-summary-block">
                <span>Discounts</span>
                <span>{(totalCentAmount / 100 - cart.totalPrice.centAmount / 100).toFixed(2)}</span>
              </div>
              <hr className="line-cart-summary" />
              <div className="cart-summary-block">
                <span>Order total</span>
                <span>{(cart.totalPrice.centAmount / 100).toFixed(2)} EUR</span>
              </div>
              <Tooltip placement="bottom" title={tooltipText}>
                <Button type="primary" className="cart-checkout">
                  Checkout
                </Button>
              </Tooltip>
              <div className="discountDescription">
                Чтобы не было 1000000 запросов, изменение количества продуктов происходит через дебаунсер. Валера
                сказал, что это правильная реализация и что не надо обновлять цену после ввода каждой цифры в инпуте.
              </div>
            </div>
          </div>
        </>
      ) : null;
    }
  }

  function returnEmptyCart() {
    return (
      <div className="emptyCart">
        Nothing here yet. Please visit our<div>&nbsp;</div>
        <NavLink className="boldText navToCatalog" to="/catalog">
          Catalog
        </NavLink>
      </div>
    );
  }

  return (
    <>
      <h2>Shopping Cart</h2>
      {contextHolder}
      <div className="cart-wrapper">
        {cart ? fillCartWithGoods(cart.lineItems) : null}
        {cart ? fillTotalArray() : null}
      </div>
      {cart ? (cart.lineItems.length === 0 ? returnEmptyCart() : null) : returnEmptyCart()}
    </>
  );
};
