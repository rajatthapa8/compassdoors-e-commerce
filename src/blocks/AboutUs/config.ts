import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const AboutUs: Block = {
  slug: 'AboutUs',
  interfaceName: 'AboutUsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      required: true,
    },
    {
      name: 'bulletPoints',
      required: true,
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => {
          return [
            ...defaultFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            LinkFeature({}),
            UnorderedListFeature(),
            OrderedListFeature(),
          ]
        },
      }),
      label: 'Bullet Points',
    },

    {
      name: 'media1',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'media2',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'media3',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  labels: { singular: 'About Show Case', plural: 'About Show Cases' },
}
