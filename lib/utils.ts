import { Stripe, loadStripe } from '@stripe/stripe-js'
import { FullUser, IOrder, IProduct, ISolve, ProductSearchParamsProps } from './types'
// import { ModalPositions } from './constants'
import { toast } from 'react-toastify'
import { SortByEnum } from './constants'

export const getDate = (product: IProduct | IOrder | FullUser) => {
  const date = new Date(product.createdAt || '')
  return date
}

let stripePromise: Promise<Stripe | null>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// const getModalPositionClass = (position: ModalPositions) => {
//   switch (position) {
//     case 'top_center':
//       return 'inset'

//     default:
//       break
//   }
// }

// Formatear los segundos en MM:SS.d
export const formatearTiempo = (type: string, segundos: number, timeLeft?: number) => {
  if (type === 'running') {
    const minutos = Math.floor((segundos % 3600) / 60)
    const segundosRestantes = Math.floor(segundos % 60)
    const decimal = Math.floor((segundos - Math.floor(segundos)) * 10)

    const formatoMinutos = minutos.toString().padStart(2, '0')
    const formatoSegundos =
      segundosRestantes < 10 ? segundosRestantes.toString() : segundosRestantes.toString().padStart(2, '0')
    const formatoDecimal = decimal.toString()

    return `${formatoMinutos !== '00' ? formatoMinutos + ':' : ''}${formatoSegundos}.${formatoDecimal}`
  }
  if (type === 'stop') {
    const minutos = Math.floor((segundos % 3600) / 60)
    const segundosRestantes = Math.floor(segundos % 60)
    const decimal = Math.floor((segundos - Math.floor(segundos)) * 100)

    const formatoMinutos = minutos.toString().padStart(2, '0')
    const formatoSegundos =
      segundosRestantes < 10 ? segundosRestantes.toString() : segundosRestantes.toString().padStart(2, '0')
    const formatoDecimal = decimal.toString().padStart(2, '0')

    return `${formatoMinutos !== '00' ? formatoMinutos + ':' : ''}${formatoSegundos}.${formatoDecimal}`
  }

  const segundosRestantes = timeLeft! % 60
  const formatoSegundos = segundosRestantes.toString().padStart(2, '0')
  return `${formatoSegundos}`
}

export const getSolves = async () => {
  try {
    const res = await fetch('/api/solves')
    const data = await res.json()

    if (data) {
      return data
    }
    if (data.status) toast.error(data.message)
  } catch (error) {
    console.error(error)
  }
}

export const addNewSolve = async (time: number, scramble: string) => {
  try {
    await fetch('/api/solves', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time,
        scramble,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}

export const removeSolve = async (id: string) => {
  try {
    const res = await fetch('/api/solves', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })
    if (res) toast.success('Time removed Successfully!')
  } catch (error) {
    console.error(error)
  }
}

export const clearSolveHistory = async () => {
  try {
    const res = await fetch('/api/solves', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'clear',
      }),
    })
    if (res) toast.success('History clear Successfully!')
  } catch (error) {
    console.error(error)
  }
}

export const calcSolvesAverages = (solvesHistory: ISolve[]) => {
  let mo3, ao5, ao12, ao25, ao50, ao100
  if (solvesHistory.length >= 3) {
    const lastThree = solvesHistory.slice(0, 3).sort((a, b) => a.time - b.time)
    mo3 = lastThree.reduce((accumulator, current) => accumulator + current.time, 0) / 3
  }

  if (solvesHistory.length >= 5) {
    const lastFive = solvesHistory
      .slice(0, 5)
      .sort((a, b) => a.time - b.time)
      .slice(1, -1)
    ao5 = lastFive.reduce((accumulator, current) => accumulator + current.time, 0) / 3
  }

  if (solvesHistory.length >= 12) {
    const last12 = solvesHistory
      .slice(0, 12)
      .sort((a, b) => a.time - b.time)
      .slice(1, -1)

    ao12 = last12.reduce((accumulator, current) => accumulator + current.time, 0) / 10
  }

  if (solvesHistory.length >= 25) {
    const last25 = solvesHistory
      .slice(0, 12)
      .sort((a, b) => a.time - b.time)
      .slice(1, -1)

    ao25 = last25.reduce((accumulator, current) => accumulator + current.time, 0) / 23
  }

  if (solvesHistory.length >= 50) {
    const last50 = solvesHistory
      .slice(0, 12)
      .sort((a, b) => a.time - b.time)
      .slice(1, -1)

    ao50 = last50.reduce((accumulator, current) => accumulator + current.time, 0) / 48
  }

  if (solvesHistory.length >= 100) {
    const last100 = solvesHistory
      .slice(0, 12)
      .sort((a, b) => a.time - b.time)
      .slice(1, -1)

    ao100 = last100.reduce((accumulator, current) => accumulator + current.time, 0) / 98
  }

  return { mo3, ao5, ao12, ao25, ao50, ao100 }
}

