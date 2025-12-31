import { Block } from 'payload'

export const GoogleReview: Block = {
  slug: 'googleReview',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
    },
  ],
}
