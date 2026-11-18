export const mockUser = {
  _id: '6a6776dd664af3fff52362af',
  name: 'jesus viafara',
  email: 'jealvito@gmail.com',
  emailVerified: true,
  image: 'https://lh3.googleusercontent.com/a/ACg8ocJvXwp9vPwP8anZ6v-T8rgMyrsIE_3fnAZl5tocEGuXR4OWvg=s96-c',
  role: 'admin',
  phone: '+57 3016288717',
  defaultAddress: '6a8cb5a5f84ffbf1949e4dc4',
  save: jest.fn().mockResolvedValue(true),
}

export const mockUserSession = {
  token: '60vP5iq6XCPQVqdpcOEa9EmUGW4l3EWe',
  ipAddress: '0000:0000:0000:0000:0000:0000:0000:0000',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36',
  userId: '1',
}
