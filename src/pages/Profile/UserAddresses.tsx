import { useState } from 'react';
import { DescriptionsProps, Descriptions, Button, message, Checkbox, Form, Select } from 'antd';
import Modal from 'react-modal';
import { getName } from 'country-list';
import { postcodeValidator } from 'postcode-validator';
import type { Customer, MyCustomerUpdateAction, _BaseAddress } from '@commercetools/platform-sdk';
import { useAuth } from '@shared/hooks';
import { ApiClient } from '@shared/api/core';

export function ReturnAddresses(user: Customer): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { setUser } = useAuth();
  const apiClient = ApiClient.getInstance();

  // Модальное окно для смены данных адреса
  const countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Germany', value: 'DE' },
    { label: 'Russia', value: 'RU' },
    { label: 'France', value: 'FR' },
  ];
  const [shippingCountry, setShippingCountry] = useState('');
  const [region, setRegion] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [pOBox, setpOBox] = useState('');
  const [additionalAddressInfo, setAdditionalAddressInfo] = useState('');
  const [additionalStreetInfo, setAdditionalStreetInfo] = useState('');
  const [defaultShippingAddressCheckBox, setDefaultShippingAddressCheckBox] = useState(false);
  const [defaultBillingAddressCheckBox, setDefaultBillingAddressCheckBox] = useState(false);
  const [shippingAddressCheckBox, setShippingAddressCheckBox] = useState(false);
  const [billingAddressCheckBox, setBillingAddressCheckBox] = useState(false);
  const [clickedAddressId, setAddressId] = useState('');
  const hasSpecialCharacters = /[!@#$%'^&*(),.?":{}|<>0-9\\-]|[!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
  const [isAddressInfoModalOpened, userAddressModalIsOpen] = useState(false);
  // Вставляет данные адреса, который был выбран, в поля модального окна
  function inputValidAddressInfo(buttonNumber: number) {
    if (user) {
      const userCity = user?.addresses[buttonNumber].city;
      const userRegion = user?.addresses[buttonNumber].region;
      const userState = user?.addresses[buttonNumber].state;
      const userStreetNumber = user?.addresses[buttonNumber].streetNumber;
      const userStreetName = user?.addresses[buttonNumber].streetName;
      const userBuilding = user?.addresses[buttonNumber].building;
      const userApartment = user?.addresses[buttonNumber].apartment;
      const userPostalCode = user?.addresses[buttonNumber].postalCode;
      const userpOBox = user?.addresses[buttonNumber].pOBox;
      const userAdditionalAddressInfo = user?.addresses[buttonNumber].additionalAddressInfo;
      const userAdditionalStreetInfo = user?.addresses[buttonNumber].additionalStreetInfo;

      const userCountry = user?.addresses[buttonNumber].country;
      setShippingCountry(userCountry);

      const addressId = user?.addresses[buttonNumber].id as string;
      const defaultBillingAddressId = user?.defaultBillingAddressId;
      const defaultShippingAddressId = user?.defaultShippingAddressId;

      let shippingAddressList: string[] = [];
      let billingAddressList: string[] = [];
      if (user?.shippingAddressIds) {
        shippingAddressList = user?.shippingAddressIds;
      }
      if (user?.billingAddressIds) {
        billingAddressList = user?.billingAddressIds;
      }

      // Ставим чекбоксы в зависимости от параметров
      if (addressId === defaultShippingAddressId) {
        setDefaultShippingAddressCheckBox(true);
      } else {
        setDefaultShippingAddressCheckBox(false);
      }

      if (addressId === defaultBillingAddressId) {
        setDefaultBillingAddressCheckBox(true);
      } else {
        setDefaultBillingAddressCheckBox(false);
      }

      if (shippingAddressList.includes(addressId)) {
        setShippingAddressCheckBox(true);
      } else {
        setShippingAddressCheckBox(false);
      }

      if (billingAddressList.includes(addressId)) {
        setBillingAddressCheckBox(true);
      } else {
        setBillingAddressCheckBox(false);
      }

      if (addressId) {
        setAddressId(addressId);
      } else {
        setAddressId('');
      }

      if (addressId) {
        setAddressId(addressId);
      } else {
        setAddressId('');
      }

      if (userCity) {
        setCity(userCity);
      } else {
        setCity('');
      }
      if (userRegion) {
        setRegion(userRegion);
      } else {
        setRegion('');
      }

      if (userState) {
        setState(userState);
      } else {
        setState('');
      }

      if (userStreetNumber) {
        setStreetNumber(userStreetNumber);
      } else {
        setStreetNumber('');
      }

      if (userStreetName) {
        setStreetName(userStreetName.trimStart().trimEnd());
      } else {
        setStreetName('');
      }

      if (userBuilding) {
        setBuilding(userBuilding);
      } else {
        setBuilding('');
      }

      if (userApartment) {
        setApartment(userApartment);
      } else {
        setApartment('');
      }

      if (userPostalCode) {
        setPostalCode(userPostalCode);
      } else {
        setPostalCode('');
      }

      if (userpOBox) {
        setpOBox(userpOBox);
      } else {
        setpOBox('');
      }

      if (userAdditionalAddressInfo) {
        setAdditionalAddressInfo(userAdditionalAddressInfo);
      } else {
        setAdditionalAddressInfo('');
      }

      if (userAdditionalStreetInfo) {
        setAdditionalStreetInfo(userAdditionalStreetInfo);
      } else {
        setAdditionalStreetInfo('');
      }
    }
  }

  const openAddressModal = (buttonNumber: number) => {
    inputValidAddressInfo(buttonNumber);
    userAddressModalIsOpen(true);
  };
  const closeAddressInfoModal = () => {
    userAddressModalIsOpen(false);
  };

  function successMessage(result: 'success' | 'error', errorMessage: string): void {
    messageApi.open({
      type: result,
      content: errorMessage,
      duration: 2,
    });
  }
  // Функция для смены данных адреса, срабатывает при сабмите на смену адреса

  // Функция для смены данных адреса, срабатывает при сабмите на смену адреса
  function changeAddressData() {
    // Валидируем почту
    let postalCodeError = '';

    if (shippingCountry === 'US') {
      postalCodeError = 'code should be (5 digits): XXXXX or (5-4 digits): XXXXX-XXXX';
    } else if (shippingCountry === 'RU') {
      postalCodeError = 'code should be (6 digits): XXXXXX';
    } else if (shippingCountry === 'FR' || shippingCountry === 'DE') {
      postalCodeError = 'code should be (5 digits): XXXXX';
    } else if (shippingCountry === '') {
      postalCodeError = 'Choose country';
    }

    if (shippingCountry === '') {
      successMessage('error', postalCodeError);
    } else if (!postcodeValidator(postalCode, shippingCountry)) {
      successMessage('error', postalCodeError);
    } else {
      postalCodeError = '';
    }

    // Валидируем город
    let cityError = false;

    if (hasSpecialCharacters.test(city) || city.length === 0) {
      successMessage('error', 'City name Must contain at least one character and no special characters or numbers');
      cityError = true;
    }

    // Валидируем улицу
    let streetError = false;
    if (streetName.length === 0 || streetName.trim() === '') {
      successMessage('error', 'Street name Must contain at least one character');
      streetError = true;
    }

    if (postalCodeError === '' && !cityError && !streetError) {
      const arrayOfKeys = [
        'streetName',
        'streetNumber',
        'additionalStreetInfo',
        'additionalStreetInfo',
        'postalCode',
        'city',
        'region',
        'state',
        'building',
        'apartment',
        'pOBox',
        'additionalAddressInfo',
      ];
      const arrayOfValues = [
        streetName,
        streetNumber,
        additionalStreetInfo,
        additionalStreetInfo,
        postalCode,
        city,
        region,
        state,
        building,
        apartment,
        pOBox,
        additionalAddressInfo,
      ];

      const addressArray = [
        ['id', clickedAddressId],
        ['country', shippingCountry],
      ];

      const defaultBillingAddressId = user?.defaultBillingAddressId;
      const defaultShippingAddressId = user?.defaultShippingAddressId;
      let shippingAddressList: string[] = [];
      let billingAddressList: string[] = [];
      if (user?.shippingAddressIds) {
        shippingAddressList = user?.shippingAddressIds;
      }
      if (user?.billingAddressIds) {
        billingAddressList = user?.billingAddressIds;
      }

      for (let i = 0; i < arrayOfValues.length; i += 1) {
        if (arrayOfValues[i] !== '') {
          addressArray.push([arrayOfKeys[i], arrayOfValues[i]]);
        }
      }

      const baseAddressObj: _BaseAddress = Object.fromEntries(addressArray);

      const actionsArray: MyCustomerUpdateAction[] = [
        {
          action: 'changeAddress',
          addressId: clickedAddressId,
          address: baseAddressObj,
        },
      ];

      // Проверяем биллинг и шиппинг адреса, если их включили и они не были таковыми,
      // добавляем им новые параметры, но если параметры были и мы выключили чекбоксы,
      // то проверяя наличие параметров, убираем их.
      if (shippingAddressCheckBox && !shippingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'addShippingAddressId',
          addressId: clickedAddressId,
        });
      } else if (!shippingAddressCheckBox && shippingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'removeShippingAddressId',
          addressId: clickedAddressId,
        });
      }

      if (billingAddressCheckBox && !billingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'addBillingAddressId',
          addressId: clickedAddressId,
        });
      } else if (!billingAddressCheckBox && billingAddressList.includes(clickedAddressId)) {
        actionsArray.push({
          action: 'removeBillingAddressId',
          addressId: clickedAddressId,
        });
      }

      // Если адрес стоит по умолчанию, делаем его таковым, если не стоит, проверяем,
      // был ли он до этого адресом по умолчанию, и если да, то сбрасываем адрем по умолчанию
      if (defaultBillingAddressCheckBox) {
        actionsArray.push({
          action: 'setDefaultBillingAddress',
          addressId: clickedAddressId,
        });
      } else if (clickedAddressId === defaultBillingAddressId) {
        actionsArray.push({
          action: 'setDefaultBillingAddress',
        });
      }

      if (defaultShippingAddressCheckBox) {
        actionsArray.push({
          action: 'setDefaultShippingAddress',
          addressId: clickedAddressId,
        });
      } else if (clickedAddressId === defaultShippingAddressId) {
        actionsArray.push({
          action: 'setDefaultShippingAddress',
        });
      }

      if (user) {
        apiClient.requestBuilder
          .me()
          .post({
            body: {
              version: user.version,
              actions: actionsArray,
            },
          })
          .execute()
          .then((response) => {
            successMessage('success', `Information successfully updated`);
            setUser(response.body);
            closeAddressInfoModal();
          });
      }
    }
  }

  function removeAddress(addressId: number): void {
    const deleteAddressId = user?.addresses[addressId].id as string;
    if (user) {
      apiClient.requestBuilder
        .me()
        .post({
          body: {
            version: user.version,
            actions: [{ action: 'removeAddress', addressId: deleteAddressId }],
          },
        })
        .execute()
        .then((response) => {
          successMessage('success', `Address successfully deleted`);
          setUser(response.body);
          closeAddressInfoModal();
        });
    }
  }

  // Массив блоков с адресами
  const userAddressesArray: JSX.Element[] = [];

  // Заполняем адреса на странице профиля, проходя по каждому
  if (user) {
    for (let i = 0; i < user.addresses.length; i += 1) {
      const items: DescriptionsProps['items'] = [];

      let newKey = 1;
      newKey += 1;
      const fullAddress = [];

      // Заполняем доступными данными
      if (`${user?.addresses[i].country}` !== 'undefined') {
        fullAddress.push(['Country', getName(`${user?.addresses[i].country}`)]);
      }
      if (`${user?.addresses[i].state}` !== 'undefined') {
        fullAddress.push(['State', `${user?.addresses[i].state}`]);
      }
      if (`${user?.addresses[i].city}` !== 'undefined') {
        fullAddress.push(['City', `${user?.addresses[i].city}`]);
      }
      // Делаем полное название улицы из её частей
      const fullStreet = [];
      if (`${user?.addresses[i].streetName}` !== 'undefined') {
        fullStreet.push(`${user?.addresses[i].streetName}`);
      }
      if (`${user?.addresses[i].streetNumber}` !== 'undefined') {
        fullStreet.push(`${user?.addresses[i].streetName}`);
      }
      if (`${user?.addresses[i].additionalStreetInfo}` !== 'undefined') {
        fullStreet.push(`${user?.addresses[i].streetName}`);
      }
      if (fullStreet.length !== 0) {
        fullAddress.push(['Street', fullStreet.join(', ')]);
      }

      if (`${user?.addresses[i].postalCode}` !== 'undefined') {
        fullAddress.push(['Zip code', `${user?.addresses[i].postalCode}`]);
      }

      const addressId = user.addresses[i].id as string;
      // По айди проверяем тип адреса
      const address = [];
      const defaultBillingAddressId = user?.defaultBillingAddressId;
      const defaultShippingAddressId = user?.defaultShippingAddressId;

      let shippingAddressList: string[] = [];
      let billingAddressList: string[] = [];

      if (user?.shippingAddressIds) {
        shippingAddressList = user?.shippingAddressIds;
      }
      if (user?.billingAddressIds) {
        billingAddressList = user?.billingAddressIds;
      }

      // Делаем заголовок типа адреса
      if (user.addresses[i].id === defaultBillingAddressId && addressId === defaultShippingAddressId) {
        address.push('Default billing and shipping address');
      } else if (addressId === defaultBillingAddressId) {
        address.push('Default billing address');
        if (shippingAddressList.includes(addressId)) {
          address.push('Shipping address');
        }
      } else if (addressId === defaultShippingAddressId) {
        address.push('Default shipping address');
        if (billingAddressList.includes(addressId)) {
          address.push('Billing address');
        }
      } else {
        if (shippingAddressList.includes(addressId)) {
          address.push('Shipping address');
        }
        if (billingAddressList.includes(addressId)) {
          address.push('Billing address');
        }
      }

      // Заполняем адрес данными
      for (let x = 0; x < fullAddress.length; x += 1) {
        newKey += 1;
        items?.push({
          key: newKey,
          label: fullAddress[x][0],
          children: fullAddress[x][1],
        });
      }

      const userAddress = (
        <Descriptions title={address.join(', ')} bordered items={items} column={1} key={`descriptions${i}`} />
      );

      const addressButtons = (
        <div className="address-controls" key={`buttonDiv${i}`}>
          <Button type="primary" key={`buttonA${i}`} onClick={() => openAddressModal(i)}>
            Edit address
          </Button>
          <Button type="primary" key={`buttonR${i}`} onClick={() => removeAddress(i)}>
            Remove address
          </Button>
        </div>
      );
      userAddressesArray.push(userAddress, addressButtons);
    }
  }
  const modalWindow: JSX.Element = (
    <div key={`descriptionsDiv`}>
      <Modal isOpen={isAddressInfoModalOpened} ariaHideApp={false} onRequestClose={closeAddressInfoModal}>
        <h2>Personal info</h2>
        <Form initialValues={{ country: shippingCountry }} className="personal-info-form address-info-form">
          <Form.Item name="country" rules={[{ required: true, message: 'Please select your country' }]}>
            <Select
              placeholder={'Select your country'}
              value={shippingCountry}
              onChange={(value) => {
                setShippingCountry(value);
              }}
            >
              {countryOptions.map((country) => (
                <Select.Option key={country.value} value={country.value}>
                  {country.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <br />
          <label>
            <div>Region:</div>
            <input type="text" value={region} onChange={(event) => setRegion(event.target.value)} />
          </label>
          <br />
          <label>
            <div>State:</div>
            <input type="text" value={state} onChange={(event) => setState(event.target.value)} />
          </label>
          <br />
          <label>
            <div>City:</div>
            <input type="text" value={city} onChange={(event) => setCity(event.target.value)} />
          </label>
          <br />

          <label>
            <div>Street number:</div>
            <input type="text" value={streetNumber} onChange={(event) => setStreetNumber(event.target.value)} />
          </label>
          <br />

          <label>
            <div>Street name:</div>
            <input type="text" value={streetName} onChange={(event) => setStreetName(event.target.value)} />
          </label>
          <br />

          <label>
            <div>Building:</div>
            <input type="text" value={building} onChange={(event) => setBuilding(event.target.value)} />
          </label>
          <br />

          <label>
            <div>Apartment / Suite:</div>
            <input type="text" value={apartment} onChange={(event) => setApartment(event.target.value)} />
          </label>
          <br />

          <label>
            <div>Postal Code</div>
            <input type="text" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
          </label>
          <br />
          <label>
            <div>PO Box</div>
            <input type="text" value={pOBox} onChange={(event) => setpOBox(event.target.value)} />
          </label>
          <br />
          <label>
            <div>Additional address info</div>
            <input
              type="text"
              value={additionalAddressInfo}
              onChange={(event) => setAdditionalAddressInfo(event.target.value)}
            />
          </label>
          <br />
          <label>
            <div>Additional street info</div>
            <input
              type="text"
              value={additionalStreetInfo}
              onChange={(event) => setAdditionalStreetInfo(event.target.value)}
            />
          </label>
          <br />
          <Form.Item>
            <Checkbox
              checked={defaultShippingAddressCheckBox}
              onChange={() => setDefaultShippingAddressCheckBox(!defaultShippingAddressCheckBox)}
            >
              default Shipping Address
            </Checkbox>
            <Checkbox
              checked={defaultBillingAddressCheckBox}
              onChange={() => setDefaultBillingAddressCheckBox(!defaultBillingAddressCheckBox)}
            >
              default Billing Address
            </Checkbox>
            <Checkbox
              checked={shippingAddressCheckBox}
              onChange={() => setShippingAddressCheckBox(!shippingAddressCheckBox)}
            >
              Shipping Address
            </Checkbox>
            <Checkbox
              checked={billingAddressCheckBox}
              onChange={() => setBillingAddressCheckBox(!billingAddressCheckBox)}
            >
              Billing Address
            </Checkbox>
          </Form.Item>

          <div className="modal-controls">
            <button onClick={() => changeAddressData()}>Submit</button>
            <button type="button" onClick={closeAddressInfoModal}>
              Close
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );

  // Конец генерации блоков с адресами на странице
  userAddressesArray.push(modalWindow);
  return (
    <div>
      {contextHolder}
      {userAddressesArray}
    </div>
  );
}
