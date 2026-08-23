import { authClient } from '@/lib/auth/auth-client'
import { FullUser, IShippingAddress } from '@/lib/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosSave } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { Field, FormikProvider, useFormik } from 'formik'
import { toast } from 'react-toastify'
import { userApi } from '@/lib/modules/userApiClient'
import { validateChangePassword, validateCreatePassword, validateEditProfile } from '@/lib/constants'
import { CiUser } from 'react-icons/ci'

interface IUserDetails {
  user: FullUser
  totalOrders: number
  defaultAddress: IShippingAddress | null
}

const inputStyle = {
  error: `ring-red-500 ring-1 bg-red-100`,
  default: `w-full border border-muted focus:outline focus:outline-primary focus:border-none rounded-2xl px-2 py-1`,
}

const UserDetails = ({ user, totalOrders, defaultAddress }: IUserDetails) => {
  const { refetch } = authClient.useSession()
  const [edit, setEdit] = useState(false)

  const [openChangePassword, setOpenChangePassword] = useState(false)
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkPassword() {
      // Fetch all accounts linked to the logged-in user
      const { data: accounts } = await authClient.listAccounts()

      if (accounts) {
        // If a 'credential' provider exists, they have an email/password login
        const passwordExists = accounts.some(acc => acc.providerId === 'credential')
        setHasPassword(passwordExists)
      }
    }
    checkPassword()
  }, [])

  const toogleEdit = () => {
    setEdit(prev => !prev)
  }

  const editProfile = useFormik({
    initialValues: { ...user },
    validationSchema: validateEditProfile,
    onSubmit: async values => {
      const body = { name: values.name, phone: values.phone, type: 'edit-profile' }
      const { res, error } = await userApi.update({ id: user.id, body })
      if (res.status || error) {
        toast.error(res.message)
        return
      }

      changePassword.resetForm()
      setOpenChangePassword(false)
      toast.success('User Info Updated Successfully!')
      await refetch()
      setEdit(false)
    },
  })

  const changePassword = useFormik({
    initialValues: { newPassword: '', confirmPassword: '', currentPassword: '' },
    validationSchema: hasPassword ? validateChangePassword : validateCreatePassword,
    onSubmit: async values => {
      if (hasPassword) {
        const body = { newPassword: values.newPassword, currentPassword: values.currentPassword, type: 'change' }
        const { res, error } = await userApi.updatePassword({ id: user.id, body })
        if (res.status || error) {
          toast.error(res.message)
          return
        }
        changePassword.resetForm()
        setOpenChangePassword(false)
        toast.success('Password Updated Successfully!')
        return
      }
      const body = { newPassword: values.newPassword, currentPassword: values.currentPassword, type: 'create' }
      const { res, error } = await userApi.updatePassword({ id: user.id, body })
      if (res.status || error) {
        toast.error(res.message)
        return
      }

      changePassword.resetForm()
      setOpenChangePassword(false)
      toast.success('Password Updated Successfully!')
    },
  })

  return (
    <section className='w-full lg:max-w-[70%] flex flex-col lg:flex-row items-center lg:items-start  gap-8'>
      {/* User Profile */}
      <div className='card-gradient-cyan-magenta w-full max-w-[95%] lg:max-w-[80%] lg:flex-1 px-2 py-2 flex flex-col  gap-4'>
        <h1 className='uppercase font-semibold text-lg'>User Information</h1>
        {user && (
          <div className='w-full flex flex-col items-center text-center gap-4'>
            <div className='relative w-32 h-32 card-gradient-cyan-magenta rounded-full!'>
              {user.image ? (
                <Image
                  src={user.image || ''}
                  alt='Profile Image'
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  loading='eager'
                  className='object-cover rounded-full'
                />
              ) : (
                <CiUser className='w-full h-full' />
              )}
            </div>
            <div>
              <h1 className='text-center text-2xl font-semibold font-plus-jakarta-sans relative'>
                {user.name
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                {user.emailVerified && (
                  <span className='absolute top-0 text-tertiary'>
                    <FaCheckCircle size={16} />
                  </span>
                )}
              </h1>
              <p className='text-muted'>{user.email}</p>
            </div>

            <div className='card-gradient-cyan-magenta w-[90%]'>
              {edit ? (
                <button
                  type='submit'
                  form='edit-profile-form'
                  className='w-full px-4 py-2 upper text-lg flex gap-2 items-center justify-center'
                >
                  <IoIosSave />
                  Save Profile
                </button>
              ) : (
                <div
                  onClick={toogleEdit}
                  className='w-full px-4 py-2 upper text-lg  flex gap-2 items-center justify-center'
                >
                  <MdEdit />
                  Edit Profile
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* User Full information */}
      <div className='border border-muted rounded-xl bg-surface py-8 w-full max-w-[95%] lg:max-w-[85%] lg:flex-2 h-full'>
        {user && (
          <FormikProvider value={editProfile}>
            <form
              id='edit-profile-form'
              onSubmit={editProfile.handleSubmit}
              className='w-full flex flex-col items-center gap-4 text-lg'
            >
              <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center '>
                <label
                  htmlFor='name'
                  className='flex-1 w-full text-muted'
                >
                  Full Name
                </label>
                {!edit ? (
                  <h1 className='flex-2 xl:flex-3'>
                    {user.name
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </h1>
                ) : (
                  <div className='w-full flex-2 xl:flex-3'>
                    <Field
                      type='text'
                      id='name'
                      name='name'
                      onChange={editProfile.handleChange}
                      value={editProfile.values.name}
                      className='w-full  border border-muted focus:outline focus:outline-primary focus:border-none rounded-2xl px-2 py-1'
                    />
                    <p className='text-sm text-red-600'>{editProfile.touched.name && editProfile.errors.name}</p>
                  </div>
                )}
              </div>
              <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center '>
                <label
                  htmlFor='email'
                  className='flex-1 w-full text-muted'
                >
                  Email
                </label>
                <h1 className='flex-2 xl:flex-3'>{user.email}</h1>
              </div>
              <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center '>
                <label
                  htmlFor='phone'
                  className='flex-1 w-full text-muted'
                >
                  Phone
                </label>
                {!edit ? (
                  <h1 className='flex-2 xl:flex-3'>{user.phone}</h1>
                ) : (
                  <div className='w-full flex-2 xl:flex-3'>
                    <p className='text-muted text-xs ml-4'>Include yor country code</p>
                    <Field
                      type='text'
                      id='phone'
                      name='phone'
                      onChange={editProfile.handleChange}
                      value={editProfile.values.phone}
                      className='w-full flex-2 xl:flex-3 border border-muted focus:outline focus:outline-primary focus:border-none rounded-2xl px-2 py-1'
                    />
                    <p className='text-sm text-red-600'>{editProfile.touched.phone && editProfile.errors.phone}</p>
                  </div>
                )}
              </div>
              {!edit && (
                <section className='w-full flex flex-col items-center gap-4'>
                  <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center '>
                    <h1 className='flex-1 w-full text-muted text-nowrap'>Member Since</h1>
                    <h1 className='flex-2 xl:flex-3'>
                      {new Date(user.createdAt!).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h1>
                  </div>
                  <div className='w-[90%] flex gap-4 items-center '>
                    <h1 className='flex-1 w-full text-muted text-nowrap'>Total Orders</h1>
                    <h1 className='flex-2 xl:flex-3'>{totalOrders}</h1>
                  </div>
                  {defaultAddress && (
                    <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center '>
                      <h1 className='flex-1 w-full text-muted text-nowrap'>Address</h1>
                      <h1 className='flex-2 xl:flex-3 text-muted text-sm line-clamp-2 text-center md:text-left'>
                        {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.country}
                      </h1>
                    </div>
                  )}
                </section>
              )}
            </form>
          </FormikProvider>
        )}

        {openChangePassword ? (
          <FormikProvider value={changePassword}>
            <form
              onSubmit={changePassword.handleSubmit}
              className='w-full flex flex-col items-center gap-4 text-lg mt-6'
            >
              {hasPassword && (
                <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center'>
                  <label
                    htmlFor='current-password'
                    className='flex-1 w-full text-muted'
                  >
                    Current Password
                  </label>
                  <div className='w-full flex-2 flex flex-col'>
                    <Field
                      id='current-password'
                      name='currentPassword'
                      type='password'
                      onChange={changePassword.handleChange}
                      className={`${inputStyle.default} ${changePassword.touched.currentPassword && changePassword.errors.currentPassword && inputStyle.error}`}
                    />
                    <p className='text-sm text-red-600'>
                      {changePassword.touched.currentPassword && changePassword.errors.currentPassword}
                    </p>
                  </div>
                </div>
              )}

              <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center'>
                <label
                  htmlFor='new-password'
                  className='flex-1 w-full text-muted'
                >
                  New Password
                </label>
                <div className='w-full flex-2 flex flex-col'>
                  <Field
                    id='new-password'
                    name='newPassword'
                    type='password'
                    onChange={changePassword.handleChange}
                    className={`${inputStyle.default} ${changePassword.touched.newPassword && changePassword.errors.newPassword && inputStyle.error}`}
                  />
                  <p className='text-sm text-red-600'>
                    {changePassword.touched.newPassword && changePassword.errors.newPassword}
                  </p>
                </div>
              </div>
              <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center'>
                <label
                  htmlFor='confirm-password'
                  className='flex-1 w-full text-muted'
                >
                  Confirm Password
                </label>
                <div className='w-full flex-2 flex flex-col'>
                  <Field
                    id='confirm-password'
                    name='confirmPassword'
                    type='password'
                    onChange={changePassword.handleChange}
                    className={`${inputStyle.default} ${changePassword.touched.confirmPassword && changePassword.errors.confirmPassword && inputStyle.error}`}
                  />
                  <p className='text-sm text-red-600'>
                    {changePassword.touched.confirmPassword && changePassword.errors.confirmPassword}
                  </p>
                </div>
              </div>
              <div className='w-[50%] mt-4 py-2 flex justify-center card-base hover-gradient-emerald-cyan justify-self-center'>
                <button
                  type='submit'
                  className='text-lg'
                >
                  Change Password
                </button>
              </div>
            </form>
          </FormikProvider>
        ) : (
          <div className='w-[50%] mt-6 py-2 flex justify-center card-base hover-gradient-emerald-cyan justify-self-center'>
            <button
              type='button'
              onClick={() => setOpenChangePassword(prev => !prev)}
              className='text-lg'
            >
              {hasPassword ? 'Change Password' : 'Create Password'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default UserDetails
