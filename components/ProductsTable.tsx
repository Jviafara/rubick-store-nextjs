import ProductNotFound from '@/app/(store pages)/product/[...all]/not-found'
import { productApi } from '@/lib/modules/productsApiClient'
import { IPagination, IProduct, ProductsTableProps } from '@/lib/types'
import { getParamsString } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import LoadingThreeDotsPulse from './LoadingThreeDotsPulse'
import Image from 'next/image'
import { FaEdit } from 'react-icons/fa'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { setModalService } from '@/lib/redux/features/modalSlice'
import { ModalPositions } from '@/lib/constants'
import ProductForm from './ProductForm'

const ProductsTable = ({ query, sortBy, filter, priceFilter }: ProductsTableProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])
  const [pagination, setPagination] = useState<IPagination | null>(null)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('page_size') || '12'
  const [loading, setLoading] = useState(false)

  const paramsString = getParamsString({ query, page, pageSize, filter, priceFilter, sortBy })

  const handlePageChange = (pageNumber: number) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(pageNumber))
      router.push(`?${params.toString()}`)
    } catch (e) {
      if (e) toast.error('Redirecing')
      router.push(getParamsString({ query, page, pageSize, filter, priceFilter, sortBy }))
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      try {
        const { res, error } = await productApi.getList(paramsString)

        const fetchedProducts = Array.isArray(res) ? res : (res?.products ?? [])
        const fetchedPagination = res.pagination

        if (res?.status || error) {
          setProducts([])

          setPagination(null)
          toast.error(res.message)

          return
        }

        setProducts(fetchedProducts)
        setPagination(fetchedPagination)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong while loading products')
        setProducts([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }
    getProducts()
  }, [paramsString, refreshVersion])

  const getPageNumbers = (totalPages: number, current: number) => {
    const pages: number[] = []
    const maxButtons = 7
    let start = Math.max(1, current - Math.floor(maxButtons / 2))
    const end = Math.min(totalPages, start + maxButtons - 1)

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1)
    }

    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const handleEdit = (product: IProduct) => {
    dispatch(
      setModalService({
        modalOpen: true,
        header: 'Edit Product',
        subTitle: `Product id: ${product._id.toString()}`,
        children: (
          <ProductForm
            product={product}
            onUpdated={() => setRefreshVersion(version => version + 1)}
          />
        ),
        position: ModalPositions.center,
        confirmButton: null,
        cancelButton: null,
      }),
    )
  }

  if (products.length <= 0 || !pagination) return <ProductNotFound />

  return (
    <>
      {loading ? (
        <section className='w-full h-[50vh] flex items-center justify-center'>
          <LoadingThreeDotsPulse />
        </section>
      ) : (
        <section className='flex flex-col items-center justify-center w-full gap-4 overflow-x-auto rounded-2xl'>
          <table className='w-full text-main mb-4'>
            <thead className='border-b border-muted'>
              <tr className='bg-muted/20'>
                <th
                  scope='col'
                  className='w-0'
                ></th>
                <th
                  scope='col'
                  className='w-0'
                ></th>
                <th
                  scope='col'
                  className='text-center! '
                >
                  Name
                </th>
                <th
                  scope='col'
                  className='text-center! '
                >
                  Price
                </th>
                <th
                  scope='col'
                  className='text-center!'
                >
                  Sold
                </th>
                <th
                  scope='col'
                  className='text-center!'
                >
                  Stock
                </th>

                <th
                  scope='col'
                  className='w-0'
                ></th>
              </tr>
            </thead>
            <tbody className='w-full'>
              {products.map((product, index) => (
                <tr
                  key={product.slug}
                  className='even:bg-muted/20 border-b border-x border-muted'
                >
                  <td scope='row'>{index + 1 + (pagination.currentPage - 1) * parseInt(pageSize)}</td>
                  <td scope='row'>
                    <div className='relative w-20 aspect-square  '>
                      <Image
                        src={product.images![0]}
                        alt={'Image'}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        loading='lazy'
                        className='object-contain z-0 rounded-2xl p-1'
                      />
                    </div>
                  </td>
                  <td
                    scope='row'
                    className='text-center! max-w-fit!'
                  >
                    {product.name}
                  </td>
                  <td
                    scope='row'
                    className='text-center!'
                  >
                    ${product.price}
                  </td>
                  <td
                    scope='row'
                    className='text-center!'
                  >
                    {product.totalSold}
                  </td>
                  <td
                    scope='row'
                    className='text-center!'
                  >
                    {product.countInStock}
                  </td>
                  <td
                    scope='row'
                    className='text-center!'
                  >
                    <button
                      onClick={() => handleEdit(product)}
                      className='hover:text-primary px-2 py-1'
                    >
                      <FaEdit size={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          {pagination && pagination.totalPages > 1 && products.length > 0 && (
            <div className='w-fit max-w-[80vw] mt-8 flex items-center justify-center flex-wrap gap-2'>
              <button
                onClick={() => handlePageChange(Math.max(1, (pagination.currentPage || 1) - 1))}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-1 rounded-xl border ${!pagination.hasPrevPage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/30'}`}
              >
                Prev
              </button>

              {getPageNumbers(pagination.totalPages, pagination.currentPage).map(p => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 rounded-xl border ${p === pagination.currentPage ? 'bg-muted/40 text-white' : 'hover:bg-muted/30'}`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, (pagination.currentPage || 1) + 1))}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-1 rounded-xl border ${!pagination.hasNextPage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/30'}`}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
    </>
  )
}

export default ProductsTable
