import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Button, Checkbox, DatePicker, Form, Input, Select, Space, message } from 'antd';
import { Rule } from 'antd/es/form';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import type { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@shared/hooks';
import {
  validateData,
  validateEmail,
  validateField,
  validatePassword,
  validatePostalCode,
  validateStreet,
} from '@features/Validation';
import styles from './SingUpForm.module.css';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Dayjs;
  address: BaseAddress;
  address2: BaseAddress;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 6,
    },
  },
};

const styleInpSpaceCompact = {
  width: '50%',
  marginBottom: 0,
};

const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'Germany', value: 'DE' },
  { label: 'Russia', value: 'RU' },
  { label: 'France', value: 'FR' },
];

export const SingUpForm = () => {
  const [form] = Form.useForm();
  const { signUp } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [allAddresses, setAllAddresses] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState(false);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState(false);
  const [shippingCountry, setShippingCountry] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values: FormValues) => {
    const { email, confirmPassword, firstName, lastName, dateOfBirth, address, address2 } = values;

    const addresses = [address];
    if (address2) {
      addresses.push(address2);
    }

    let newCustomer: CustomerDraft = {
      email: email,
      password: confirmPassword,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth.format('YYYY-MM-DD'),
      addresses: addresses,
      shippingAddresses: [0],
    };

    if (defaultShippingAddress) {
      newCustomer = {
        ...newCustomer,
        defaultShippingAddress: 0,
      };
    }

    if (allAddresses) {
      newCustomer = {
        ...newCustomer,
        billingAddresses: [0],
      };
    } else if (addAddress) {
      newCustomer = {
        ...newCustomer,
        billingAddresses: [1],
      };
    }

    if (defaultBillingAddress) {
      newCustomer = {
        ...newCustomer,
        defaultBillingAddress: allAddresses ? 0 : 1,
      };
    }

    setIsLoading(true);

    signUp(newCustomer)
      .then((result) => {
        if (!result.success) {
          messageApi.open({
            type: 'error',
            content: result.message,
          });
        } else {
          navigate('/', {
            replace: true,
            state: {
              hi: result.data.firstName,
            },
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validateConfirmPassword = (_: Rule, value: string) => {
    if (!value) return Promise.reject('Please confirm your password!');
    if (form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject('The new password that you entered do not match!');
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const currentDate = dayjs();
    const selectedDate = dayjs(current);
    return selectedDate.isAfter(currentDate);
  };

  return (
    <>
      {contextHolder}
      <Form
        className={styles.form}
        name="register"
        form={form}
        onFinish={onFinish}
        {...formItemLayout}
        size="small"
        style={{ maxWidth: 600 }}
      >
        {/* email */}
        <Form.Item
          name="email"
          label="Email"
          hasFeedback
          rules={[
            { type: 'email', message: 'Enter the correct email address' },
            { required: true, message: 'Please fill in the field!' },
            { validator: validateEmail },
          ]}
        >
          <Input placeholder="example@email.com" />
        </Form.Item>
        {/* name */}
        <Form.Item label="Name" required={true}>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="firstName" rules={[{ validator: validateField }]} hasFeedback style={styleInpSpaceCompact}>
              <Input placeholder="First Name" />
            </Form.Item>
            {/* Last name */}
            <Form.Item name="lastName" rules={[{ validator: validateField }]} hasFeedback style={styleInpSpaceCompact}>
              <Input placeholder="Last Name" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        {/* Date of birth */}
        <Form.Item name="dateOfBirth" label="Date of birth" required={true} rules={[{ validator: validateData }]}>
          <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
        </Form.Item>
        {/* Shipping Address */}
        <Form.Item label="Shipping Address" required={true}>
          <Space wrap={true} style={{ width: '100%' }}>
            <Form.Item
              className={styles.selectCountry}
              name={['address', 'country']}
              rules={[{ required: true, message: 'Please select your country' }]}
            >
              <Select
                placeholder="Select your country"
                onChange={(value) => {
                  setShippingCountry(value);
                  form.setFieldsValue({
                    address: {
                      city: '',
                      streetName: '',
                      postalCode: '',
                    },
                  });
                }}
              >
                {countryOptions.map((country) => (
                  <Select.Option key={country.value} value={country.value}>
                    {country.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Checkbox
                className={styles.checkAddress}
                checked={defaultShippingAddress}
                onChange={() => setDefaultShippingAddress(!defaultShippingAddress)}
              >
                default Shipping Address
              </Checkbox>
            </Form.Item>
          </Space>
          <Space.Compact>
            <Form.Item name={['address', 'city']} rules={[{ validator: validateField }]} style={styleInpSpaceCompact}>
              <Input placeholder="City" disabled={shippingCountry.length === 0} />
            </Form.Item>
            <Form.Item
              name={['address', 'streetName']}
              rules={[{ validator: validateStreet }]}
              style={styleInpSpaceCompact}
            >
              <Input placeholder="Street" disabled={shippingCountry.length === 0} />
            </Form.Item>
            <Form.Item
              name={['address', 'postalCode']}
              rules={[{ validator: (_, value) => validatePostalCode(shippingCountry, value) }]}
              style={styleInpSpaceCompact}
            >
              <Input placeholder="Postal code" disabled={shippingCountry.length === 0} />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Checkbox
            className="check-address"
            checked={allAddresses}
            onChange={() => {
              setAllAddresses(!allAddresses);
              setAddAddress(false);
              form.resetFields(['address2']);
              setDefaultBillingAddress(false);
            }}
          >
            Also set as billing address
          </Checkbox>
          {allAddresses && (
            <Checkbox
              className={styles.checkAddress}
              checked={defaultBillingAddress}
              onChange={() => setDefaultBillingAddress(!defaultBillingAddress)}
            >
              and default Billing Address
            </Checkbox>
          )}
        </Form.Item>
        {/* Billing Address */}
        {addAddress && (
          <Form.Item label="Billing Address" required={true}>
            <Space wrap={true} style={{ width: '100%' }}>
              <Form.Item
                className={styles.selectCountry}
                name={['address2', 'country']}
                rules={[{ required: true, message: 'Please select your country' }]}
              >
                <Select
                  placeholder="Select your country"
                  onChange={(value) => {
                    setBillingCountry(value);
                    form.setFieldsValue({
                      address2: {
                        city: '',
                        streetName: '',
                        postalCode: '',
                      },
                    });
                  }}
                >
                  {countryOptions.map((country) => (
                    <Select.Option key={country.value} value={country.value}>
                      {country.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ flex: 1 }}>
                <Checkbox
                  className={styles.checkAddress}
                  checked={defaultBillingAddress}
                  onChange={() => setDefaultBillingAddress(!defaultBillingAddress)}
                >
                  default Billing Address
                </Checkbox>
              </Form.Item>
            </Space>
            <Space.Compact>
              <Form.Item
                name={['address2', 'city']}
                rules={[{ validator: validateField }]}
                style={styleInpSpaceCompact}
              >
                <Input placeholder="City" disabled={billingCountry.length === 0} />
              </Form.Item>
              <Form.Item
                name={['address2', 'streetName']}
                rules={[{ validator: validateStreet }]}
                style={styleInpSpaceCompact}
              >
                <Input placeholder="Street" disabled={billingCountry.length === 0} />
              </Form.Item>
              <Form.Item
                name={['address2', 'postalCode']}
                rules={[{ validator: (_, value) => validatePostalCode(billingCountry, value) }]}
                style={styleInpSpaceCompact}
              >
                <Input placeholder="Postal code" disabled={billingCountry.length === 0} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        )}
        {!addAddress && (
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="dashed"
              disabled={allAddresses}
              onClick={() => setAddAddress(!addAddress)}
              style={{ width: '60%' }}
              icon={<PlusOutlined />}
            >
              Add Billing Address
            </Button>
          </Form.Item>
        )}
        {/* password */}
        <Form.Item
          name="password"
          label="Password"
          required={true}
          rules={[{ validator: validatePassword }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        {/* confirmPassword */}
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          required={true}
          rules={[{ validator: validateConfirmPassword }]}
        >
          <Input.Password />
        </Form.Item>

        {/* button */}
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button size="large" type="primary" htmlType="submit" loading={isLoading}>
            Register
          </Button>
        </Form.Item>
        <div>
          Are you already registered? <Link to="/signin">Sign In</Link>
        </div>
      </Form>
    </>
  );
};
