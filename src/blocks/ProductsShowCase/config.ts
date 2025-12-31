import { Block } from 'payload'

export const ProductsShowCase: Block = {
  slug: 'productsShowCase',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
    },
    {
      name: 'products',
      type: 'relationship',
      admin: {
        isSortable: true,
      },
      hasMany: true,
      label: 'Products to show',
      relationTo: 'products',
    },
  ],

  interfaceName: 'ProductsShowCaseBlock',
  labels: { singular: 'Products Show Case', plural: 'Products Show Cases' },
}
