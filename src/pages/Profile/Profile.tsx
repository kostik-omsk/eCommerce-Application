import { useState } from 'react';
import Modal from 'react-modal';
import { Navigate } from 'react-router';
import { Button, Checkbox, DatePicker, Form, Input, Select, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

import dayjs from 'dayjs';
import { useAuth } from '@shared/hooks';
import { ApiClient } from '@app/auth/client';
import { validateData, validatePassword } from '@features/Validation';
import './Profile.css';
import { MyCustomerChangePassword, MyCustomerUpdateAction, _BaseAddress } from '@commercetools/platform-sdk';
import { postcodeValidator } from 'postcode-validator';
import { FillDesriptionProps } from './UserDesc.tsx';
import { ReturnAddresses } from './UserAddresses.tsx';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';

type FieldType = {
  passwordOld: string;
  passwordNew: string;
};

export const Profile = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { user, signIn, setUser } = useAuth();
  const apiClient = ApiClient.getInstance();

  function successMessage(result: 'success' | 'error', errorMessage: string): void {
    messageApi.open({
      type: result,
      content: errorMessage,
      duration: 2,
    });
  }

  const countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Germany', value: 'DE' },
    { label: 'Russia', value: 'RU' },
    { label: 'France', value: 'FR' },
  ];

  // Модальное окно изменения данных пользователя
  const [isUserInfoModalOpened, userInfoModalIsOpen] = useState(false);
  const openUserModal = () => {
    userInfoModalIsOpen(true);
  };
  const closeUserInfoModal = () => {
    userInfoModalIsOpen(false);
  };
  const dateFormat = 'YYYY-MM-DD';
  const [name, setName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const currentDate = dayjs();
    const selectedDate = dayjs(current);
    return selectedDate.isAfter(currentDate);
  };
  const hasSpecialCharacters = /[!@#$%'^&*(),.?":{}|<>0-9\\-]|[!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/;
  const emailRegex = /^\S+@\S+\.\S+$/;
  // Срабатывает при сабмите изменённых данных пользователя
  const changeUserData = () => {
    const newName = name ? name : '';
    const newLastName = lastName ? lastName : '';
    const newEmail = email ? email : '';

    const newDateInput = document.getElementById('dateOfBirth') as HTMLInputElement;

    if (!emailRegex.test(newEmail)) {
      if (!newEmail.includes('@')) {
        successMessage('error', `Email address must contain an '@' symbol.`);
      } else if (newEmail.split('@')[1].trim() === '') {
        successMessage('error', 'Email address must contain a domain name.');
      } else if (newEmail.trim() === '') {
        successMessage('error', 'Email address must not contain leading or trailing whitespace.');
      } else {
        successMessage('error', 'Email address must be properly formatted');
      }
    } else if (hasSpecialCharacters.test(newName) || newName.length === 0) {
      successMessage('error', 'First name Must contain at least one character and no special characters or numbers');
    } else if (hasSpecialCharacters.test(newLastName) || newLastName.length === 0) {
      successMessage('error', 'Last name Must contain at least one character and no special characters or numbers');
    } else if (newDateInput.value !== '') {
      const dateFromInput = new Date(newDateInput.value);
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
      if (
        targetDate.getMonth() > currentDate.getMonth() ||
        (targetDate.getMonth() === currentDate.getMonth() && targetDate.getDate() > currentDate.getDate())
      ) {
        targetDate.setFullYear(targetDate.getFullYear() - 1);
      }
      // Если введённая дата валидна (более 13 лет назад, выше проверка на високосный год)
      if (dateFromInput < targetDate) {
        if (user) {
          apiClient.requestBuilder
            .me()
            .post({
              body: {
                version: user.version,
                actions: [
                  {
                    action: 'setFirstName',
                    firstName: newName,
                  },
                  {
                    action: 'setLastName',
                    lastName: newLastName,
                  },
                  {
                    action: 'setDateOfBirth',
                    dateOfBirth: newDateInput.value,
                  },
                  {
                    action: 'changeEmail',
                    email: newEmail,
                  },
                ],
              },
            })
            .execute()
            .then((response) => {
              successMessage('success', `Information successfully updated`);
              setUser(response.body);
              closeUserInfoModal();
            });
        }
      }
    }
  };
  // Тут заканчивается изменение данных пользователя

  // Изменение пароля пользователя
  const [isPasswordInfoModalOpened, userPasswordModalIsOpen] = useState(false);
  const openPasswordModal = () => {
    userPasswordModalIsOpen(true);
  };
  const closePasswordInfoModal = () => {
    userPasswordModalIsOpen(false);
  };

  // Срабатывает при сабмите смены пароля
  async function changePasswordData(values: FieldType) {
    if (user) {
      const body: MyCustomerChangePassword = {
        version: user.version,
        currentPassword: values.passwordOld,
        newPassword: values.passwordNew,
      };
      apiClient.requestBuilder
        .me()
        .password()
        .post({
          body,
        })
        .execute()
        .then(async (response) => {
          successMessage('success', `Information successfully updated`);
          const credentials: UserAuthOptions = {
            username: user.email,
            password: values.passwordNew,
          };
          await signIn(credentials);
          setUser(response.body);
          closePasswordInfoModal();
        })
        .catch((error) => {
          successMessage('error', error.message);
        });
    }
  }
  // Тут заканчивается смена пароля пользователя

  // Добавление нового адреса
  const [isNewAddressModalOpened, userNewAddressModalIsOpen] = useState(false);
  const openNewAddressModal = () => {
    userNewAddressModalIsOpen(true);
  };
  const closeNewAddressModal = () => {
    userNewAddressModalIsOpen(false);
  };
  const [newshippingCountry, setNewShippingCountry] = useState('');
  const [newcity, setNewCity] = useState('');
  const [newregion, setNewRegion] = useState('');
  const [newstate, setNewState] = useState('');
  const [newstreetName, setNewStreetName] = useState('');
  const [newstreetNumber, setNewStreetNumber] = useState('');
  const [newbuilding, setNewBuilding] = useState('');
  const [newapartment, setNewApartment] = useState('');
  const [newpostalCode, setNewPostalCode] = useState('');
  const [newpOBox, setNewpOBox] = useState('');
  const [newadditionalAddressInfo, setNewAdditionalAddressInfo] = useState('');
  const [newadditionalStreetInfo, setNewAdditionalStreetInfo] = useState('');
  const [newdefaultShippingAddressCheckBox, setNewDefaultShippingAddressCheckBox] = useState(false);
  const [newdefaultBillingAddressCheckBox, setNewDefaultBillingAddressCheckBox] = useState(false);
  const [newshippingAddressCheckBox, setNewShippingAddressCheckBox] = useState(false);
  const [newbillingAddressCheckBox, setNewBillingAddressCheckBox] = useState(false);

  // Функция для создания ключа адреса, а ключ используется для присвоение новым адресам параметров биллинг адреса, шиппинг адреса и по умолчанию
  function generateUniqId(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 16) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  // Создание нового адреса при нажатии на кнопку добавить адрес
  async function addNewAddress(): Promise<void> {
    // Валидируем почту
    let postalCodeError = '';

    if (newshippingCountry === 'US') {
      postalCodeError = 'code should be (5 digits): XXXXX or (5-4 digits): XXXXX-XXXX';
    } else if (newshippingCountry === 'RU') {
      postalCodeError = 'code should be (6 digits): XXXXXX';
    } else if (newshippingCountry === 'FR' || newshippingCountry === 'DE') {
      postalCodeError = 'code should be (5 digits): XXXXX';
    } else if (newshippingCountry === '') {
      postalCodeError = 'Choose country';
    }

    if (newshippingCountry === '' || !postcodeValidator(newpostalCode, newshippingCountry)) {
      successMessage('error', postalCodeError);
    } else {
      postalCodeError = '';
    }

    // Валидируем город
    let cityError = false;
    if (hasSpecialCharacters.test(newcity) || newcity.length === 0) {
      cityError = true;
      successMessage('error', `City name must contain at least one character and no special characters or numbers`);
    }

    // Валидируем улицу
    let streetError = false;
    if (newstreetName.length === 0 || newstreetName.trim() === '') {
      streetError = true;
      successMessage('error', `Street name must contain at least one character`);
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
        newstreetName,
        newstreetNumber,
        newadditionalStreetInfo,
        newadditionalStreetInfo,
        newpostalCode,
        newcity,
        newregion,
        newstate,
        newbuilding,
        newapartment,
        newpOBox,
        newadditionalAddressInfo,
      ];
      const randomKey = generateUniqId();
      const addressArray: (string | number[] | number)[][] = [
        ['country', newshippingCountry],
        ['key', randomKey],
      ];

      for (let i = 0; i < arrayOfValues.length; i += 1) {
        if (arrayOfValues[i] !== '') {
          addressArray.push([arrayOfKeys[i], arrayOfValues[i]]);
        }
      }

      // Добавление по умолчанию автоматически добавляет просто параметр, поэтому если стоит галочка, достаточно отправить только одно действие
      const baseAddressObj: _BaseAddress = Object.fromEntries(addressArray);

      const actionsArray: MyCustomerUpdateAction[] = [
        {
          action: 'addAddress',
          address: baseAddressObj,
        },
      ];

      if (newdefaultBillingAddressCheckBox) {
        actionsArray.push({
          action: 'setDefaultBillingAddress',
          addressKey: randomKey,
        });
      } else if (newbillingAddressCheckBox) {
        actionsArray.push({
          action: 'addBillingAddressId',
          addressKey: randomKey,
        });
      }

      if (newdefaultShippingAddressCheckBox) {
        actionsArray.push({
          action: 'setDefaultShippingAddress',
          addressKey: randomKey,
        });
      } else if (newshippingAddressCheckBox) {
        actionsArray.push({
          action: 'addShippingAddressId',
          addressKey: randomKey,
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
            successMessage('success', 'New address successfully added.');
            setUser(response.body);

            setNewShippingCountry('');
            setNewCity('');
            setNewRegion('');
            setNewState('');
            setNewStreetName('');
            setNewStreetNumber('');
            setNewBuilding('');
            setNewApartment('');
            setNewPostalCode('');
            setNewpOBox('');
            setNewAdditionalAddressInfo('');
            setNewAdditionalStreetInfo('');

            setNewDefaultShippingAddressCheckBox(false);
            setNewDefaultBillingAddressCheckBox(false);
            setNewShippingAddressCheckBox(false);
            setNewBillingAddressCheckBox(false);

            closeNewAddressModal();
          });
      }
    }
  }

  return (
    <>
      {user ? (
        <>
          <h2>Profile</h2>
          <div className="main-profile-block">
            {contextHolder}
            {FillDesriptionProps(user)}
            <div className="user-data-controls">
              <Button type="primary" onClick={openUserModal}>
                Edit user
              </Button>
              <Button type="primary" onClick={openPasswordModal}>
                Edit password
              </Button>
            </div>
            {ReturnAddresses(user)}
            <Button type="primary" onClick={() => openNewAddressModal()}>
              Add new address
            </Button>
          </div>

          <Modal isOpen={isPasswordInfoModalOpened} ariaHideApp={false} onRequestClose={closePasswordInfoModal}>
            <h2>Change your password</h2>
            <Form
              name="login_form"
              className="personal-info-form"
              initialValues={{ remember: true }}
              onFinish={changePasswordData}
            >
              <Form.Item<FieldType>
                label="Old password:"
                name="passwordOld"
                rules={[{ required: true, message: 'Please input your password!' }, { validator: validatePassword }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item<FieldType>
                label="New password:"
                name="passwordNew"
                rules={[{ required: true, message: 'Please input your password!' }, { validator: validatePassword }]}
              >
                <Input.Password />
              </Form.Item>
              <div className="modal-controls">
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <button type="button" onClick={closePasswordInfoModal}>
                  Close
                </button>
              </div>
            </Form>
          </Modal>

          <Modal isOpen={isUserInfoModalOpened} ariaHideApp={false} onRequestClose={closeUserInfoModal}>
            <h2>Personal info</h2>
            <Form className="personal-info-form" initialValues={{ dateOfBirth: dayjs(user?.dateOfBirth, dateFormat) }}>
              <label>
                <div>Name:</div>
                <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <br />
              <label>
                <div>Last Name:</div>
                <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              </label>
              <br />
              <label>
                <div>Email:</div>
                <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <br />
              <label className="personal-info-date">
                <div className="dateOfBirth">Date of Birth:</div>
                <Form.Item name="dateOfBirth" required={true} rules={[{ validator: validateData }]}>
                  <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
                </Form.Item>
              </label>
              <br />
              <div className="modal-controls">
                <button onClick={changeUserData}>Submit</button>
                <button type="button" onClick={closeUserInfoModal}>
                  Close
                </button>
              </div>
            </Form>
          </Modal>

          <Modal isOpen={isNewAddressModalOpened} ariaHideApp={false} onRequestClose={closeNewAddressModal}>
            <h2>New address</h2>
            <Form className="personal-info-form address-info-form">
              <Form.Item name="country" rules={[{ required: true, message: 'Please select your country' }]}>
                <Select
                  placeholder={'Select your country'}
                  value={newshippingCountry}
                  onChange={(value) => {
                    setNewShippingCountry(value);
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
                <input type="text" value={newregion} onChange={(event) => setNewRegion(event.target.value)} />
              </label>
              <br />
              <label>
                <div>State:</div>
                <input type="text" value={newstate} onChange={(event) => setNewState(event.target.value)} />
              </label>
              <br />
              <label>
                <div>City:</div>
                <input type="text" value={newcity} onChange={(event) => setNewCity(event.target.value)} />
              </label>
              <br />

              <label>
                <div>Street number:</div>
                <input
                  type="text"
                  value={newstreetNumber}
                  onChange={(event) => setNewStreetNumber(event.target.value)}
                />
              </label>
              <br />

              <label>
                <div>Street name:</div>
                <input type="text" value={newstreetName} onChange={(event) => setNewStreetName(event.target.value)} />
              </label>
              <br />

              <label>
                <div>Building:</div>
                <input type="text" value={newbuilding} onChange={(event) => setNewBuilding(event.target.value)} />
              </label>
              <br />

              <label>
                <div>Apartment / Suite:</div>
                <input type="text" value={newapartment} onChange={(event) => setNewApartment(event.target.value)} />
              </label>
              <br />

              <label>
                <div>Postal Code</div>
                <input type="text" value={newpostalCode} onChange={(event) => setNewPostalCode(event.target.value)} />
              </label>
              <br />
              <label>
                <div>PO Box</div>
                <input type="text" value={newpOBox} onChange={(event) => setNewpOBox(event.target.value)} />
              </label>
              <br />
              <label>
                <div>Additional address info</div>
                <input
                  type="text"
                  value={newadditionalAddressInfo}
                  onChange={(event) => setNewAdditionalAddressInfo(event.target.value)}
                />
              </label>
              <br />
              <label>
                <div>Additional street info</div>
                <input
                  type="text"
                  value={newadditionalStreetInfo}
                  onChange={(event) => setNewAdditionalStreetInfo(event.target.value)}
                />
              </label>
              <br />
              <Form.Item>
                <Checkbox
                  checked={newdefaultShippingAddressCheckBox}
                  onChange={() => setNewDefaultShippingAddressCheckBox(!newdefaultShippingAddressCheckBox)}
                >
                  default Shipping Address
                </Checkbox>
                <Checkbox
                  checked={newdefaultBillingAddressCheckBox}
                  onChange={() => setNewDefaultBillingAddressCheckBox(!newdefaultBillingAddressCheckBox)}
                >
                  default Billing Address
                </Checkbox>
                <Checkbox
                  checked={newshippingAddressCheckBox}
                  onChange={() => setNewShippingAddressCheckBox(!newshippingAddressCheckBox)}
                >
                  Shipping Address
                </Checkbox>
                <Checkbox
                  checked={newbillingAddressCheckBox}
                  onChange={() => setNewBillingAddressCheckBox(!newbillingAddressCheckBox)}
                >
                  Billing Address
                </Checkbox>
              </Form.Item>

              <div className="modal-controls">
                <button onClick={addNewAddress}>Submit</button>
                <button type="button" onClick={closeNewAddressModal}>
                  Close
                </button>
              </div>
            </Form>
          </Modal>
        </>
      ) : (
        <Navigate to={'/'} replace={true} />
      )}
    </>
  );
};
