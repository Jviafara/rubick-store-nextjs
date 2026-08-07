import { headers } from 'next/headers'
import { auth } from '../auth/auth'

export async function setUserPassword(newPassword: string) {
  try {
    await auth.api.setPassword({
      body: {
        newPassword,
      },
      headers: await headers(),
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to set password:', error)

    return {
      success: false,
      error: 'Failed to set password',
    }
  }
}

interface ChangeUserPasswordProps {
  newPassword: string
  currentPassword: string
}

export async function changeUserPassword({ newPassword, currentPassword }: ChangeUserPasswordProps) {
  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to set password:', error)

    return {
      success: false,
      error: 'Failed to set password',
    }
  }
}
