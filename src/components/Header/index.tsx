import { getCachedGlobal } from '@/utilities/getGlobals'

import { HeaderClient } from './index.client'
import './index.css'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const settings = await getCachedGlobal('site-setting', 1)()
  console.log(header, 'header in header component')
  return <HeaderClient header={header} setting={settings} />
}

//follwing code has been written because of caching issues eg when header is updated it is not reflecting on the site immediately
// import { getCachedGlobal } from '@/utilities/getGlobals'
// import config from '@payload-config'
// import { getPayload } from 'payload'
// import { HeaderClient } from './index.client'
// export async function Header() {
//   const payload = await getPayload({ config })
//   const settings = await getCachedGlobal('site-setting', 1)()
//   // Directly fetching from DB, bypassing the 'getCachedGlobal' cache
//   const header = await payload.findGlobal({
//     slug: 'header',
//     depth: 1,
//   })

//   return <HeaderClient header={header} setting={settings} />
// }