export const findLowest = (solves: ISolve[]) => {
  const time = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.time ?? 0
    const lowestValue = prev.time ?? 0
    return currentValue < lowestValue ? current : prev
  })

  const mo3 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.mo3 ?? Infinity
    const lowestValue = prev.mo3 ?? Infinity
    return currentValue < lowestValue ? current : prev
  })

  const ao5 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao5 ?? Infinity
    const lowestValue = prev.ao5 ?? Infinity
    return currentValue < lowestValue ? current : prev
  })

  const ao12 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao12 ?? Infinity
    const lowestValue = prev.ao12 ?? Infinity
    return currentValue < lowestValue ? current : prev
  })
  const ao25 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao25 ?? Infinity
    const lowestValue = prev.ao25 ?? Infinity
    return currentValue < lowestValue ? current : prev
  })
  const ao50 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao50 ?? Infinity
    const lowestValue = prev.ao50 ?? Infinity
    return currentValue < lowestValue ? current : prev
  })
  const ao100 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao100 ?? Infinity
    const lowestValue = prev.ao100 ?? Infinity
    return currentValue < lowestValue ? current : prev
  })

  return { time, mo3, ao5, ao12, ao25, ao50, ao100 }
}

export const findHighest = (solves: ISolve[]) => {
  const time = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.time ?? 0
    const highestValue = prev.time ?? 0
    return currentValue > highestValue ? current : prev
  })

  const mo3 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.mo3 ?? -Infinity
    const highestValue = prev.mo3 ?? -Infinity
    return currentValue > highestValue ? current : prev
  })

  const ao5 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao5 ?? -Infinity
    const highestValue = prev.ao5 ?? -Infinity
    return currentValue > highestValue ? current : prev
  })

  const ao12 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao12 ?? -Infinity
    const highestValue = prev.ao12 ?? -Infinity
    return currentValue > highestValue ? current : prev
  })
  const ao25 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao25 ?? -Infinity
    const highestValue = prev.ao25 ?? -Infinity
    return currentValue > highestValue ? current : prev
  })
  const ao50 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao50 ?? -Infinity
    const highestValue = prev.ao50 ?? -Infinity
    return currentValue > highestValue ? current : prev
  })
  const ao100 = solves.reduce((prev: ISolve, current: ISolve) => {
    const currentValue = current.ao100 ?? -Infinity
    const highestValue = prev.ao100 ?? -Infinity
    return currentValue > highestValue ? current : prev
  })

  return { time, mo3, ao5, ao12, ao25, ao50, ao100 }
}

export const getParamsString = ({ query, page, pageSize, filter, priceFilter, sortBy }: ProductSearchParamsProps) => {
  return `?query=${query || ''}&page=${page || '1'}&page_size=${pageSize || '10'}&filter=${filter || 'All products'}&price_min=${priceFilter ? priceFilter[0] : '0'}&price_max=${priceFilter ? priceFilter[1] : 'Infinity'}&sort_by=${sortBy}`
}

export const getSortRule = (sortBy: string) => {
  if (sortBy === SortByEnum.lower_higher) {
    return JSON.stringify({ price: 1 })
  }

  if (sortBy === SortByEnum.higher_lower) {
    return JSON.stringify({ price: -1 })
  }

  if (sortBy === SortByEnum.latest) {
    return JSON.stringify({ createdAt: -1 })
  }

  if (sortBy === SortByEnum.top_rated) {
    return JSON.stringify({ rating: -1 })
  }

  if (sortBy === SortByEnum.best_sellers) {
    return JSON.stringify({ totalSold: -1 })
  }

  return JSON.stringify({ createdAt: -1 })
}

export const getRamdomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min)
  const maxFlored = Math.floor(max)
  console.log(minCeiled, maxFlored, Math.floor(Math.random() * (maxFlored - minCeiled + 1) + minCeiled))
  return Math.floor(Math.random() * (maxFlored - minCeiled + 1) + minCeiled)
}
