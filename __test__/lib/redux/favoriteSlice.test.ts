import reducer, { addFavorite, removeFavorite, setFavoriteList } from '@/lib/redux/features/favoriteSlice'
import { makeFavorite } from '@/__test__/utils/factories'

describe('favoriteSlice', () => {
  it('starts with an empty favorites list', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ favoriteList: [] })
  })

  it('setFavoriteList replaces the list', () => {
    const list = [makeFavorite('p1'), makeFavorite('p2')]

    expect(reducer({ favoriteList: [makeFavorite('old')] }, setFavoriteList(list)).favoriteList).toEqual(list)
  })

  it('addFavorite puts the new favorite first', () => {
    const state = reducer({ favoriteList: [makeFavorite('p1')] }, addFavorite(makeFavorite('p2')))

    expect(state.favoriteList.map(f => f.product)).toEqual(['p2', 'p1'])
  })

  it('removeFavorite removes by product id', () => {
    const state = reducer({ favoriteList: [makeFavorite('p1'), makeFavorite('p2')] }, removeFavorite('p1'))

    expect(state.favoriteList.map(f => f.product)).toEqual(['p2'])
  })

  it('removeFavorite does nothing when the product is not a favorite', () => {
    const state = reducer({ favoriteList: [makeFavorite('p1')] }, removeFavorite('nope'))

    expect(state.favoriteList).toHaveLength(1)
  })
})
