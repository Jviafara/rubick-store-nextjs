import { addFavorite } from '@/lib/redux/features/favoriteSlice'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { setModalService, toogleModalService } from '@/lib/redux/features/modalSlice'
import { store } from '@/lib/redux/store'
import { makeFavorite } from '@/__test__/utils/factories'

describe('store', () => {
  afterEach(() => {
    store.dispatch(setGlobalLoading(false))
    store.dispatch(toogleModalService(false))
  })

  it('combines all feature slices', () => {
    expect(Object.keys(store.getState()).sort()).toEqual(['cart', 'favoriteList', 'globalLoading', 'modalService', 'themeMode'])
  })

  it('routes actions to the right slice', () => {
    store.dispatch(setGlobalLoading(true))

    expect(store.getState().globalLoading.globalLoading).toBe(true)
    expect(store.getState().cart.cartItems).toEqual([])
  })

  it('stores favorites through the root reducer', () => {
    store.dispatch(addFavorite(makeFavorite('p1')))

    expect(store.getState().favoriteList.favoriteList.map(f => f.product)).toContain('p1')
  })

  it('accepts non-serializable payloads such as modal icons without complaining', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    store.dispatch(setModalService({ modalOpen: true, icon: () => null }))

    expect(store.getState().modalService.config.modalOpen).toBe(true)
    expect(consoleError).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })
})
