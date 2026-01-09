// import type { CollectionConfig } from 'payload'

// export const Orders: CollectionConfig = {
//   slug: 'orders',
//   admin: {
//     useAsTitle: 'createdAt',
//     defaultColumns: ['createdAt', 'customer', 'total'],
//   },
//   access: {
//     read: ({ req: { user } }) => {
//       if (user?.roles?.includes('admin')) return true
//       return {
//         customer: {
//           equals: user?.id,
//         },
//       }
//     },
//   },
//   fields: [
//     {
//       name: 'customer',
//       type: 'relationship',
//       relationTo: 'users', // Ensure this matches your users collection slug
//       required: true,
//       hasMany: false,
//       admin: {
//         position: 'sidebar',
//       },
//     },
//     {
//       name: 'total',
//       type: 'number',
//       required: true,
//       min: 0,
//     },
//     {
//       name: 'items',
//       type: 'array',
//       fields: [
//         {
//           name: 'product',
//           type: 'relationship',
//           relationTo: 'products',
//           required: true,
//         },
//         {
//           name: 'price',
//           type: 'number',
//           min: 0,
//         },
//         {
//           name: 'quantity',
//           type: 'number',
//           min: 1,
//         },
//       ],
//     },
//     // --- Stripe Specific Fields ---
//     {
//       name: 'stripePaymentIntentID',
//       type: 'text',
//       admin: {
//         position: 'sidebar',
//         readOnly: true,
//       },
//     },
//     {
//       name: 'status',
//       type: 'select',
//       defaultValue: 'pending',
//       options: [
//         { label: 'Pending', value: 'pending' },
//         { label: 'Paid', value: 'paid' },
//         { label: 'Shipped', value: 'shipped' },
//         { label: 'Cancelled', value: 'cancelled' },
//       ],
//     },
//   ],
//   timestamps: true,
// }
