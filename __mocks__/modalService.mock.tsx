import { ModalPositions } from '@/lib/constants'

export const mockClearCartModal = {
  modalOpen: false,
  header: 'Clear Cart!',
  subTitle: 'This action can not be reverted.',
  position: ModalPositions.Center,
  children: <h1>Are you sure you want to remove all items?</h1>,
  confirmButton: {
    label: 'Clear',
    color: 'secondary',
    action: jest.fn(),
  },
  cancelButton: {
    label: 'cancel',
    color: 'primary',
    action: jest.fn(),
  },
}
