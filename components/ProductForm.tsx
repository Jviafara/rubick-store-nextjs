import { createProductSchema, emptyProduct, ProductCategory } from '@/lib/constants'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { toogleModalService } from '@/lib/redux/features/modalSlice'
import { IProduct } from '@/lib/types'
import { Field, FormikProvider, useFormik } from 'formik'
import { toast } from 'react-toastify'
import isEqual from 'lodash/isEqual'

interface ProductForm {
  product?: IProduct
  onUpdated?: () => void
}

const inputStyle = {
  error: `ring-red-500 ring-1 bg-red-100 text-red-700 placeholder:text-red-500`,
  default: `w-full border border-muted focus:outline focus:outline-primary focus:border-none rounded-2xl px-2 py-1`,
}

const ProductForm = ({ product, onUpdated }: ProductForm) => {
  const dispatch = useAppDispatch()
  const categories = Object.values(ProductCategory)

  const saveProduct = async (values: IProduct) => {
    const hasDifferences = !isEqual({ ...product }, { ...values })
    if (!hasDifferences) {
      toast.info('No hay cambios para guardar')
      dispatch(toogleModalService(false))
      return
    }
    try {
      const { res, error } = await productApi.update(values)
      if (res.status || error) {
        toast.error(res.message || error || 'Error al actualizar el producto')
        return
      }
      if (res) {
        toast.success('Producto actualizado correctamente')
        onUpdated?.()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      dispatch(toogleModalService(false))
    }
  }

  const createProduct = async (values: IProduct) => {
    try {
      // const { res, error } = await productApi.create(values)
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      dispatch(toogleModalService(false))
    }
  }

  const productForm = useFormik({
    initialValues: product ? { ...product } : { ...emptyProduct },
    validationSchema: createProductSchema,
    onSubmit: async values => {
      dispatch(toogleModalService(false))
      if (product?._id) {
        await saveProduct(values as IProduct)
      } else {
        await createProduct(values as IProduct)
      }
    },
  })

  return (
    <div className='w-full min-w-[50vw]'>
      <FormikProvider value={productForm}>
        <form
          id='product-form'
          onSubmit={productForm.handleSubmit}
          className='w-full flex flex-col items-center gap-4 text-lg mt-6 text-left'
        >
          <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center justify-between'>
            <label
              htmlFor='name'
              className='w-fit text-muted'
            >
              Name*
            </label>
            <div className='w-full max-w-[80%] flex flex-col'>
              <Field
                type='text'
                id='name'
                name='name'
                onChange={productForm.handleChange}
                value={productForm.values.name}
                className={`${inputStyle.default} ${productForm.touched.name && productForm.errors.name && inputStyle.error}`}
              />
              <p className='text-sm text-red-600'>{productForm.touched.name && productForm.errors.name}</p>
            </div>
          </div>
          <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center justify-between'>
            <label
              htmlFor='slug'
              className='w-fit text-muted'
            >
              Slug*
            </label>
            <div className='w-full max-w-[80%] flex flex-col'>
              <Field
                type='text'
                id='slug'
                name='slug'
                onChange={productForm.handleChange}
                value={productForm.values.slug}
                className={`${inputStyle.default} ${productForm.touched.slug && productForm.errors.slug && inputStyle.error}`}
              />
              <p className='text-sm text-red-600'>{productForm.touched.slug && productForm.errors.slug}</p>
            </div>
          </div>
          <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center justify-between'>
            <label
              htmlFor='description'
              className='w-fit text-muted'
            >
              Description*
            </label>
            <div className='w-full max-w-[80%] flex flex-col'>
              <Field
                type='text'
                id='description'
                name='description'
                onChange={productForm.handleChange}
                value={productForm.values.description}
                className={`${inputStyle.default} ${productForm.touched.description && productForm.errors.description && inputStyle.error}`}
              />
              <p className='text-sm text-red-600'>{productForm.touched.description && productForm.errors.description}</p>
            </div>
          </div>
          <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center justify-between'>
            <label
              htmlFor='category'
              className='w-fit text-muted'
            >
              Catedory*
            </label>
            <div className='w-full max-w-[80%] flex flex-col'>
              <Field
                as='select'
                id='category'
                name='category'
                onChange={productForm.handleChange}
                value={productForm.values.category}
                className={`${inputStyle.default} ${productForm.touched.category && productForm.errors.category && inputStyle.error}`}
              >
                <option value=''>-- Elige una opción --</option>
                {categories.map((cat, index) => (
                  <option
                    key={index}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </Field>
              <p className='text-sm text-red-600'>{productForm.touched.category && productForm.errors.category}</p>
            </div>
          </div>
          <section className='w-[90%] flex justify-between'>
            <div className='w-[50%] flex flex-col md:flex-row gap-4 items-center'>
              <label
                htmlFor='price'
                className='w-[40%] text-muted text-nowrap'
              >
                Price* (USD)
              </label>
              <div className='w-full max-w-[60%] flex flex-col'>
                <Field
                  type='number'
                  id='price'
                  name='price'
                  min={0}
                  onChange={productForm.handleChange}
                  value={productForm.values.price}
                  className={`${inputStyle.default} ${productForm.touched.price && productForm.errors.price && inputStyle.error}`}
                />
                <p className='text-sm text-red-600'>{productForm.touched.price && productForm.errors.price}</p>
              </div>
            </div>
            <div className='w-[50%] flex flex-col md:flex-row gap-4 items-center pl-8'>
              <label
                htmlFor='countInStock'
                className='w-[40%] text-muted'
              >
                Stock*
              </label>
              <div className='w-full flex flex-col'>
                <Field
                  type='number'
                  id='countInStock'
                  name='countInStock'
                  min={0}
                  onChange={productForm.handleChange}
                  value={productForm.values.countInStock}
                  className={`${inputStyle.default} ${productForm.touched.countInStock && productForm.errors.countInStock && inputStyle.error}`}
                />
                <p className='text-sm text-red-600'>{productForm.touched.countInStock && productForm.errors.countInStock}</p>
              </div>
            </div>
          </section>
          <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center justify-between'>
            <label
              htmlFor='brand'
              className='w-fit text-muted'
            >
              Brand
            </label>
            <div className='w-full max-w-[80%] flex flex-col'>
              <Field
                type='text'
                id='brand'
                name='brand'
                onChange={productForm.handleChange}
                value={productForm.values.brand}
                className={`${inputStyle.default} ${productForm.touched.brand && productForm.errors.brand && inputStyle.error}`}
              />
              <p className='text-sm text-red-600'>{productForm.touched.brand && productForm.errors.brand}</p>
            </div>
          </div>
          <section className='flex w-full justify-between md:max-w-[50%] px-8'>
            <button
              type='button'
              onClick={() => dispatch(toogleModalService(false))}
              className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 border-secondary hover:bg-secondary/70`}
            >
              Cancel
            </button>

            <button
              type='submit'
              form='product-form'
              disabled={productForm.isSubmitting || !productForm.isValid}
              className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 bg-primary/70 hover:bg-primary ${productForm.isSubmitting || !productForm.isValid ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {product ? 'Save' : 'Create'}
            </button>
          </section>
        </form>
      </FormikProvider>
    </div>
  )
}

export default ProductForm
