import type { GlobalConfig } from 'payload'

export const siteSetting: GlobalConfig = {
  slug: 'siteSetting',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'SiteName',
      label: 'Webite Name',
      type: 'text',
    },
    {
      name: 'Logo',
      label: 'Website Logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'footerText',
      label: 'Footer Text',
      type: 'text',
    },
  ],
}
