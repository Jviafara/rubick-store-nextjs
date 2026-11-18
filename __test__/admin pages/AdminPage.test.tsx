import AdminPage from '@/app/admin/page'
import { render, screen } from '@testing-library/react'

describe('Admin route', () => {
  it('shuold render "admin"', () => {
    render(<AdminPage />)

    expect(screen.getByText('admin')).toBeInTheDocument()
  })
})
