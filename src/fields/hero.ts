import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from './linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    // Add rotating phrases field for High Impact hero
    {
      name: 'rotatingPhrases',
      type: 'array',
      label: 'Rotating Phrases (for High Impact hero)',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description:
          'Add multiple phrases that will rotate every 2 seconds. E.g., "Easy To Install", "Durable & Long-lasting"',
      },
      minRows: 2,
      maxRows: 10,
      fields: [
        {
          name: 'phrase',
          type: 'text',
          required: true,
          label: 'Phrase',
          admin: {
            placeholder: 'e.g., Easy To Install',
          },
        },
      ],
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
      appearances: ['primary', 'secondary', 'default', 'outline'],
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'image',
      label: 'Hero Image for Mobile',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
