import { ModalPositions } from '@/lib/constants'
import reducer, { setModalService, toogleModalService } from '@/lib/redux/features/modalSlice'

describe('modalSlice', () => {
  it('starts closed and centered with a close button', () => {
    const { config } = reducer(undefined, { type: 'unknown' })

    expect(config.modalOpen).toBe(false)
    expect(config.position).toBe(ModalPositions.Center)
    expect(config.closeButton).toBe(true)
    expect(config.confirmButton).toBeNull()
    expect(config.cancelButton).toBeNull()
  })

  it('setModalService merges the given config over the current one', () => {
    const confirmButton = { label: 'Confirm', action: jest.fn() }

    const { config } = reducer(undefined, setModalService({ modalOpen: true, header: 'Delete item', confirmButton }))

    expect(config.modalOpen).toBe(true)
    expect(config.header).toBe('Delete item')
    expect(config.confirmButton).toBe(confirmButton)
    // untouched defaults are preserved
    expect(config.position).toBe(ModalPositions.Center)
    expect(config.closeButton).toBe(true)
  })

  it('closing the modal resets the whole config to its defaults', () => {
    const open = reducer(undefined, setModalService({ modalOpen: true, header: 'Delete item', subTitle: 'Are you sure?' }))

    const { config } = reducer(open, toogleModalService(false))

    expect(config.modalOpen).toBe(false)
    expect(config.header).toBe('')
    expect(config.subTitle).toBe('')
  })
})
