const mockedResult = {
  success: true,
  data: {
    id: 'ef9fe559-1539-427b-83e0-8f2ce80d942a',
    version: 2,
    versionModifiedAt: '2023-08-12T08:08:23.671Z',
    lastMessageSequenceNumber: 2,
    createdAt: '2023-08-12T08:08:01.799Z',
    lastModifiedAt: '2023-08-12T08:08:23.671Z',
    lastModifiedBy: {
      isPlatformClient: true,
      user: {
        typeId: 'user',
        id: '75968ee5-94d2-483e-9343-bc8fd3863c08',
      },
    },
    createdBy: {
      isPlatformClient: true,
      user: {
        typeId: 'user',
        id: '75968ee5-94d2-483e-9343-bc8fd3863c08',
      },
    },
    email: 'test@test.com',
    firstName: 'test',
    lastName: '',
    middleName: '',
    title: '',
    salutation: '',
    password: '****14E=',
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    isEmailVerified: false,
    stores: [],
    authenticationMode: 'Password',
  },
};

export const useAuth = jest.fn().mockResolvedValue(mockedResult);
