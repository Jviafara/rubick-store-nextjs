import menuConfigs from '@/lib/configs/menu.config'
import {
  addressEndpoints,
  BASE_URL,
  favoriteEndpoints,
  orderEndpoints,
  productsEndpoints,
  usersEndpoints,
  validateChangePassword,
  validateCreatePassword,
  validateEditProfile,
  videos,
} from '@/lib/constants'

describe('BASE_URL', () => {
  it('uses NEXT_PUBLIC_BASE_URL when set and falls back to localhost', () => {
    expect(BASE_URL).toBe(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
  })
})

describe('endpoints', () => {
  it('builds product endpoints', () => {
    expect(productsEndpoints.list('?page=1')).toBe('products?page=1')
    expect(productsEndpoints.add).toBe('products')
    expect(productsEndpoints.info('moyu-rs3m')).toBe('products/slug/moyu-rs3m')
    expect(productsEndpoints.infoById('p1')).toBe('products/p1')
    expect(productsEndpoints.update('p1')).toBe('products/p1')
    expect(productsEndpoints.remove('p1')).toBe('products/p1')
    expect(productsEndpoints.addImages('p1')).toBe('products/images/p1')
  })

  it('builds user endpoints', () => {
    expect(usersEndpoints.list).toBe('users')
    expect(usersEndpoints.info('u1')).toBe('users/u1')
    expect(usersEndpoints.orders('u1')).toBe('users/u1/orders')
  })

  it('builds favorite endpoints', () => {
    expect(favoriteEndpoints.list('?user=1')).toBe('favorites?user=1')
    expect(favoriteEndpoints.add).toBe('favorites')
    expect(favoriteEndpoints.remove).toBe('favorites')
  })

  it('builds order endpoints', () => {
    expect(orderEndpoints.list).toBe('orders')
    expect(orderEndpoints.userList).toBe('orders/user')
    expect(orderEndpoints.details('o1')).toBe('orders/o1')
    expect(orderEndpoints.orderPayment('o1')).toBe('orders/pay/o1')
    expect(orderEndpoints.update('o1')).toBe('orders/o1')
  })

  it('builds address endpoints', () => {
    expect(addressEndpoints.create).toBe('address')
    expect(addressEndpoints.default).toBe('address?type=default')
    expect(addressEndpoints.byId('a1')).toBe('address/a1')
    expect(addressEndpoints.delete('a1')).toBe('address/a1')
  })
})

describe('videos', () => {
  it('has unique, well-formed YouTube ids', () => {
    const ids = videos.map(video => video.id)

    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach(id => expect(id).toMatch(/^[\w-]{11}$/))
  })
})

describe('validateEditProfile', () => {
  it('accepts a valid profile with an optional phone', async () => {
    await expect(validateEditProfile.isValid({ name: 'Jesús', email: 'jesus@example.com' })).resolves.toBe(true)
    await expect(validateEditProfile.isValid({ name: 'Jesús', email: 'jesus@example.com', phone: '3001234567' })).resolves.toBe(true)
  })

  it('requires a name', async () => {
    await expect(validateEditProfile.validate({ name: '', email: 'jesus@example.com' })).rejects.toThrow('Full name required')
  })

  it('requires an email', async () => {
    await expect(validateEditProfile.validate({ name: 'Jesús', email: '' })).rejects.toThrow('Email required')
  })

  it('rejects an invalid email', async () => {
    await expect(validateEditProfile.validate({ name: 'Jesús', email: 'not-an-email' })).rejects.toThrow('Invalid email')
  })
})

describe('validateCreatePassword', () => {
  it('accepts matching passwords of valid length', async () => {
    await expect(validateCreatePassword.isValid({ newPassword: 'password1', confirmPassword: 'password1' })).resolves.toBe(true)
  })

  it('rejects passwords that do not match', async () => {
    await expect(validateCreatePassword.validate({ newPassword: 'password1', confirmPassword: 'password2' })).rejects.toThrow('Passwords must match')
  })

  it('rejects a password that is too short', async () => {
    await expect(validateCreatePassword.validate({ newPassword: 'short', confirmPassword: 'short' }, { abortEarly: false })).rejects.toMatchObject({
      errors: expect.arrayContaining(['Password minimum 8 characters']),
    })
  })

  it('rejects a password that is too long', async () => {
    const tooLong = 'a'.repeat(17)

    await expect(validateCreatePassword.validate({ newPassword: tooLong, confirmPassword: tooLong }, { abortEarly: false })).rejects.toMatchObject({
      errors: expect.arrayContaining(['Password maximum 16 characters']),
    })
  })

  it('requires both fields', async () => {
    await expect(validateCreatePassword.validate({}, { abortEarly: false })).rejects.toMatchObject({
      errors: expect.arrayContaining(['Password required', 'Comfirm Password required']),
    })
  })
})

describe('validateChangePassword', () => {
  const valid = { newPassword: 'password1', confirmPassword: 'password1', currentPassword: 'oldpassword' }

  it('accepts a complete, valid change request', async () => {
    await expect(validateChangePassword.isValid(valid)).resolves.toBe(true)
  })

  it('requires the current password', async () => {
    const { currentPassword, ...withoutCurrent } = valid
    void currentPassword

    await expect(validateChangePassword.validate(withoutCurrent)).rejects.toThrow('Comfirm Password required')
  })

  it('rejects passwords that do not match', async () => {
    await expect(validateChangePassword.validate({ ...valid, confirmPassword: 'different1' })).rejects.toThrow('Passwords must match')
  })
})

describe('menuConfigs', () => {
  it('defines the user profile tabs with unique states and matching paths', () => {
    expect(menuConfigs.user).toHaveLength(4)

    const states = menuConfigs.user.map(item => item.state)
    expect(new Set(states).size).toBe(states.length)

    menuConfigs.user.forEach(item => {
      expect(item.path).toBe(`/profile?tab=${item.tab}`)
    })
  })

  it('defines the admin sections', () => {
    expect(menuConfigs.admin.map(item => item.state)).toEqual(['order', 'users', 'products'])
  })
})
