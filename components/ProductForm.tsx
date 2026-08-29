import { createProductSchema } from '@/lib/constants'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { toogleModalService } from '@/lib/redux/features/modalSlice'
import { IProduct } from '@/lib/types'
import { Field, FormikProvider, useFormik } from 'formik'

interface ProductForm {
  product: IProduct
}

const inputStyle = {
  error: `ring-red-500 ring-1 bg-red-100`,
  default: `w-full border border-muted focus:outline focus:outline-primary focus:border-none rounded-2xl px-2 py-1`,
}

const ProductForm = ({ product }: ProductForm) => {
  const dispatch = useAppDispatch()
  const productForm = useFormik({
    initialValues: { ...product },
    validationSchema: createProductSchema,
    onSubmit: async values => {},
  })
  return (
    <div className='w-full min-w-[50vw]'>
      <FormikProvider value={productForm}>
        <form
          onSubmit={productForm.handleSubmit}
          className='w-full flex flex-col items-center gap-4 text-lg mt-6'
        >
          <div className='w-[90%] flex flex-col md:flex-row gap-4 items-center'>
            <label
              htmlFor='name'
              className='w-fit text-muted'
            >
              Name
            </label>
            <div className='w-full flex flex-col'>
              <Field
                id='name'
                name='name'
                type='text'
                onChange={productForm.handleChange}
                className={`${inputStyle.default} ${productForm.touched.name && productForm.errors.name && inputStyle.error}`}
              />
              <p className='text-sm text-red-600'>{productForm.touched.name && productForm.errors.name}</p>
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
              className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 bg-primary/70 hover:bg-primary`}
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
