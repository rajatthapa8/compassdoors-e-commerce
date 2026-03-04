import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  slug: 'products',
  access: {
    read: () => true,
    create: defaultCollection.access?.create,
    update: defaultCollection.access?.update,
    delete: defaultCollection.access?.delete,
  },
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'slug', '_status'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                // {
                //   name: 'variantOption',
                //   type: 'relationship',
                //   relationTo: 'variantOptions',
                //   admin: {
                //     condition: (data) => {
                //       return data?.enableVariants === true && data?.variantTypes?.length > 0
                //     },
                //   },
                //   filterOptions: ({ data }) => {
                //     if (data?.enableVariants && data?.variantTypes?.length) {
                //       const variantTypeIDs = data.variantTypes.map((item: any) => {
                //         if (typeof item === 'object' && item?.id) {
                //           return item.id
                //         }
                //         return item
                //       }) as DefaultDocumentIDType[]

                //       if (variantTypeIDs.length === 0)
                //         return {
                //           variantType: {
                //             in: [],
                //           },
                //         }

                //       const query: Where = {
                //         variantType: {
                //           in: variantTypeIDs,
                //         },
                //       }

                //       return query
                //     }

                //     return {
                //       variantType: {
                //         in: [],
                //       },
                //     }
                //   },
                // },
              ],
            },

            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            ...defaultCollection.fields.filter(
              (field) => 'name' in field && field.name !== 'priceInUSD',
            ),
            {
              name: 'priceInUSD',
              type: 'number',
              required: false,
              min: 0,
              admin: {
                step: 0.01,
                description: 'Enter price in dollars (e.g., 10.99)',
                placeholder: '0.00',
              },
              // Add this to format the value for display
              hooks: {
                afterRead: [
                  ({ value }) => {
                    if (typeof value === 'number') {
                      // If value is like 1200, convert to 12.00 for display
                      return value / 100
                    }
                    return value
                  },
                ],
                beforeChange: [
                  ({ value }) => {
                    if (typeof value === 'number') {
                      // If user enters 12.00, convert to 1200 for storage
                      return value * 100
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
          ],
          label: 'Product Details',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    slugField(),
  ],
})
